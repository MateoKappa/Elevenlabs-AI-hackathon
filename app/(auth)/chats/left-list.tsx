"use client";

import { useContext, useState, useEffect } from "react";

import { Search } from "lucide-react";
import ChatListItem from "./list-item";
import { SelectedChatContext } from "@/components/contexts";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ChatRoomProps } from "@/types";

export default function ChatList({
  rooms: initialRooms,
}: {
  rooms: ChatRoomProps[];
}) {
  const context = useContext(SelectedChatContext);
  const { selectedChat, setSelectedChat, rooms, setRooms } = context || {
    selectedChat: null,
    rooms: [],
  };
  const [searchTerm, setSearchTerm] = useState("");

  // Initialize rooms state with initial rooms if rooms is empty
  useEffect(() => {
    if (initialRooms.length > 0 && (!rooms || rooms.length === 0) && setRooms) {
      setRooms(initialRooms);
    }
  }, [initialRooms, rooms, setRooms]);

  // Set initial selected chat if none is selected
  useEffect(() => {
    if (rooms.length > 0 && !selectedChat && setSelectedChat) {
      setSelectedChat(rooms[0]);
    }
  }, [rooms, selectedChat, setSelectedChat]);

  const filteredChats = rooms.filter((room) =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.trim());
  };

  return (
    <>
      <div className="py-3 px-6 relative flex items-center">
        <Search className="absolute w-4 h-4 start-10 text-muted-foreground" />
        <Input
          type="text"
          className="ps-10"
          placeholder="Chats search..."
          onChange={handleSearch}
          value={searchTerm}
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
