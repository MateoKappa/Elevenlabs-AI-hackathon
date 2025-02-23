"use client";

import { ArrowLeft, Ellipsis, Phone, PhoneCall, Video, X } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
// import ChatUserDropdown from "./chat-list-item-dropdown";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
// import type { UserPropsTypes } from "./types";
import UserAvatar from "@/components/user-avatar";
// import { generateAvatarFallback } from "@/lib/utils";
// import useChatStore from "@/store/chatStore";
import { Tables } from "@/db/database.types";
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
