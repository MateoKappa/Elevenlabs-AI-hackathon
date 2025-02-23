"use client";

import { useContext, useEffect, useRef, useState } from "react";
import type {
  ChatMessageProps,
  ChatRoomProps,
  SelectedChatContextType,
} from "@/types";

import Input from "./input";
import ChatBubble from "./chat-bubbles";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SelectedChatContext } from "@/components/contexts";
import UserDetailSheet from "./user-detail-sheet";

export default function ChatContent() {
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const { selectedChat } = useContext(
    SelectedChatContext
  ) as SelectedChatContextType;

  const [messages, setMessages] = useState<ChatRoomProps["messages"]>(
    selectedChat?.messages
  );

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollIntoView(false);
    }
    setMessages(selectedChat?.messages);
  }, [selectedChat]);

  if (!selectedChat) {
    return (
      <figure className="text-center h-full hidden lg:flex items-center justify-center">
        <img
          className="max-w-sm block dark:hidden"
          src="/not-selected-chat.svg"
          alt="..."
        />
        <img
          className="max-w-sm hidden dark:block"
          src="/not-selected-chat-light.svg"
          alt="..."
        />
      </figure>
    );
  }

  const chat = messages;

  return (
    <div className="flex flex-col z-50 inset-0 bg-background lg:bg-transparent fixed lg:relative p-4 lg:p-0">
      <ScrollArea className="w-full h-screen lg:h-[calc(100vh_-_13.8rem)] py-4 relative">
        <div ref={messagesContainerRef}>
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
        </div>
      </ScrollArea>

      <Input messages={messages} setMessages={setMessages} />

      <UserDetailSheet user={selectedChat.user} />
    </div>
  );
}
