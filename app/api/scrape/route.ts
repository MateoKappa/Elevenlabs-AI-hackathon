import FireCrawl from "@mendable/firecrawl-js";
import { NextResponse } from "next/server";
import { z } from "zod";
import { generateObject, generateText } from "ai";
import { mistral } from "@ai-sdk/mistral";
import { ElevenLabsClient } from "elevenlabs";

const client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });

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

    // Extracts the url and the action from the user's message
    const {
      object: {
        actions: { action, url, message },
      },
    } = await generateObject({
      model: mistral("mistral-large-latest"),
      schema: z.object({
        actions: z.object({
          action: z.enum(["scrape", "crawl"]),
          url: z.string().url(),
          message: z.string(),
        }),
      }),
      messages: [
        {
          role: "user",
          content: userMessage,
        },
      ],
      system: `You are a web scraping assistant. Given a user's message, extract two pieces of information:
          1. The website URL they want to scrape
          2. The specific action they want to perform`,
    });

    // Scrape the content from the url
    const scrapeResult = await firecrawl.extract([url], {
      prompt: "Extract the content of the news article from the page along with the title and the urls from the images.",
      schema: schema
    });
    
    if (!scrapeResult.success) {
      throw new Error(`Failed to scrape: ${scrapeResult.error}`)
    }
    const content = scrapeResult.data.content;
    console.log({ content });

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

    console.log({text});
    const response = await client.studio.createPodcast({
        model_id: "eleven_flash_v2_5",
        mode: {
            type: "conversation",
            conversation: {
                host_voice_id: "NYC9WEgkq1u4jiqBseQ9",
                guest_voice_id: "NYC9WEgkq1u4jiqBseQ9"
            }
        },
        source: {
            text
        }
    });
    console.log({response});

    // console.log(scrapeResult.data);

    return NextResponse.json({
      success: true,
      data: scrapeResult.data,
      interpretedAction: action,
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
