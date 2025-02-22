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
    const { content } = await req.json();

    const response = await client.textToSpeech.convert("CYw3kZ02Hs0563khs1Fj", {
      output_format: "mp3_44100_128",
      text: content,
      model_id: "eleven_multilingual_v2",
    });

    const chunks = [];
    for await (const chunk of response) {
      if (chunk) {
        chunks.push(chunk);
      }
    }
    const audioBuffer = Buffer.concat(chunks);

    console.log("returning response");
    return new NextResponse(audioBuffer, {
      headers: { "Content-Type": "audio/mpeg" },
    });
  } catch (error) {
    console.error("Scraping error:", error);
    return NextResponse.json(
      { error: "Failed to process scraping request" },
      { status: 500 }
    );
  }
}
