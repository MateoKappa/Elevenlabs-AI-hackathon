import { useContext } from "react";
import { cn } from "@/lib/utils";
import type { ChatRoomProps, SelectedChatContextType } from "@/types";

import { generateAvatarFallback } from "@/lib/generate-avatar-fallback";
import { SelectedChatContext } from "@/components/contexts";
import UserAvatar from "@/components/user-avatar";
import moment from "moment";

export default function ChatListItem({
  room,
  active,
}: {
  room: ChatRoomProps;
  active: boolean | null;
}) {
  const { setSelectedChat } = useContext(
    SelectedChatContext
  ) as SelectedChatContextType;

  const handleClick = (room: ChatRoomProps) => setSelectedChat(room);

  return (
    <button
      type="button"
      onClick={() => handleClick(room)}
      className={cn(
        "flex items-center gap-4 py-4 px-6 w-full hover:bg-muted group cursor-pointer min-w-0 relative",
        { "!bg-gray-200 dark:!bg-muted": active }
      )}
    >
      <UserAvatar
        fallback={generateAvatarFallback(room.name)}
      />
      <div className="flex-grow min-w-0">
        <div className="flex justify-between">
          <span className="font-semibold">{room.name}</span>
          <span className="text-sm text-muted-foreground">{moment(room.created_at).format("DD/MM HH:mm")}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="truncate text-start text-muted-foreground">
            {room.last_message?.content}
          </span>
        </div>
      </div>
    </button>
  );
}
