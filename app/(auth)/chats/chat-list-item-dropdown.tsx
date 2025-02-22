"use client";

import { useContext } from "react";
import { UserProfileContextType } from "@/types";
import { UserProfileContext } from "../../../components/contexts";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ChatUserDropdown({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setShow } = useContext(UserProfileContext) as UserProfileContextType;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-44">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => setShow(true)}>
            View profile
          </DropdownMenuItem>
          <DropdownMenuItem>Add to archive</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Block</DropdownMenuItem>
          <DropdownMenuItem>Delete</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
