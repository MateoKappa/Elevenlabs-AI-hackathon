import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import ShortUniqueId from "short-unique-id";
import type { Tables } from "@/db/database.types";
import { fal } from "@fal-ai/client";
import { useRef, useEffect } from "react";
import type { Enums } from "@/db/database.types";
import { useState } from "react";
import { validateAndUpdateChatRow, validateAndUpsertChatRow } from "@/server-actions/chats";

fal.config({
  proxyUrl: "/api/fal",
});

export default function ChatInput({
  messages,
  roomId,
  setMessages,
}: {
  setMessages: React.Dispatch<React.SetStateAction<Tables<"chat_history">[]>>;
  messages: Tables<"chat_history">[];
  roomId: string;
}) {
  const [inputValue, setInputValue] = useState("");
  const messagesRef = useRef(messages);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const onSubmit = async () => {
    const { randomUUID } = new ShortUniqueId({ length: 10 });

    const type: Enums<"MESSAGE_TYPE"> = "TEXT";

    await validateAndUpsertChatRow(roomId, {
      content: inputValue,
      state: "idle",
      room_uuid: roomId,
      own_message: true,
      type: type,
    });

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
        room_uuid: roomId,
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
        room_uuid: roomId,
      },
    ];

    setMessages((prevMessages: Tables<"chat_history">[]) => {
      return [...prevMessages, ...updatedMessages];
    });

    setInputValue("");
    const scrapeResponse = await fetch("/api/scrape", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userMessage: inputValue,
        roomUuid: roomId,
      }),
    });

    if (!scrapeResponse.ok) {
      return;
    }

    const { text, video_prompt, chat_id } = await scrapeResponse.json();

    setMessages((prevMessages: Tables<"chat_history">[]) => {
      const newMessages = [...prevMessages];
      newMessages[newMessages.length - 1] = {
        ...newMessages[newMessages.length - 1],
        state: "creating_audio",
      };
      return newMessages;
    });

    const [_audioBuffer, videoResult] = await Promise.all([
      await fetch("/api/text-to-speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: text,
          roomUuid: roomId,
          chatId: chat_id,
        }),
      })
        .then((res) => res.arrayBuffer())
        .then((buffer) => {
          const audioUrl = URL.createObjectURL(new Blob([buffer]));

          setMessages((prevMessages: Tables<"chat_history">[]) => {
            const newMessages = [...prevMessages];
            newMessages[newMessages.length - 1] = {
              ...newMessages[newMessages.length - 1],
              content: text,
              audio: audioUrl,
              state: "creating_video",
            };
            return newMessages;
          });

          return audioUrl;
        }),

      (async () => {
        return fal.subscribe("fal-ai/minimax/video-01-live", {
          input: {
            prompt: video_prompt,
            prompt_optimizer: true,
          },
        });
      })(),
    ]);

    console.log({ url: videoResult.data.video.url });

    setMessages((prevMessages: Tables<"chat_history">[]) => {
      const newMessages = [...prevMessages];
      newMessages[newMessages.length - 1] = {
        ...newMessages[newMessages.length - 1],
        content: text,
        video: videoResult.data.video.url,
        state: "idle",
      };
      return newMessages;
    });
    validateAndUpdateChatRow(roomId, {
      video: videoResult.data.video.url,
      id: chat_id,
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <Card>
        <CardContent className="flex items-center justify-between p-2 lg:p-4">
          <Input
            type="text"
            className="border-transparent !text-base !ring-transparent !shadow-transparent w-full"
            placeholder="Enter message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />

          <Button type="submit" variant="outline" className="ms-3">
            Send
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
