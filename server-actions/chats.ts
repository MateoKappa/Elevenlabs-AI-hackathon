import { createClient } from "@/supabase/server";

export async function getChats() {
	try {
    const supabase = await createClient()

		// const { data: user } = await supabase //
		// 	.auth
		// 	.getUser()
		
		// console.log({user})
		
		// if (!user || !user.user) throw new Error("User not found");
		
		const userUuid = 'be1ca6b8-e04b-4188-bd44-66d38e7d454f'

    const { data: rooms } = await supabase //
    	.from("rooms")
			.select("*")
			.eq("user_uuid", userUuid)
			.throwOnError();

		if (!rooms || rooms.length === 0) {
			return { rooms: [], messages: [] };
		}

		const { data: messages } = await supabase //
			.from("chat_history")
			.select("*")
			.in("room_uuid", rooms.map(room => room.id))
			.order("created_at", { ascending: true })
			.throwOnError();

		return rooms.map((room) => ({
			...room,
			user: {
				id: userUuid,
				name: "John Doe",
				avatar: "https://via.placeholder.com/150",
			},
			messages: messages?.filter((message) => message.room_uuid === room.id),
			last_message: messages?.find((message) => message.room_uuid === room.id),
		}));
	} catch (error) {
		console.error(error);
		throw error;
	}
}
