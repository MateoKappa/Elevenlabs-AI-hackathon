"server only";
import { createClient } from "@/supabase/server";
import { Tables } from "../database.types";
import { User } from "@supabase/supabase-js";

export async function upsertChat(
  room_uuid: string,
  content: string,
  audio: string | null,
  video: string | null,
  chat_id?: string
) {
  try {
    const supabase = await createClient();

    const { data } = await supabase
      .from("chat_history")
      .upsert({
        id: chat_id,
        room_uuid,
        content,
        audio,
        video,
        type: "TEXT",
      })
      .select()
      .throwOnError();

    return data[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateChat(
  chatId: string,
  updates: Partial<Tables<"chat_history">>,
  user: User
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("chat_history")
    .update(updates)
    .eq("id", chatId)
    .eq("room.user_uuid", user.id)
    .throwOnError();

  return error;
}
