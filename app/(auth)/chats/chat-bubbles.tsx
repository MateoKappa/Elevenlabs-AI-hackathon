import { ChatMessageProps } from "@/types";
import { cn } from "@/lib/utils";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Ellipsis,
  FileIcon,
  PauseCircle,
  PlayCircle,
  PlayIcon,
} from "lucide-react";
import MessageStatusIcon from "./message-status-icon";
import { useWavesurfer } from "@wavesurfer/react";
import { useEffect, useRef, useState } from "react";
import { useCallback } from "react";

interface ChatBubbleProps {
  message: ChatMessageProps;
  type: string;
  currentAudioPosition: number;
  audio?: string;
}

function TextChatBubble({
  message,
  currentAudioPosition,
}: {
  message: ChatMessageProps;
  currentAudioPosition: number;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [localAudioPosition, setLocalAudioPosition] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const { wavesurfer, isPlaying } = useWavesurfer({
    container: containerRef,
    height: 44,
    barGap: 2,
    barRadius: 4,
    barWidth: 3,
    barHeight: 1,
    waveColor: "#d1a0b5",
    progressColor: "#a3426c",
    cursorWidth: 0,
    interact: true,
    fillParent: true,
    hideScrollbar: true,
    url: message.audio,
  });

  const playPause = useCallback(() => {
    if (!wavesurfer) return;

    console.log("isPlaying", isPlaying);
    if (isPlaying) wavesurfer.pause();
    else wavesurfer.play();
  }, [isPlaying, wavesurfer]);

  useEffect(() => {
    if (!containerRef.current) return;
    if (!wavesurfer) return;

    wavesurfer.on("interaction", () => {
      wavesurfer.play();
      setIsFinished(false);
    });

    wavesurfer.on("audioprocess", () => {
      setLocalAudioPosition(wavesurfer.getCurrentTime());
    });

    wavesurfer.on("finish", () => {
      wavesurfer.stop();
      setIsFinished(true);
    });

    // Auto-play when ready
    wavesurfer.on("ready", () => {
      wavesurfer.play();
    });

    return () => {
      wavesurfer.destroy();
    };
  }, [wavesurfer]);

  const CHARS_PER_SECOND = 14.5;

  const renderStreamingText = (text: string) => {
    if (isFinished) return <span className="whitespace-pre-wrap">{text}</span>;

    const currentPosition = Math.floor(localAudioPosition * CHARS_PER_SECOND);
    return (
      <span className="whitespace-pre-wrap">
        {text.slice(0, currentPosition)}
      </span>
    );
  };

  const isLoading =
    message.state === "creating_text" || message.state === "creating_audio";

  const isCreatingVideo = message.state === "creating_video";
  const videoCreated = message.state === "idle" && message.video;

  return (
    <div
      className={cn("max-w-screen-sm", {
        "self-end": message.own_message,
      })}
    >
      <div className="flex gap-2 items-center">
        <div className="flex flex-col gap-2">
          <Card className={cn({ "order-1": message.own_message })}>
            <CardContent className="p-4 flex flex-col">
              {isLoading ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="h-4 bg-red-500 rounded animate-pulse w-4" />
                    <span className="text-sm text-muted-foreground">
                      {message.state === "creating_text"
                        ? "Generating response..."
                        : "Creating audio..."}
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  {message.own_message || !message.audio
                    ? message.content
                    : renderStreamingText(message.content ?? "")}
                </>
              )}
              {message.audio && (
                <div className="mt-3 flex flex-row items-center gap-1 rounded-full border border-bright-plum-50 min-w-[550px] bg-bright-plum-7 px-3 py-1 text-sm">
                  {isLoading ? (
                    <div className="w-full h-11 bg-bright-plum-50/20 rounded-full animate-pulse" />
                  ) : (
                    <>
                      <button
                        className="shrink-0 text-bright-plum"
                        type="button"
                        onClick={playPause}
                      >
                        {isPlaying ? (
                          <PauseCircle size={32} />
                        ) : (
                          <PlayCircle size={32} />
                        )}
                      </button>
                      <div className="ml-1 h-full w-full" ref={containerRef} />
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
          {isCreatingVideo && (
            <Card className="w-fit">
              <CardContent className="p-4 w-fit">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="h-4 bg-red-500 rounded animate-pulse w-4" />
                    <span className="text-sm text-muted-foreground">
                      Creating video...
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          {videoCreated && (
            <Card className="w-fit">
              <CardContent className="p-4 w-fit">
                <video
                  className="rounded-lg max-w-[550px]"
                  controls
                  src={message.video}
                />
              </CardContent>
            </Card>
          )}
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
  currentAudioPosition,
  audio,
}: ChatBubbleProps) {
  switch (type) {
    case "text":
      return (
        <TextChatBubble
          message={message}
          currentAudioPosition={currentAudioPosition}
        />
      );
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
