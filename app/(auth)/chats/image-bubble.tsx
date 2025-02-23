import { Card } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Tables } from "@/db/database.types";
import MessageStatusIcon from "./message-status-icon";
import moment from "moment";

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
                  alt="image-message"
                />
              </figure>
            )}
          </CardContent>
        </Card>
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
          {moment(message.created_at).format("DD MM HH:mm")}
        </time>
      </div>
    </div>
  );
}
