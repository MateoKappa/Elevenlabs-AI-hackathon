import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LeftList from "@/app/(auth)/chats/left-list";
import ActionDropdown from "./action-dropdown";
import ChatContent from "@/app/(auth)/chats/chat-content";
import { getChats } from "@/server-actions/chats";

export default async function Page() {
  const rooms = await getChats();

  return (
    <div className="lg:flex gap-8 p-4">
      <div className="w-full lg:w-96">
        <Card>
          <CardHeader className="py-4 lg:py-6">
            <div className="flex items-center justify-between">
              <CardTitle className="font-bold">Rooms</CardTitle>
              <ActionDropdown />
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <LeftList rooms={rooms} />
          </CardContent>
        </Card>
      </div>

      <div className="flex-grow">
        <ChatContent />
      </div>
    </div>
  );
}
