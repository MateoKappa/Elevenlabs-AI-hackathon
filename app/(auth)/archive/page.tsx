import { promises as fs } from "fs";
import path from "path";
import { ChatItemProps, UserPropsTypes } from "@/types";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ChatList from "../chats/chat-list";
import ChatContent from "../chats/chat-content";

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

  const filteredChats = chats.filter((item: ChatItemProps) => item.is_archive);

  const chats_with_user = await Promise.all(
    filteredChats.map(async (item: ChatItemProps) => {
      item.user = await getChatUser(item.user_id);
      return item;
    })
  );

  return (
    <div className="flex gap-8">
      <div className="w-96">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="font-bold">Archive</CardTitle>
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
