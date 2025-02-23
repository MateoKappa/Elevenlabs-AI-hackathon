"use server";

import type { Tables } from "@/db/database.types";
import { createClient } from "@/supabase/server";
import { updateChat } from "@/db/chat-history/actions";
import { getRoom } from "@/db/rooms/actions";

export async function getChats() {
  try {
    const supabase = await createClient();

    const { data: user } = await supabase.auth //
      .getUser();

    if (!user || !user.user) throw new Error("User not found");

    const { data: rooms } = await supabase //
      .from("rooms")
      .select("*")
      .eq("user_uuid", user.user.id)
      .throwOnError();

    if (!rooms || rooms.length === 0) {
      return { rooms: [], messages: [] };
    }

    const { data: messages } = await supabase //
      .from("chat_history")
      .select("*")
      .in(
        "room_uuid",
        rooms.map((room) => room.id)
      )
      .order("created_at", { ascending: true })
      .throwOnError();

    return rooms.map((room) => ({
      ...room,
      user: {
        id: user.user.id,
        name: user.user.user_metadata.name,
        avatar: user.user.user_metadata.avatar_url,
      },
      messages: messages?.filter((message) => message.room_uuid === room.id),
      last_message: messages?.find((message) => message.room_uuid === room.id),
    }));
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function validateAndUpdateChatRow(
  roomId: string,
  updates: Partial<Tables<"chat_history">>
) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("User not found");

    const room = await getRoom(roomId);

    if (!room) throw new Error("Room not found");

    const error = await updateChat(updates);

    if (error) throw new Error("Error updating chat");

    return true;
  } catch (error) {
    console.error("Error updating chat:", error);
    throw error;
  }
}
