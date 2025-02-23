"server only";
import { createClient } from "@/supabase/server";
import type { Tables } from "../database.types";

export type ChatHistoryUpdate = Omit<Partial<Tables<"chat_history">>, "room_uuid"> & { room_uuid: string };

export async function upsertChat(
  updates: ChatHistoryUpdate
) {
  try {
    const supabase = await createClient();

    const { data } = await supabase
      .from("chat_history")
      .upsert(updates)
      .select()
      .throwOnError();

    return data[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateChat(updates: Partial<Tables<"chat_history">>) {
  if (!updates.id) throw new Error("Chat ID is required");

  const supabase = await createClient();

  const { error } = await supabase
    .from("chat_history")
    .update(updates)
    .eq("id", updates.id)
    .throwOnError();

  return error;
}
