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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChatMessageProps } from "@/types";
import { useState } from "react";
import { fal } from "@fal-ai/client";

fal.config({
  proxyUrl: "/api/fal",
});

export default function ChatFooter({
  messages,
  setMessages,
}: {
  messages: ChatMessageProps[];
  setMessages: (messages: ChatMessageProps[]) => void;
}) {
  const [inputValue, setInputValue] = useState("");
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
    // const response = await fetch("/api/scrape", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ userMessage: inputValue }),
    // });

    // const data = await response.json();

    const result = await fal.subscribe("fal-ai/flux-pro/v1.1-ultra", {
      input: {
        prompt:
          'Extreme close-up of a single tiger eye, direct frontal view. Detailed iris and pupil. Sharp focus on eye texture and color. Natural lighting to capture authentic eye shine and depth. The word "FLUX" is painted over it in big, white brush strokes with visible texture.',
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          update.logs.map((log) => log.message).forEach(console.log);
        }
      },
    });
    console.log(result.data, "result");

    // const result = await fal.subscribe("fal-ai/minimax-video/image-to-video", {
    //   input: {
    //     prompt:
    //       "A woman is making a cocktail and a bear comes up and drinks the cocktail",
    //     image_url:
    //       "https://scontent.fath4-2.fna.fbcdn.net/v/t39.30808-6/357398398_6566702153375369_3512165724848225869_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=GHa9SDB4yigQ7kNvgFlAXGB&_nc_oc=Adg39KRkcslqXGDonM1RPJfZoDxdnE3JD6xyLcgWayLmMEZPANo7SBAc_yUELkt1h-UoKY4EjCk5hUS3Dwp4-pXJ&_nc_zt=23&_nc_ht=scontent.fath4-2.fna&_nc_gid=AxSiNn47rd3L4vM6bgxbqkq&oh=00_AYAbESFo_pi8rxMNfqJDvuplPH-dIBpDuxXQX7kBQ6c9Jw&oe=67BF6A08",
    //   },
    //   logs: true,
    //   onQueueUpdate: (update) => {
    //     console.log(update);
    //   },
    // });
    // console.log(data, "data");
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
