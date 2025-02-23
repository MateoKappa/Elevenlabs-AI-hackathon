"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Image from "next/image";

import {
  Archive,
  ChevronDownIcon,
  CircleDotDashed,
  LogOut,
  Menu,
  MessageCircle,
  Settings,
  Users,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ModeToggle } from "./mode-toggle";
import { SettingsDialog } from "./settings-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";

function Aside() {
  const pathname = usePathname();

  return (
    <aside className="fixed start-0 top-0 flex min-h-screen inset-y-0 left-0 z-10 w-20 flex-col border-r bg-background pt-2">
      <nav className="flex flex-col items-center gap-4 p-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/chats"
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-10 md:w-10",
                  { "bg-accent": pathname === "/chats" }
                )}
              >
                <MessageCircle className="h-6 w-6" />
                <span className="sr-only">Chats</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Chats</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 py-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/archive"
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-10 md:w-10",
                  { "bg-accent": pathname === "/archive" }
                )}
              >
                <Archive className="h-6 w-6" />
                <span className="sr-only">Archived messages</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Archived messages</TooltipContent>
          </Tooltip>
          <ModeToggle />
          <SettingsDialog>
            <div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-10 md:w-10">
                    <Settings className="h-6 w-6" />
                    <span className="sr-only">Settings</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">Settings</TooltipContent>
              </Tooltip>
            </div>
          </SettingsDialog>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/login"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-10 md:w-10"
              >
                <LogOut className="h-6 w-6" />
                <span className="sr-only">Logout</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Logout</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </nav>
    </aside>
  );
}

function BottomBar() {
  const pathname = usePathname();

  return (
    <aside className="fixed start-0 end-0 bottom-0 flex z-10 flex-col bg-background py-4 border-t">
      <nav className="flex flex-row items-center justify-around gap-4">
        <Link
          href="/chats"
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-10 md:w-10",
            { "bg-accent": pathname === "/chats" }
          )}
        >
          <MessageCircle className="h-6 w-6" />
          <span className="sr-only">Chats</span>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-10 h-10 p-0">
              <Menu className="h-6 w-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Archived messages</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </aside>
  );
}

export default function Sidebar() {
  return (
    <>
      <div className="hidden lg:block">
        <Aside />
      </div>
      <div className="block lg:hidden">
        <BottomBar />
      </div>
    </>
  );
}
