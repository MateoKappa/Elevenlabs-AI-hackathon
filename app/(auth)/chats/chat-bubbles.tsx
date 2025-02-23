import { cn } from "@/lib/utils";

import { Card, CardContent } from "@/components/ui/card";
import { PauseCircle, PlayCircle } from "lucide-react";
import MessageStatusIcon from "./message-status-icon";
import { useWavesurfer } from "@wavesurfer/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCallback } from "react";
import type { Tables } from "@/db/database.types";
import AudioBubble from "./audio-bubble";
import StreamingText from "./streaming-text";
import moment from "moment";
import ImageChatBubble from "./image-bubble";
function TextChatBubble({ message }: { message: Tables<"chat_history"> }) {
  const [localAudioPosition, setLocalAudioPosition] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const memoizedSetIsFinished = useCallback((value: boolean) => {
    setIsFinished(value);
  }, []);

  const memoizedSetLocalAudioPosition = useCallback((value: number) => {
    setLocalAudioPosition(value);
  }, []);

  const isLoading =
    message.state === "creating_text" || message.state === "creating_audio";

  const isCreatingVideo = message.state === "creating_video";
  const videoCreated = message.video;

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

          <Card
            className={cn({
              "order-1 bg-black text-white dark:bg-gray-900":
                message.own_message,
            })}
          >
            <CardContent className="p-4 flex flex-col gap-2">
              {videoCreated && message.video && (
                <video
                  className="rounded-lg w-full max-w-[550px]"
                  controls
                  src={message.video}
                  loop
                >
                  <track kind="captions" />
                </video>
              )}

              {message.audio && (
                <AudioBubble
                  setIsFinished={memoizedSetIsFinished}
                  setLocalAudioPosition={memoizedSetLocalAudioPosition}
                  audioUrl={message.audio}
                  isLoading={isLoading}
                />
              )}

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
                <StreamingText
                  ownMessage={message.own_message}
                  audioUrl={message.audio}
                  content={message.content}
                  isFinished={isFinished}
                  localAudioPosition={localAudioPosition}
                />
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
          {moment(message.created_at).format("DD MM HH:mm")}
        </time>
      </div>
    </div>
  );
}

interface ChatBubbleProps {
  message: Tables<"chat_history">;
  type: string;
  audio?: string;
}
export default function ChatBubble({ message, type, audio }: ChatBubbleProps) {
  switch (type) {
    case "TEXT":
      return <TextChatBubble message={message} />;
    case "IMAGE":
      return <ImageChatBubble message={message} />;
    default:
      break;
  }
}
