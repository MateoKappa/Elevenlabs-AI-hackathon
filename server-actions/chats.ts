import { createClient } from "@/supabase/server";

export async function getChats() {
	try {
    const supabase = createClient()

		const { data: user } = await supabase //
			.auth
			.getUser()
		
		console.log({user})
			
		if (!user || !user.user) throw new Error("User not found");

    const { data } = await supabase //
    	.from("rooms")
			.select("*")
			.eq("user_uuid", user.user.id)
			.throwOnError();

		return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
