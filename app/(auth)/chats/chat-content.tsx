"use client";

import { useContext, useEffect, useRef, useState } from "react";
import type { SelectedChatContextType } from "@/types";

import Input from "./input";
import ChatBubble from "./chat-bubbles";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SelectedChatContext } from "@/components/contexts";
import type { Tables } from "@/db/database.types";
import ChatHeader from "./header";

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
    setMessages(selectedChat?.messages ?? []);
  }, [selectedChat]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 250); // 1 second delay

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
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
      <ChatHeader user={selectedChat.user} />

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
        messagesContainerRef={messagesContainerRef}
      />

      {/* <UserDetailSheet user={selectedChat.user} /> */}
    </div>
  );
}
