import FireCrawl from "@mendable/firecrawl-js";
import { NextResponse } from "next/server";
import { z } from "zod";
import { generateObject, generateText } from "ai";
import { mistral } from "@ai-sdk/mistral";

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

    console.log("generating response", userMessage);

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

    console.log("scraping");

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

    console.log("generating text");

    const [textResult, videoPrompt] = await Promise.all([
      generateObject({
        model: mistral("mistral-large-latest"),
        schema: z.object({
          text: z.string(),
        }),
        prompt: `
        Transform the following content into an engaging, conversational narrative that's optimized for audio listening. 
        Make it feel like a natural story or explanation, avoiding technical jargon when possible. 
        Add appropriate transitions and maintain a flowing narrative structure.
        Keep the key information but present it in a way that's easy to follow when listening.
        
        Remember to:
        - Start with a hook or interesting introduction
        - Use natural transitions between topics
        - Maintain a conversational tone
        - Conclude with a clear wrap-up

        ### Content
        ${content}
        `,
      }),
      generateObject({
        model: mistral("mistral-large-latest"),
        schema: z.object({
          videoPrompt: z.string(),
        }),
        prompt: `
        You are a video scene description expert. Create a concise, visual description of the key concepts from this content that would work well for AI video generation.

        Focus on:
        - Visual elements and scenes that represent the main ideas
        - Professional setting and atmosphere
        - Key objects, actions, or demonstrations needed
        - Appropriate emotional tone
        - Clear, filmable descriptions

        Keep the description under 50 words and make it specific enough for video generation.
        Avoid abstract concepts - translate them into concrete, visual scenes.

        ### Content
        ${content}
        `,
      }),
    ]);

    console.log({
      text: textResult.object.text,
      video_prompt: videoPrompt.object.videoPrompt,
    });

    return NextResponse.json({
      text: textResult.object.text,
      video_prompt: videoPrompt.object.videoPrompt,
    });
  } catch (error) {
    console.error("Scraping error:", error);
    return NextResponse.json(
      { error: "Failed to process scraping request" },
      { status: 500 }
    );
  }
}
