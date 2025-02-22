import { useContext } from "react";
import { cn } from "@/lib/utils";
import { SelectedContactContextType, UserPropsTypes } from "@/types";

import ContactListDropdown from "@/app/(auth)/contacts/contact-list-item-dropdown";
import { generateAvatarFallback } from "@/lib/generate-avatar-fallback";
import UserAvatar from "@/components/user-avatar";
import { SelectedContactContext } from "@/components/contexts";

export default function ContactListItem({
  contact,
  active,
}: {
  contact: UserPropsTypes;
  active?: boolean | null;
}) {
  const { setSelectedContact } = useContext(
    SelectedContactContext
  ) as SelectedContactContextType;

  const handleClick = (contact: UserPropsTypes) => {
    setSelectedContact(contact);
  };

  return (
    <div
      onClick={() => handleClick(contact)}
      className={cn(
        "flex items-center gap-4 py-4 px-6 hover:bg-muted group cursor-pointer min-w-0 relative",
        { "!bg-gray-200 dark:!bg-muted": active }
      )}
    >
      <UserAvatar
        image={contact.avatar}
        fallback={generateAvatarFallback(contact.name)}
      />
      <div className="flex-1">
        <div className="flex flex-col gap-1 justify-between">
          <span className="font-semibold">{contact.name}</span>
          <span className="text-sm text-muted-foreground">{contact.phone}</span>
        </div>
      </div>
      <div className="absolute opacity-0 group-hover:opacity-100 end-4">
        <ContactListDropdown />
      </div>
    </div>
  );
}
