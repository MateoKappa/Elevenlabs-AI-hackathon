"use client";

import { useContext, useState } from "react";

import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import { SelectedContactContextType, UserPropsTypes } from "@/types";
import { SelectedContactContext } from "@/components/contexts";
import ContactListItem from "./contact-list-item";

export default function ContactList({
  contacts,
}: {
  contacts: UserPropsTypes[];
}) {
  const { selectedContact } = useContext(
    SelectedContactContext
  ) as SelectedContactContextType;
  const [filteredContacts, setFilteredContacts] = useState(contacts);
  const changeHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.trim();

    const filteredItems = contacts.filter((contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredContacts(filteredItems);
  };

  return (
    <>
      <div className="py-3 px-6 relative flex items-center">
        <Search className="absolute w-4 h-4 start-10 text-muted-foreground" />
        <Input
          type="text"
          className="ps-10"
          placeholder="Contacts search..."
          onChange={changeHandle}
        />
      </div>
      <div className="h-[calc(100vh_-_13rem)] lg:h-[calc(100vh_-_15.8rem)] flex lg:pt-4">
        <ScrollArea className="w-full">
          <div className="divide-y">
            {filteredContacts.length ? (
              filteredContacts.map((contact: UserPropsTypes) => (
                <ContactListItem
                  contact={contact}
                  key={contact.id}
                  active={selectedContact && selectedContact.id === contact.id}
                />
              ))
            ) : (
              <div className="text-center text-muted-foreground text-sm mt-4">
                No contact found
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
