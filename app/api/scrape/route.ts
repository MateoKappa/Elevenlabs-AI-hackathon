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
      prompt:
        "Extract the content of the news article from the page along with the title and the urls from the images.",
      schema: schema,
    });

    if (!scrapeResult.success) {
      throw new Error(`Failed to scrape: ${scrapeResult.error}`);
    }
    const content = scrapeResult.data.content;
    console.log({ content });

    const response = await client.textToSpeech.convert("CYw3kZ02Hs0563khs1Fj", {
      output_format: "mp3_44100_128",
      text: content,
      model_id: "eleven_multilingual_v2"
  });

  const chunks = [];
  for await (const chunk of response) {
    if (chunk) {
      chunks.push(chunk)
    }
  }
  const audioBuffer = Buffer.concat(chunks)

  console.log({audioBuffer});

    // const { text } = await generateText({
    //   model: mistral("mistral-large-latest"),
    //   prompt: `
    //   Convert the content of the news article into a nice conversation between two people in a podcast.
    //   The conversation should be in the style of a podcast.
    //   The conversation should be between two people, one of them is the host and the other is the guest.
    //   The host should be the one who is asking the questions and the guest should be the one who is answering the questions.
    //   The host should be the one who is introducing the guest and the guest should be the one who is answering the questions.
    //   The host should be the one who is asking the questions and the guest should be the one who is answering the questions.
      
    //   ### Content
    //   ${content}
    //   `,
    // });

    // console.log({text});
    // const response = await client.studio.createPodcast({
    //     model_id: "eleven_multilingual_v2",
    //     mode: {
    //         type: "conversation",
    //         conversation: {
    //             host_voice_id: "CYw3kZ02Hs0563khs1Fj",
    //             guest_voice_id: "AZnzlk1XvdvUeBnXmlld"
    //         }
    //     },
    //     source: [{
    //       type: "text",
    //       text: text
    //     }]
    // });
    // console.log({response});

    // console.log(scrapeResult.data);

    return new NextResponse(audioBuffer, {
      headers: { 'Content-Type': 'audio/mpeg' },
    })
  } catch (error) {
    console.error("Scraping error:", error);
    return NextResponse.json(
      { error: "Failed to process scraping request" },
      { status: 500 }
    );
  }
}