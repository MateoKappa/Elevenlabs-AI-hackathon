import { AvatarIndicatorProps } from "@/components/ui/avatar";
import { Dispatch, SetStateAction } from "react";

export type ChatItemProps = {
  id: number;
  name?: string;
  image?: string;
  date?: string;
  status?: "sent" | "forwarded" | "read";
  is_archive?: boolean;
  last_message?: string;
  messages?: ChatMessageProps[];
  user_id: number;
  user: UserPropsTypes;
};

export type ChatMessageProps = {
  id: number;
  content?: string;
  type?: string;
  own_message?: boolean;
  read?: boolean;
  data?: ChatMessageDataProps;
};

export type ChatMessageDataProps = {
  file_name?: string;
  cover?: string;
  path?: string;
  duration?: string;
  size?: string;
  images?: [];
};

export type UserPropsTypes = {
  id: number;
  name: string;
  avatar?: string;
  about?: string;
  phone?: string;
  country?: string;
  email?: string;
  gender?: string;
  website?: string;
  online_status?: "success" | "warning" | "danger";
  last_seen?: string;
  social_links?: {
    name?: string;
    url?: string;
  }[];
  medias?: {
    type?: string;
    path?: string;
  }[];
};

export interface UserProfileContextType {
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
}

export interface SelectedChatContextType {
  selectedChat: ChatItemProps | null;
  setSelectedChat: Dispatch<SetStateAction<ChatItemProps | null>>;
}

export interface SelectedContactContextType {
  selectedContact: UserPropsTypes | null;
  setSelectedContact: Dispatch<SetStateAction<UserPropsTypes | null>>;
}

export interface SelectedStatusContextType {
  selectedStatus: StatusItemProps | null;
  setSelectedStatus: Dispatch<SetStateAction<StatusItemProps | null>>;
}

export type UserAvatarProps = {
  image?: string;
  indicator?: AvatarIndicatorProps["variant"];
  fallback?: string;
  className?: string;
};

export type StatusItemProps = {
  id: number;
  images: [];
  date: string;
  user_id: number;
  user: UserPropsTypes;
};

export type MediaListItemType = {
  type: string;
};

export type MessageStatusIconType = {
  status?: string;
};
