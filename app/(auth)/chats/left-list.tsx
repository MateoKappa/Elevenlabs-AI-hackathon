"use client";

import { useContext, useState } from "react";

import { Search } from "lucide-react";
import ChatListItem from "./list-item";
import { SelectedChatContext } from "@/components/contexts";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect } from "react";
import type { ChatRoomProps } from "@/types";

export default function ChatList({ rooms }: { rooms: ChatRoomProps[] }) {
  const context = useContext(SelectedChatContext);
  const { selectedChat, setSelectedChat } = context || { selectedChat: null };
  const [filteredChats, setFilteredChats] = useState(rooms);

  const changeHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.trim();

    const filteredItems = rooms.filter((room) =>
      room.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredChats(filteredItems);
  };

  useEffect(() => {
    if (rooms.length > 0 && setSelectedChat) {
      setSelectedChat(rooms[0]);
    }
  }, [rooms, setSelectedChat]);

  return (
    <>
      <div className="py-3 px-6 relative flex items-center">
        <Search className="absolute w-4 h-4 start-10 text-muted-foreground" />
        <Input
          type="text"
          className="ps-10"
          placeholder="Chats search..."
          onChange={changeHandle}
        />
      </div>

      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="relative divide-y">
          {filteredChats.length ? (
            filteredChats.map((room) => (
              <ChatListItem
                room={room}
                key={room.id}
                active={selectedChat && selectedChat.id === room.id}
              />
            ))
          ) : (
            <div className="text-center text-muted-foreground text-sm mt-4">
              No chats found
            </div>
          )}
        </div>
      </ScrollArea>
    </>
  );
}
