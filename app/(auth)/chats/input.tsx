import { Mic, Paperclip, PlusCircleIcon, SmileIcon } from "lucide-react";
import {} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ChatMessageProps } from "@/types";
import ShortUniqueId from "short-unique-id";
import type { Tables } from "@/db/database.types";
import { fal } from "@fal-ai/client";
import { useRef, useEffect } from "react";
import { Enums } from "@/db/database.types";
fal.config({
  proxyUrl: "/api/fal",
});
import { useState } from "react";

export default function ChatFooter({
  messages,
  setMessages,
}: {
  setMessages: React.Dispatch<React.SetStateAction<Tables<"chat_history">[]>>;
  setCurrentAudioPosition: (position: number) => void;
  messages: Tables<"chat_history">[];
}) {
  const [inputValue, setInputValue] = useState("");
  const [videoUrl, setVideoUrl] = useState<string>("");
  const messagesRef = useRef(messages);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const onSubmit = async () => {
    const { randomUUID } = new ShortUniqueId({ length: 10 });

    const type: Enums<"MESSAGE_TYPE"> = "TEXT";

    const updatedMessages = [
      {
        id: randomUUID(),
        content: inputValue,
        type: type,
        own_message: true,
        audio: null,
        video: null,
        state: null,
        created_at: new Date().toISOString(),
        room_uuid: messages[0]?.room_uuid ?? "",
      },
      {
        id: randomUUID(),
        content: "",
        type: type,
        own_message: false,
        audio: null,
        video: null,
        state: "creating_text" as const,
        created_at: new Date().toISOString(),
        room_uuid: messages[0]?.room_uuid ?? "",
      },
    ];

    setMessages((prevMessages: Tables<"chat_history">[]) => {
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

    setMessages((prevMessages: Tables<"chat_history">[]) => {
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

          setMessages((prevMessages: Tables<"chat_history">[]) => {
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

    setMessages((prevMessages: Tables<"chat_history">[]) => {
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
    <form onSubmit={onSubmit}>
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
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Button type="submit" variant="outline" className="ms-3">
              Send
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
