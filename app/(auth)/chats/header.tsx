"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/user-avatar";
import { useContext } from "react";
import { SelectedChatContext } from "@/components/contexts";
import { generateAvatarFallback } from "@/lib/generate-avatar-fallback";

export default function ChatHeader({ user }: {
  user: {
    name: string;
    avatar: string;
  }
}) {
  const context = useContext(SelectedChatContext);
  const { setSelectedChat } = context || { selectedChat: null };

  return (
    <div className="flex justify-between gap-4">
      <div className="flex items-center gap-4">
        <Button
          size="sm"
          variant="outline"
          className="flex h-10 w-10 p-0 lg:hidden"
          onClick={() => setSelectedChat?.(null)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <UserAvatar
          fallback={generateAvatarFallback(user.name)}
        />

        <div className="flex flex-col">
          <span className="font-semibold">{user.name}</span>
        </div>
      </div>
    </div>
  );
}
