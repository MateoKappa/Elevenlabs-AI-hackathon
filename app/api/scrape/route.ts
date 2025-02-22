import FireCrawl from "@mendable/firecrawl-js";
import { NextResponse } from "next/server";
import { z } from "zod";
import { generateObject, generateText } from "ai";
import { mistral } from "@ai-sdk/mistral";
import { ElevenLabsClient } from "elevenlabs";

// const client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });

const firecrawl = new FireCrawl({
  apiKey: process.env.FIRECRAWL_API_KEY,
});

const schema = z.object({
  content: z.string(),
  title: z.string(),
  images: z.array(z.string()),
});

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { userMessage } = await req.json();

    const {
      object: {
        actions: { instructions, url, message, success },
      },
    } = await generateObject({
      model: mistral("mistral-large-latest"),
      schema: z.object({
        actions: z.object({
          instructions: z.string(),
          url: z.string().url(),
          message: z.string(),
          success: z.boolean(),
        }),
      }),
      messages: [
        {
          role: "user",
          content: userMessage,
        },
      ],
      system: `You are a web scraping assistant. Given a user's message:
        1. Extract the website URL they want to scrape
        2. Analyze the user's message for any specific scraping requirements:
           - Look for specific keywords or topics the user wants to focus on (e.g., "only elevenlabs", "pricing section")
           - Create precise instructions to target that specific content
           - Include instructions to find sections, headings, or content blocks related to the requested topic
           - If no specific requirements are mentioned, default to "Extract the main content of the page"
        3. If they didn't send a message return url as an empty string and success as false

        Examples:
        User: "Get me the pricing table from example.com"
        Instructions: "Focus on extracting the pricing table content. Look for elements containing price information, plan comparisons, or pricing-related data."

        User: "Get content about elevenlabs from example.com"
        Instructions: "Focus on extracting content specifically about ElevenLabs. Look for sections, headings, or content blocks that mention ElevenLabs, their products, features, or services. Ignore content about other companies or tools."`,
    });

    if (!success) {
      return NextResponse.json({
        success: false,
        message,
      });
    }

    const scrapeResult = await firecrawl.extract([url], {
      prompt: `Extract specific content from the page based on these instructions:
        ${instructions}
        
        Focus on relevance and context. If the content mentions multiple tools or services,
        only extract the parts that are directly related to the requested topic.
        Remove any unrelated content or general descriptions about other tools.`,
      schema: schema,
    });

    if (!scrapeResult.success) {
      throw new Error(`Failed to scrape: ${scrapeResult.error}`);
    }
    const content = scrapeResult.data.content;

    const { text } = await generateText({
      model: mistral("mistral-large-latest"),
      prompt: `
      Convert the content of the news article into a nice conversation between two people in a podcast.
      The conversation should be in the style of a podcast.
      The conversation should be between two people, one of them is the host and the other is the guest.
      The host should be the one who is asking the questions and the guest should be the one who is answering the questions.
      The host should be the one who is introducing the guest and the guest should be the one who is answering the questions.
      The host should be the one who is asking the questions and the guest should be the one who is answering the questions.
      
      ### Content
      ${content}
      `,
    });

    return NextResponse.json({
      success: true,
      data: scrapeResult.data,
      message,
    });
  } catch (error) {
    console.error("Scraping error:", error);
    return NextResponse.json(
      { error: "Failed to process scraping request" },
      { status: 500 }
    );
  }
}

function cleanHtml(_htmlString: string) {
  const htmlString = _htmlString
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remove script tags and contents
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "") // Remove style tags and contents
    .replace(/<link\s+[^>]*>/gi, "") // Remove link tags
    .replace(/<meta\s+[^>]*>/gi, "") // Remove meta tags
    .replace(/<!--[\s\S]*?-->/g, "") // Remove comments
    .replace(/\s(class|onclick|style|rel|target|data-\w+)=["'].*?["']/gi, "") // Remove common non-data attributes
    .replace(/\s\w+=""/g, "") // Remove empty attributes
    .replace(/\s+/g, " ") // Remove extra whitespace
    .trim(); // Trim leading and trailing whitespace

  return htmlString;
}
