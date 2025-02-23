import { promises as fs } from "node:fs";
import path from "node:path";
import type { ChatItemProps, UserPropsTypes } from "@/types";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LeftList from "@/app/(auth)/chats/left-list";
import ActionDropdown from "./action-dropdown";
import ChatContent from "@/app/(auth)/chats/chat-content";

async function getChats() {
  const data = await fs.readFile(path.join(process.cwd(), "data/chats.json"));

  return JSON.parse(data.toString());
}

async function getChatUser(id: number) {
  const data = await fs.readFile(
    path.join(process.cwd(), "data/contacts.json")
  );

  return JSON.parse(data.toString()).find(
    (item: UserPropsTypes) => item.id === id
  );
}

export default async function Page() {
  // const chats = await getChats();
  const chats = await getChats();
  const chats_with_user = await Promise.all(
    chats.map(async (item: ChatItemProps) => {
      item.user = await getChatUser(item.user_id);
      return item;
    })
  );

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
            <LeftList chats={chats} />
          </CardContent>
        </Card>
      </div>

      <div className="flex-grow">
        <ChatContent />
      </div>
    </div>
  );
}
