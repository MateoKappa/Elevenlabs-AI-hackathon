"use client";

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
import { createRoom } from "@/server-actions/chats";
import { PlusCircleIcon } from "lucide-react";
import { useState } from "react";

function CreateRoomDialog() {
  const [roomName, setRoomName] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await createRoom(roomName);

    setRoomName("");
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
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
