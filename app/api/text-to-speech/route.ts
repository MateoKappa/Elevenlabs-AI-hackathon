import { NextResponse } from "next/server";
import { ElevenLabsClient } from "elevenlabs";
import { createClient } from "@/supabase/server";
import ShortUniqueId from "short-unique-id";
import { upsertChat } from "@/db/chat-history/actions";

const client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { content, roomUuid, chatId } = await req.json();

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

    const { randomUUID } = new ShortUniqueId({ length: 10 });

    const supabase = await createClient();
    const { data, error } = await supabase.storage
      .from("audio")
      .upload(`${randomUUID()}.mp3`, audioBuffer);

    console.log("uploading audio", data?.fullPath, error);

    await upsertChat(roomUuid, content, data?.fullPath ?? null, null, chatId);

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
