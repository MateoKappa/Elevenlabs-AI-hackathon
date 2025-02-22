"use client";

import { useContext } from "react";
import { SelectedChatContextType, UserPropsTypes } from "@/types";
import { generateAvatarFallback } from "@/lib/generate-avatar-fallback";

import { ArrowLeft, Ellipsis, Phone, PhoneCall, Video, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ChatUserDropdown from "./chat-list-item-dropdown";
import UserAvatar from "@/components/user-avatar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SelectedChatContext } from "@/components/contexts";
import { Button } from "@/components/ui/button";

export default function ChatHeader({ user }: { user: UserPropsTypes }) {
  const { setSelectedChat } = useContext(
    SelectedChatContext
  ) as SelectedChatContextType;

  return (
    <div className="flex gap-4 justify-between">
      <div className="flex gap-4">
        <Button
          size="sm"
          variant="outline"
          className="w-10 h-10 p-0 flex lg:hidden"
          onClick={() => setSelectedChat(null)}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <UserAvatar
          image={user.avatar}
          indicator={user.online_status}
          fallback={generateAvatarFallback(user.name)}
        />
        <div className="flex flex-col">
          <span className="font-semibold">{user.name}</span>
          {user.online_status == "success" ? (
            <span className="text-sm text-green-500">Online</span>
          ) : (
            <span className="text-sm text-muted-foreground">
              {user.last_seen}
            </span>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <div className="lg:gap-2 hidden lg:flex">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Video className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="flex justify-between items-center top-8 translate-y-0">
                      <div className="flex items-center gap-4">
                        <UserAvatar
                          className="w-20 h-20"
                          image="/avatars/1.png"
                        />
                        <div className="text-lg">Jennica calling ...</div>
                      </div>
                      <div className="flex gap-4">
                        <DialogClose asChild>
                          <Button className="p-0 w-12 h-12 rounded-full bg-red-600 hover:bg-red-700">
                            <X />
                          </Button>
                        </DialogClose>
                        <Button className="p-0 w-12 h-12 rounded-full bg-green-600 hover:bg-green-700">
                          <Phone />
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">Start Video Chat</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <PhoneCall className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="flex justify-between items-center top-8 translate-y-0">
                      <div className="flex items-center gap-4">
                        <UserAvatar
                          className="w-20 h-20"
                          image="/avatars/1.png"
                        />
                        <div className="text-lg">Jennica calling ...</div>
                      </div>
                      <div className="flex gap-4">
                        <DialogClose asChild>
                          <Button className="p-0 w-12 h-12 rounded-full bg-red-600 hover:bg-red-700">
                            <X />
                          </Button>
                        </DialogClose>
                        <Button className="p-0 w-12 h-12 rounded-full bg-green-600 hover:bg-green-700">
                          <Phone />
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">Start Call</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <ChatUserDropdown>
          <Button size="sm" variant="ghost" className="w-10 h-10 p-0">
            <Ellipsis className="w-4 h-4" />
          </Button>
        </ChatUserDropdown>
      </div>
    </div>
  );
}
