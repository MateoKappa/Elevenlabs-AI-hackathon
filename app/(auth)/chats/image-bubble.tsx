import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { CardContent } from "@/components/ui/card";
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Ellipsis } from "lucide-react";
import { Tables } from "@/db/database.types";
import MessageStatusIcon from "./message-status-icon";

export default function ImageChatBubble({
  message,
}: {
  message: Tables<"chat_history">;
}) {
  const image = message.image;

  return (
    <div
      className={cn("max-w-screen-sm", {
        "self-end": message.own_message,
      })}
    >
      <div className="flex gap-2 items-center">
        <Card
          className={cn({
            "order-1 flex items-center justify-center relative":
              message.own_message,
          })}
        >
          <CardContent className="inline-flex flex-col gap-4 p-4">
            {message.content}
            {image && ( // Check if there is an image
              <figure className="relative rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                <img
                  className="aspect-[4/3] object-cover"
                  src={image}
                  alt="image"
                />
              </figure>
            )}
          </CardContent>
        </Card>
        <div className={cn({ "order-2": !message.own_message })}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                <Ellipsis className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40">
              <DropdownMenuGroup>
                <DropdownMenuItem>Forward</DropdownMenuItem>
                <DropdownMenuItem>Star</DropdownMenuItem>
                {message.own_message && (
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                )}
                <DropdownMenuItem>Delete</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div
        className={cn("flex items-center gap-2", {
          "justify-end": message.own_message,
        })}
      >
        <time
          className={cn(
            "text-sm text-muted-foreground flex items-center mt-1",
            { "justify-end": message.own_message }
          )}
        >
          05:23 PM
        </time>
        {message.own_message && <MessageStatusIcon status="read" />}
      </div>
    </div>
  );
}
