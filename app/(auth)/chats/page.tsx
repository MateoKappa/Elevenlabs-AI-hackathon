import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LeftList from "@/app/(auth)/chats/left-list";
import ChatContent from "@/app/(auth)/chats/chat-content";
import { getChats } from "@/server-actions/chats";
import CreateRoomDialog from "./create-room-dialog";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Page() {
  const roomsData = await getChats();
  const rooms = Array.isArray(roomsData) ? roomsData : [];

  console.log(roomsData, "roomsData");

  return (
    <div className="h-screen overflow-hidden lg:flex gap-8 p-4">
      <div className="h-full w-full lg:w-96">
        <Card className="h-full">
          <CardHeader className="py-4 lg:py-6">
            <div className="flex items-center justify-between">
              <Button asChild className="mr-2" variant="outline" size="icon">
                <Link href="/">
                  <ArrowLeft className="w-4 h-4" />
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
