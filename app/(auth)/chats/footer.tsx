import {
  Mic,
  Paperclip,
  PlusCircleIcon,
  SmileIcon,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ChatMessageProps } from "@/types";
import { fal } from "@fal-ai/client";

fal.config({
  proxyUrl: "/api/fal",
});
import { useCallback, useEffect, useRef, useState } from "react";
import { useWavesurfer } from "@wavesurfer/react";

export default function ChatFooter({
  messages,
  setMessages,
  setCurrentAudioPosition,
}: {
  messages: ChatMessageProps[];
  setMessages: (messages: ChatMessageProps[]) => void;
  setCurrentAudioPosition: (position: number) => void;
}) {
  const [inputValue, setInputValue] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState<string>("");

  const onSubmit = async () => {
    const newMessageId =
      messages.length > 0 ? messages[messages.length - 1].id + 1 : 1;
    const updatedMessages = [
      ...messages,
      {
        id: newMessageId,
        content: inputValue,
        type: "text",
        own_message: true,
      } as ChatMessageProps,
      {
        id: newMessageId + 1,
        content: "",
        type: "text",
        own_message: false,
        state: "creating_text" as const,
      } as ChatMessageProps,
    ];

    setMessages(updatedMessages);

    setInputValue("");
    const scrapeResponse = await fetch("/api/scrape", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userMessage: inputValue }),
    });

    if (!scrapeResponse.ok) {
      return;
    }

    const { text, video_prompt } = await scrapeResponse.json();

    setMessages([
      ...updatedMessages.slice(0, -1),
      {
        ...updatedMessages[updatedMessages.length - 1],
        state: "creating_audio",
      },
    ]);

    const [audioBuffer, videoResult] = await Promise.all([
      // Text to speech request
      fetch("/api/text-to-speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: text }),
      })
        .then((res) => res.arrayBuffer())
        .then((buffer) => {
          const audioUrl = URL.createObjectURL(new Blob([buffer]));
          setAudioUrl(audioUrl);

          setMessages([
            ...updatedMessages.slice(0, -1),
            {
              ...updatedMessages[updatedMessages.length - 1],
              content: text,
              audio: audioUrl,
              state: "creating_video",
            },
          ]);

          return audioUrl;
        }),

      (async () => {
        return fal.subscribe("fal-ai/minimax/video-01-live", {
          input: {
            prompt: text.slice(0, 150),
            prompt_optimizer: true,
          },
          logs: true,
          onQueueUpdate: (update) => {
            console.log(update);
          },
        });
      })(),
    ]);

    setVideoUrl(videoResult.data.video.url);
    setMessages([
      ...updatedMessages.slice(0, -1),
      {
        ...updatedMessages[updatedMessages.length - 1],
        content: text,
        audio: audioUrl,
        video: videoResult.data.video.url,
        state: "idle",
      } as ChatMessageProps,
    ]);
  };

  return (
    <>
      <Card>
        <CardContent className="p-2 lg:p-4 flex items-center relative">
          <Input
            type="text"
            className="border-transparent !text-base !ring-transparent !shadow-transparent pe-32 lg:pe-56"
            placeholder="Enter message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <div className="absolute flex items-center end-4">
            <div className="block lg:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="p-0 w-11 h-11 rounded-full"
                  >
                    <PlusCircleIcon className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Emoji</DropdownMenuItem>
                  <DropdownMenuItem>Add File</DropdownMenuItem>
                  <DropdownMenuItem>Send Voice</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="hidden lg:block">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      className="p-0 w-11 h-11 rounded-full"
                    >
                      <SmileIcon className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Emoji</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      className="p-0 w-11 h-11 rounded-full"
                    >
                      <Paperclip className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Select File</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      className="p-0 w-11 h-11 rounded-full"
                    >
                      <Mic className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Send Voice</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Button onClick={onSubmit} variant="outline" className="ms-3">
              Send
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
