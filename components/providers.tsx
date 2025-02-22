"use client";

import { useState } from "react";
import { ThemeProvider } from "next-themes";
import {
  UserProfileContext,
  SelectedChatContext,
  SelectedContactContext,
  SelectedStatusContext,
} from "./contexts";
import { ChatItemProps, StatusItemProps, UserPropsTypes } from "@/types";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [show, setShow] = useState(false);
  const [selectedChat, setSelectedChat] = useState<ChatItemProps | null>(null);
  const [selectedContact, setSelectedContact] = useState<UserPropsTypes | null>(
    null
  );
  const [selectedStatus, setSelectedStatus] = useState<StatusItemProps | null>(
    null
  );

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <UserProfileContext.Provider value={{ show, setShow }}>
        <SelectedChatContext.Provider value={{ selectedChat, setSelectedChat }}>
          <SelectedContactContext.Provider
            value={{ selectedContact, setSelectedContact }}
          >
            <SelectedStatusContext.Provider
              value={{ selectedStatus, setSelectedStatus }}
            >
              {children}
            </SelectedStatusContext.Provider>
          </SelectedContactContext.Provider>
        </SelectedChatContext.Provider>
      </UserProfileContext.Provider>
    </ThemeProvider>
  );
}
