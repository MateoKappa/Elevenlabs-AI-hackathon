"use client";

import { useContext, useState } from "react";
import type { ChatItemProps } from "@/types";

import { Search } from "lucide-react";
import ChatListItem from "./chat-list-item";
import { SelectedChatContext } from "@/components/contexts";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect } from "react";

export default function ChatList({ chats }: { chats: ChatItemProps[] }) {
  const context = useContext(SelectedChatContext);
  const { selectedChat, setSelectedChat } = context || { selectedChat: null };
  const [filteredChats, setFilteredChats] = useState(chats);

  const changeHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.trim();

    const filteredItems = chats.filter((chat) =>
      chat.user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredChats(filteredItems);
  };

  useEffect(() => {
    if (chats.length > 0 && setSelectedChat) {
      setSelectedChat(chats[0]);
    }
  }, [chats, setSelectedChat]);

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
      <div className="h-[calc(100vh_-_13rem)] lg:h-[calc(100vh_-_15.8rem)] flex lg:pt-4">
        <ScrollArea className="w-full min-w-0">
          <div className="block divide-y min-w-0">
            {filteredChats.length ? (
              filteredChats.map((chat) => (
                <ChatListItem
                  chat={chat}
                  key={chat.id}
                  active={selectedChat && selectedChat.id === chat.id}
                />
              ))
            ) : (
              <div className="text-center text-muted-foreground text-sm mt-4">
                No chat found
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
