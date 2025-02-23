import {
  PlusCircleIcon,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Tables } from "@/db/database.types";
import { fal } from "@fal-ai/client";

fal.config({
  proxyUrl: "/api/fal",
});
import { useState } from "react";

export default function ChatFooter({
  messages,
  setMessages,
}: {
  messages: Tables<"chat_history">[];
  setMessages: (messages: Tables<"chat_history">[]) => void;
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
        audio: null,
        video: null,
        state: null,
        created_at: new Date().toISOString(),
        room_uuid: messages[0]?.room_uuid ?? "",
      } as Tables<"chat_history">,
      {
        id: newMessageId + 1,
        content: "",
        type: "text",
        own_message: false,
        audio: null,
        video: null,
        state: "creating_text" as const,
        created_at: new Date().toISOString(),
        room_uuid: messages[0]?.room_uuid ?? "",
      } as Tables<"chat_history">,
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
      } as Tables<"chat_history">,
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
            } as Tables<"chat_history">,
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
      } as Tables<"chat_history">,
    ]);
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
