import { useContext } from "react";
import { cn } from "@/lib/utils";
import { SelectedStatusContextType, StatusItemProps } from "@/types";
import { generateAvatarFallback } from "@/lib/generate-avatar-fallback";

import ListItemDropdown from "./list-item-dropdown";
import { SelectedStatusContext } from "@/components/contexts";
import UserAvatar from "@/components/user-avatar";

export default function StatusListItem({
  status,
  active,
}: {
  status: StatusItemProps;
  active: boolean | null;
}) {
  const { setSelectedStatus } = useContext(
    SelectedStatusContext
  ) as SelectedStatusContextType;

  const handleClick = (status: StatusItemProps) => {
    setSelectedStatus(status);
  };

  return (
    <div
      onClick={() => handleClick(status)}
      className={cn(
        "flex items-center gap-4 py-4 px-6 hover:bg-muted group cursor-pointer min-w-0 relative",
        { "!bg-gray-200 dark:!bg-muted": active }
      )}
    >
      <UserAvatar
        image={status.user.avatar}
        className="border p-1 border-green-600"
        fallback={generateAvatarFallback(status.user.name)}
      />
      <div className="flex-1">
        <div className="flex flex-col gap-1 justify-between">
          <span className="font-semibold">{status.user.name}</span>
          <span className="text-sm text-muted-foreground">{status.date}</span>
        </div>
      </div>
      <div className="absolute opacity-0 group-hover:opacity-100 end-4">
        <ListItemDropdown />
      </div>
    </div>
  );
}
