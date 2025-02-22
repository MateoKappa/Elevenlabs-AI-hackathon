"use client";

import { createContext } from "react";
import {
  SelectedChatContextType,
  SelectedContactContextType,
  SelectedStatusContextType,
  UserProfileContextType,
} from "@/types";

export const UserProfileContext = createContext<UserProfileContextType | false>(
  false
);

export const SelectedChatContext =
  createContext<SelectedChatContextType | null>(null);

export const SelectedContactContext = createContext<
  SelectedContactContextType | {}
>({});

export const SelectedStatusContext = createContext<
  SelectedStatusContextType | {}
>({});
