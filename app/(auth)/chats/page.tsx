import { promises as fs } from "fs";
import path from "path";
import { ChatItemProps, UserPropsTypes } from "@/types";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ChatList from "@/app/(auth)/chats/chat-list";
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
  const chats = await getChats();
  const chats_with_user = await Promise.all(
    chats.map(async (item: ChatItemProps) => {
      item.user = await getChatUser(item.user_id);
      return item;
    })
  );

  return (
    <div className="lg:flex gap-8">
      <div className="w-full lg:w-96">
        <Card>
          <CardHeader className="py-4 lg:py-6">
            <div className="flex items-center justify-between">
              <CardTitle className="font-bold">Chats</CardTitle>
              <ActionDropdown />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ChatList chats={chats_with_user} />
          </CardContent>
        </Card>
      </div>
      <div className="flex-grow">
        <ChatContent />
      </div>
    </div>
  );
}
