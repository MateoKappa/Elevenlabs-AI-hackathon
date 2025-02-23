import { cn } from "@/lib/utils";

import { Card, CardContent } from "@/components/ui/card";
import {
  PauseCircle,
  PlayCircle,
} from "lucide-react";
import MessageStatusIcon from "./message-status-icon";
import { useWavesurfer } from "@wavesurfer/react";
import { useEffect, useRef, useState } from "react";
import { useCallback } from "react";
import type { Tables } from "@/db/database.types";

interface ChatBubbleProps {
  message: Tables<"chat_history">;
  type: string;
  audio?: string;
}

function TextChatBubble({ message }: { message: Tables<"chat_history"> }) {
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
    url: message.audio ?? undefined,
  });

  const playPause = useCallback(() => {
    if (!wavesurfer) return;
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
          {isCreatingVideo && (
            <Card className="w-fit">
              <CardContent className="p-4 ">
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
            <Card className="w-full">
              <CardContent className="p-4 ">
                {message.video && (
                  <video
                    className="rounded-lg w-full max-w-[550px]"
                    controls
                    src={message.video}
                  >
                    <track kind="captions" />
                  </video>
                )}
              </CardContent>
            </Card>
          )}
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

export default function ChatBubble({ message, type, audio }: ChatBubbleProps) {
  switch (type) {
    case "TEXT":
      return <TextChatBubble message={message} />;
    default:
      break;
  }
}
