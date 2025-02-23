import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import ShortUniqueId from "short-unique-id";
import type { Tables } from "@/db/database.types";
import { fal } from "@fal-ai/client";
import { useRef, useEffect } from "react";
import type { Enums } from "@/db/database.types";
import { useState } from "react";
import {
  validateAndUpdateChatRow,
  validateAndUpsertChatRow,
} from "@/server-actions/chats";
import { Image } from "lucide-react";
import { X } from "lucide-react";
import { createClient } from "@/supabase/client";

fal.config({
  proxyUrl: "/api/fal",
});

async function uploadImageToSupabase(file: File) {
  const { randomUUID } = new ShortUniqueId({ length: 10 });
  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from("images")
    .upload(`images/${randomUUID()}-${file.name}`, file);

  if (error) {
    console.error("Error uploading image:", error);
    return null;
  }

  return `https://eppqzyovaadrohikesgh.supabase.co/storage/v1/object/public/${data.fullPath}`;
}

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
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const messagesRef = useRef(messages);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const onSubmit = async () => {
    if (inputValue === "" && !uploadedImage) {
      return;
    }
    const { randomUUID } = new ShortUniqueId({ length: 10 });

    const image = uploadedImage;

    setUploadedImage(null);

    const type: Enums<"MESSAGE_TYPE"> = uploadedImage ? "IMAGE" : "TEXT";

    const updatedMessages = [
      {
        id: randomUUID(),
        content: inputValue,
        type: type,
        own_message: true,
        audio: null,
        video: null,
        image: image ? URL.createObjectURL(image) : null,
        state: null,
        created_at: new Date().toISOString(),
        room_uuid: roomId,
      },
      {
        id: randomUUID(),
        content: "",
        type: "TEXT" as const,
        own_message: false,
        audio: null,
        video: null,
        image: null,
        state: "creating_text" as const,
        created_at: new Date().toISOString(),
        room_uuid: roomId,
      },
    ];

    setMessages((prevMessages: Tables<"chat_history">[]) => {
      return [...prevMessages, ...updatedMessages];
    });

    setInputValue("");

    let imageUrl = null;
    if (image) {
      imageUrl = await uploadImageToSupabase(image);
    }

    await validateAndUpsertChatRow(roomId, {
      content: inputValue,
      state: "idle",
      room_uuid: roomId,
      own_message: true,
      image: imageUrl,
      type: type,
    });

    const chatResponse = await fetch("/api/scrape", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userMessage: inputValue,
        roomUuid: roomId,
        image: imageUrl,
      }),
    });

    if (!chatResponse.ok) {
      setMessages((prevMessages: Tables<"chat_history">[]) => {
        const newMessages = [...prevMessages];
        newMessages[newMessages.length - 1] = {
          ...newMessages[newMessages.length - 1],
          state: "idle",
          content: "Your message was not clear, please try again.",
        };
        return newMessages;
      });
      return;
    }

    const { text, video_prompt, chat_id } = await chatResponse.json();

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
        if (imageUrl) {
          return fal.subscribe("fal-ai/minimax/video-01/image-to-video", {
            input: {
              prompt: video_prompt,
              image_url: imageUrl,
              prompt_optimizer: true,
            },
          });
        }

        return fal.subscribe("fal-ai/minimax/video-01-live", {
          input: {
            prompt: video_prompt,
            prompt_optimizer: true,
          },
        });
      })(),
    ]);

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

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        setUploadedImage(file);
        console.log("Image file selected:", file);
        // You can add further processing logic here
      } else {
        console.error("Only image files are allowed.");
      }
    }
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
          {uploadedImage && (
            <div className="relative w-10 h-10 rounded-sm ">
              <img
                src={URL.createObjectURL(uploadedImage)}
                alt="Uploaded"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setUploadedImage(null)}
                className="absolute -top-2 -right-2 bg-white text-black rounded-full p-1"
                aria-label="Remove image"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </div>
          )}

          <Input
            type="text"
            className="border-transparent !text-base !ring-transparent !shadow-transparent w-full"
            placeholder="Enter message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <Button
            type="button"
            onClick={handleUpload}
            variant="outline"
            className="ms-3 p-2"
          >
            <Image className="w-6 h-6" />
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />

          <Button type="submit" variant="outline" className="ms-3">
            Send
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
