import { promises as fs } from "fs";
import path from "path";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import ContactList from "./contact-list";
import ContactContent from "./contact-content";
import { AddContactDialog } from "./add-contact";

async function getContacts() {
  const data = await fs.readFile(
    path.join(process.cwd(), "data/contacts.json")
  );

  return JSON.parse(data.toString());
}

export default async function Page() {
  const contacts = await getContacts();

  return (
    <>
      <div className="lg:flex gap-8">
        <div className="w-full lg:w-96">
          <Card>
            <CardHeader className="py-4 lg:py-6">
              <div className="flex items-center justify-between">
                <CardTitle className="font-bold">Contacts</CardTitle>
                <AddContactDialog>
                  <Button variant="outline">
                    <PlusCircle className="w-4 h-4 me-2" />
                    Add Contact
                  </Button>
                </AddContactDialog>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ContactList contacts={contacts} />
            </CardContent>
          </Card>
        </div>
        <div className="flex-grow">
          <ContactContent />
        </div>
      </div>
    </>
  );
}
