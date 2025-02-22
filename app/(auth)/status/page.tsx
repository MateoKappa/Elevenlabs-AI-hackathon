import { promises as fs } from "fs";
import path from "path";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import StatusList from "./status-list";
import StatusContent from "./status-content";
import { StatusItemProps, UserPropsTypes } from "@/types";

async function getUpdates() {
  const data = await fs.readFile(path.join(process.cwd(), "data/status.json"));

  return JSON.parse(data.toString());
}

async function getUser(id: number) {
  const data = await fs.readFile(
    path.join(process.cwd(), "data/contacts.json")
  );

  return JSON.parse(data.toString()).find(
    (item: UserPropsTypes) => item.id === id
  );
}

export default async function Page() {
  const updates = await getUpdates();

  const updates_with_user = await Promise.all(
    updates.map(async (item: StatusItemProps) => {
      item.user = await getUser(item.user_id);
      return item;
    })
  );

  return (
    <>
      <div className="lg:flex gap-8">
        <div className="w-full lg:w-96">
          <Card>
            <CardHeader className="py-4 lg:py-6">
              <div className="flex items-center justify-between">
                <CardTitle className="font-bold">Status</CardTitle>
                <Button variant="outline">
                  <PlusCircle className="w-4 h-4 me-2" />
                  New Status
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <StatusList updates={updates_with_user} />
            </CardContent>
          </Card>
        </div>
        <div className="flex-grow">
          <StatusContent />
        </div>
      </div>
    </>
  );
}
