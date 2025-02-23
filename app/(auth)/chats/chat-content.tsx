"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { ChatMessageProps, SelectedChatContextType } from "@/types";

import ChatFooter from "./chat-footer";
import ChatHeader from "./chat-header";
import ChatBubble from "./chat-bubbles";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SelectedChatContext } from "@/components/contexts";
import UserDetailSheet from "./user-detail-sheet";

const test = [
  { id: 1, content: "Hello", type: "text" },
  { id: 2, content: "Hello", type: "text" },
  { id: 3, content: "Hello", type: "text" },
  { id: 4, content: "Hello", type: "text" },
];

export default function ChatContent() {
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const { selectedChat } = useContext(
    SelectedChatContext
  ) as SelectedChatContextType;

  const [messages, setMessages] = useState<ChatMessageProps[]>(
    selectedChat?.messages ?? test
  );

  // Add new state for tracking current audio position
  const [currentAudioPosition, setCurrentAudioPosition] = useState<number>(0);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollIntoView(false);
    }
    setMessages(selectedChat?.messages ?? test);
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

  console.log(messages);

  return (
    <div className="flex flex-col z-50 inset-0 bg-background lg:bg-transparent fixed lg:relative p-4 lg:p-0">
      <ChatHeader user={selectedChat.user} />

      <ScrollArea className="w-full h-screen lg:h-[calc(100vh_-_13.8rem)] py-4 relative">
        <div ref={messagesContainerRef}>
          <div className="flex flex-col items-start py-8 space-y-10 ">
            {chat &&
              chat.length > 0 &&
              chat.map((item: ChatMessageProps) => (
                <ChatBubble
                  message={item}
                  type={item.type ?? "text"}
                  key={item.id}
                />
              ))}
          </div>
        </div>
      </ScrollArea>

      <ChatFooter
        messages={messages}
        setMessages={setMessages}
        setCurrentAudioPosition={setCurrentAudioPosition}
      />

      <UserDetailSheet user={selectedChat.user} />
    </div>
  );
}
