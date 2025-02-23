import { Mic, Paperclip, PlusCircleIcon, SmileIcon } from "lucide-react";
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
import ShortUniqueId from "short-unique-id";
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
  setMessages: React.Dispatch<React.SetStateAction<ChatMessageProps[]>>;
  setCurrentAudioPosition: (position: number) => void;
}) {
  const [inputValue, setInputValue] = useState("");
  const [videoUrl, setVideoUrl] = useState<string>("");
  const messagesRef = useRef(messages);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const onSubmit = async () => {
    const { randomUUID } = new ShortUniqueId({ length: 10 });

    const updatedMessages = [
      {
        id: randomUUID(),
        content: inputValue,
        type: "text",
        own_message: true,
      } as ChatMessageProps,
      {
        id: randomUUID(),
        content: "",
        type: "text",
        own_message: false,
        state: "creating_text" as const,
      } as ChatMessageProps,
    ];

    setMessages((prevMessages: ChatMessageProps[]) => {
      console.log("Previous messages (initial submit):", prevMessages);
      return [...prevMessages, ...updatedMessages];
    });

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

    setMessages((prevMessages: ChatMessageProps[]) => {
      console.log("Previous messages (creating_audio):", prevMessages);
      const newMessages = [...prevMessages];
      newMessages[newMessages.length - 1] = {
        ...newMessages[newMessages.length - 1],
        state: "creating_audio",
      };
      return newMessages;
    });

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

          setMessages((prevMessages: ChatMessageProps[]) => {
            console.log("Previous messages (creating_video):", prevMessages);
            const newMessages = [...prevMessages];
            newMessages[newMessages.length - 1] = {
              ...newMessages[newMessages.length - 1],
              content: text,
              audio: audioUrl,
              state: "creating_video",
            };
            console.log("New messages (creating_video):", newMessages);
            return newMessages;
          });

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
            // console.log(update);
          },
        });
      })(),
    ]);

    setMessages((prevMessages: ChatMessageProps[]) => {
      console.log("Previous messages (final state):", prevMessages);
      const newMessages = [...prevMessages];
      newMessages[newMessages.length - 1] = {
        ...newMessages[newMessages.length - 1],
        content: text,
        video: videoResult.data.video.url,
        state: "idle",
      };
      return newMessages;
    });

    setVideoUrl(videoResult.data.video.url);
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
