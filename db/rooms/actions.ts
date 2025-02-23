import { createClient } from "@/supabase/server";

export const getRoom = async (roomId: string) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User not found");

  const { data: rooms } = await supabase //
    .from("rooms")
    .select("*")
    .eq("user_uuid", user.id)
    .eq("id", roomId)
    .throwOnError();

  return rooms;
};
