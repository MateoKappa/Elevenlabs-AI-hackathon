import { Mic, Paperclip, PauseCircle, PlayCircle, PlusCircleIcon, SmileIcon } from "lucide-react";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ChatMessageProps } from "@/types";
import { useCallback, useEffect, useRef, useState } from "react";
import { useWavesurfer } from '@wavesurfer/react'

export default function ChatFooter({
  messages,
  setMessages,
}: {
  messages: ChatMessageProps[];
  setMessages: (messages: ChatMessageProps[]) => void;
}) {
  const [inputValue, setInputValue] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null)

  const { wavesurfer, isPlaying } = useWavesurfer({
    container: containerRef,
    height: 44,
    barGap: 2,
    barRadius: 4,
    barWidth: 3,
    barHeight: 1,
    waveColor: '#d1a0b5',
    progressColor: '#a3426c',
    cursorWidth: 0,
    interact: true,
    fillParent: true,
    hideScrollbar: true,
    url: audioUrl,
  })

  const onSubmit = async () => {
    setMessages([
      ...messages,
      {
        id: messages.length > 0 ? messages[messages.length - 1].id + 1 : 1,
        content: inputValue,
        type: "text",
        own_message: true,
      },
    ]);
    setInputValue("");
    const response = await fetch("/api/scrape", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userMessage: inputValue }),
    });
    if (response.ok) {
      const res = await response.blob()
      setAudioUrl(URL.createObjectURL(res))
    }
  };

  const playPause = useCallback(() => {
    if (!wavesurfer) return

    console.log('isPlaying', isPlaying)
    if (isPlaying) wavesurfer.pause()
    else wavesurfer.play()
  }, [isPlaying, wavesurfer])

  useEffect(() => {
    if (!containerRef.current) return
    if (!wavesurfer) return

    wavesurfer.on('interaction', () => {
      wavesurfer.play()
    })
    wavesurfer.on('finish', () => {
      wavesurfer.stop()
    })

    return () => {
      wavesurfer.destroy()
    }
  }, [wavesurfer])

  return (
    <>
      <div className="flex flex-col">
        {audioUrl && (
          <div className="mt-3 flex flex-row items-center gap-1 rounded-full border border-bright-plum-50 bg-bright-plum-7 px-3 py-1 text-sm">
            <button className="shrink-0 text-bright-plum" type="button" onClick={playPause}>
              {isPlaying ? <PauseCircle size={32} /> : <PlayCircle size={32} />}
            </button>

            <div className="ml-1 h-full w-full" ref={containerRef} />
          </div>
        )}
      </div>

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
