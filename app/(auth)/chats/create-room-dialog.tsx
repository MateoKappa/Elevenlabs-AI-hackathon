"use client";

import { SelectedChatContext } from "@/components/contexts";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogHeader,
  AlertDialogTrigger,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SelectedChatContextType } from "@/types";
import { createRoom } from "@/server-actions/chats";
import { PlusCircleIcon } from "lucide-react";
import { useContext, useState } from "react";

function CreateRoomDialog() {
  const [roomName, setRoomName] = useState("");
  const [open, setOpen] = useState(false);
  const { rooms, setRooms, setSelectedChat } = useContext(
    SelectedChatContext
  ) as SelectedChatContextType;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newRoom = await createRoom(roomName);

    if (newRoom?.[0] && setRooms) {
      const newRoomData = {
        ...newRoom[0],
        messages: [],
        last_message: undefined,
        user: {
          id: newRoom[0].user_uuid,
          name: "",
          avatar: "",
        },
      };

      setRooms([newRoomData, ...rooms]);
      setSelectedChat(newRoomData);
    }

    setRoomName("");
    setOpen(false);

    window.location.reload();
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger className="ml-auto" asChild>
        <Button variant="outline">
          <PlusCircleIcon className="w-4 h-4 mr-2" />
          Create
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <form onSubmit={handleSubmit}>
          <AlertDialogHeader>
            <AlertDialogTitle>Create New Room</AlertDialogTitle>
          </AlertDialogHeader>

          <div className="py-4">
            <Input
              placeholder="Enter room name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              autoFocus
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
            <AlertDialogAction type="submit">Create Room</AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default CreateRoomDialog;
