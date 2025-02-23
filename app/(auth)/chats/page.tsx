import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LeftList from "@/app/(auth)/chats/left-list";
import ChatContent from "@/app/(auth)/chats/chat-content";
import { getChats } from "@/server-actions/chats";
import { Button } from "@/components/ui/button";
import CreateRoomDialog from "./create-room-dialog";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function Page() {
  const roomsData = await getChats();
  const rooms = Array.isArray(roomsData) ? roomsData : [];

  return (
    <div className="h-screen overflow-hidden lg:flex gap-8 p-4">
      <div className="h-full w-full lg:w-96">
        <Card className="h-full">
          <CardHeader className="py-4 lg:py-6">
            <div className="flex items-center">
              <Button
                size="sm"
                variant="outline"
                className="flex h-10 w-10 p-0 mr-2"
                asChild>
                <Link href="/">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <CardTitle className="font-bold">Rooms</CardTitle>

              <CreateRoomDialog />
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <LeftList rooms={rooms} />
          </CardContent>
        </Card>
      </div>

      <div className="flex-grow h-full">
        <ChatContent />
      </div>
    </div>
  );
}
