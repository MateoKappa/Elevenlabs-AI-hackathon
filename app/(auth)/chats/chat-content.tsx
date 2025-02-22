"use client";

import { useContext, useEffect, useRef } from "react";
import { ChatMessageProps, SelectedChatContextType } from "@/types";

import ChatFooter from "./chat-footer";
import ChatHeader from "./chat-header";
import ChatBubble from "./chat-bubbles";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SelectedChatContext } from "@/components/contexts";
import UserDetailSheet from "./user-detail-sheet";

export default function ChatContent() {
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const { selectedChat } = useContext(
    SelectedChatContext
  ) as SelectedChatContextType;

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollIntoView(false);
    }
  }, [selectedChat]);

  console.log(selectedChat, "selectedChat");

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

  const chat = selectedChat?.messages;

  return (
    <div className="flex flex-col z-50 inset-0 bg-background lg:bg-transparent fixed lg:relative p-4 lg:p-0">
      <ChatHeader user={selectedChat.user} />
      <ScrollArea className="w-full h-screen lg:h-[calc(100vh_-_13.8rem)] py-4 relative">
        <div ref={messagesContainerRef}>
          <div className="bg-gradient-to-b from-muted from-30% absolute start-0 end-0 top-0 h-[50px] pointer-events-none z-10"></div>
          <div className="flex flex-col items-start py-8 space-y-10 ">
            {chat &&
              chat.length > 0 &&
              chat.map((item: ChatMessageProps) => (
                <ChatBubble message={item} type={item.type} key={item.id} />
              ))}
          </div>
        </div>
      </ScrollArea>
      <ChatFooter />
      <UserDetailSheet user={selectedChat.user} />
    </div>
  );
}
