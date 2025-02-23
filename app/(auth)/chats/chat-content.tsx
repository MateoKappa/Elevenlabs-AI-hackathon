"use client";

import { useContext, useEffect, useRef, useState } from "react";
import type { SelectedChatContextType } from "@/types";

import Input from "./input";
import ChatBubble from "./chat-bubbles";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SelectedChatContext } from "@/components/contexts";
import type { Tables } from "@/db/database.types";

export default function ChatContent() {
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const { selectedChat } = useContext(
    SelectedChatContext
  ) as SelectedChatContextType;

  const roomId = selectedChat?.id;

  const [messages, setMessages] = useState<Tables<"chat_history">[]>(
    selectedChat?.messages ?? []
  );

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollIntoView(false);
    }
    setMessages(selectedChat?.messages ?? []);
  }, [selectedChat]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (!selectedChat) {
    return (
      <figure className="text-center h-full hidden lg:flex items-center justify-center">
        <p className="text-muted-foreground">No chat selected.</p>
      </figure>
    );
  }

  const chat = messages;

  return (
    <div className="h-full flex justify-between flex-col z-50 inset-0 bg-background lg:bg-transparent fixed lg:relative p-4 lg:p-0">
      <ScrollArea className="w-full h-screen py-4 relative">
        <div className="flex flex-col items-start py-8 space-y-10 ">
          {chat &&
            chat.length > 0 &&
            chat.map((item) => (
              <ChatBubble
                message={item}
                type={item.type ?? "text"}
                key={item.id.toString()}
              />
            ))}
        </div>
        <div ref={messagesContainerRef} />
      </ScrollArea>

      <Input
        messages={messages}
        setMessages={setMessages}
        roomId={roomId ?? ""}
      />

      {/* <UserDetailSheet user={selectedChat.user} /> */}
    </div>
  );
}
