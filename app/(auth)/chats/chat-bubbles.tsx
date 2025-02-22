import { ChatMessageProps } from "@/types";
import { cn } from "@/lib/utils";

import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Ellipsis, FileIcon, PlayIcon } from "lucide-react";
import MessageStatusIcon from "./message-status-icon";

function TextChatBubble({ message }: { message: ChatMessageProps }) {
  return (
    <div
      className={cn("max-w-screen-sm", {
        "self-end": message.own_message,
      })}
    >
      <div className="flex gap-2 items-center">
        <Card className={cn({ "order-1": message.own_message })}>
          <CardContent className="inline-flex p-4">
            {message.content}
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

function FileChatBubble({ message }: { message: ChatMessageProps }) {
  return (
    <div
      className={cn("max-w-screen-sm", {
        "self-end": message.own_message,
      })}
    >
      <div className="flex gap-2 items-center">
        <Card className={cn({ "order-1": message.own_message })}>
          <CardContent className="inline-flex items-center p-4">
            <FileIcon className="w-8 h-8 opacity-50 me-4" strokeWidth={1.5} />
            <div className="flex flex-col gap-2">
              <div>
                {message.data?.file_name}
                <span className="text-sm text-muted-foreground ms-2">
                  ({message.data?.size})
                </span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Download
                </Button>
                <Button variant="outline" size="sm">
                  Preview
                </Button>
              </div>
            </div>
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

function VideoChatBubble({ message }: { message: ChatMessageProps }) {
  return (
    <div
      className={cn("max-w-screen-sm", {
        "self-end": message.own_message,
      })}
    >
      <div className="flex gap-4 items-center">
        <div
          style={{ backgroundImage: `url(${message?.data?.cover})` }}
          className={cn(
            "order-1 cursor-pointer self-start w-52 aspect-[4/3] flex-shrink-0 bg-cover rounded-lg flex items-center justify-center relative hover:opacity-90 transition-opacity"
          )}
        >
          <PlayIcon className="text-white/80 w-8 h-8" />
          <div className="absolute top-2 end-2 text-white/60 text-xs font-semibold">
            {message?.data?.duration}
          </div>
        </div>
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

function SoundChatBubble({ message }: { message: ChatMessageProps }) {
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
          <CardContent className="inline-flex gap-4 p-4">
            {message.content}
            <audio id="song" className="block w-80" controls>
              <source src={message?.data?.path} type="audio/mpeg" />
            </audio>
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

function ImageChatBubble({ message }: { message: ChatMessageProps }) {
  const images_limit = 4;
  const images = message?.data?.images ?? [];
  const images_with_limit = images.slice(0, images_limit);

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
          <CardContent className="inline-flex gap-4 p-4">
            {message.content}
            {images.length && (
              <div
                className={cn("grid gap-2", {
                  "grid-cols-1": images.length === 1,
                  "grid-cols-2": images.length > 1,
                })}
              >
                {images_with_limit.map((image, key) => (
                  <figure
                    className="relative rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                    key={key}
                  >
                    <img
                      className="aspect-[4/3] object-cover"
                      key={key}
                      src={image}
                      alt="image"
                    />
                    {key + 1 === images_limit && (
                      <div className="text-3xl text-white flex items-center justify-center font-semibold absolute inset-0 bg-black/40">
                        +{images.length - images_with_limit.length}
                      </div>
                    )}
                  </figure>
                ))}
              </div>
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

export default function ChatBubble({
  message,
  type,
}: {
  message: ChatMessageProps;
  type?: string;
}) {
  switch (type) {
    case "text":
      return <TextChatBubble message={message} />;
    case "video":
      return <VideoChatBubble message={message} />;
    case "sound":
      return <SoundChatBubble message={message} />;
    case "image":
      return <ImageChatBubble message={message} />;
    case "file":
      return <FileChatBubble message={message} />;
    default:
      break;
  }
}
