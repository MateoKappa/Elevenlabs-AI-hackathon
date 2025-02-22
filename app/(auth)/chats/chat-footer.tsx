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
    const response = await fetch("/api/scrape", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userMessage: inputValue }),
    });

    const data = await response.json();
    console.log(data, "data");
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
