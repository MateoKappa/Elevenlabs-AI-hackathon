"use client";

import { useContext } from "react";
import { SelectedContactContextType } from "@/types";
import { SelectedContactContext } from "@/components/contexts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import UserAvatar from "@/components/user-avatar";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Dribbble,
  Facebook,
  Instagram,
  Linkedin,
  MessageCircle,
  X,
} from "lucide-react";
import Link from "next/link";
import { generateAvatarFallback } from "@/lib/generate-avatar-fallback";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ContactContent() {
  const { selectedContact: user, setSelectedContact } = useContext(
    SelectedContactContext
  ) as SelectedContactContextType;

  if (!user) {
    return (
      <figure className="text-center h-full hidden lg:flex items-center justify-center">
        <img
          className="max-w-sm block dark:hidden"
          src="/not-selected-chat.svg"
          alt="..."
        />
        <img
          className="max-w-sm hidden dark:block"
          src="/not-selected-chat-light.svg"
          alt="..."
        />
      </figure>
    );
  }

  return (
    <Card className="lg:max-w-screen-md flex flex-col z-50 inset-0 fixed lg:relative lg:p-0">
      <CardHeader className="flex-row justify-between">
        <div className="flex items-center gap-4">
          <Button
            size="sm"
            variant="outline"
            className="w-10 h-10 p-0 flex lg:hidden"
            onClick={() => setSelectedContact(null)}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <UserAvatar
            image={user.avatar}
            fallback={generateAvatarFallback(user.name)}
          />
          <div className="flex flex-col">
            <span className="font-semibold">{user.name}</span>
            <span className="text-sm text-muted-foreground">{user.email}</span>
          </div>
        </div>
        <div className="fixed bottom-0 start-0 end-0 lg:relative p-4 lg:p-0">
          <Button variant="outline" className="w-full lg:w-auto">
            <MessageCircle className="w-4 h-4 me-2" /> New Chat
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-full max-h-[calc(100vh_-_10rem)] lg:max-h-[calc(100vh_-_13.8rem)]">
          <div className="divide-y *:py-4">
            {user.about && (
              <div className="space-y-4">
                <div className="uppercase text-muted-foreground text-xs">
                  About
                </div>
                <div>{user.about}</div>
              </div>
            )}
            {user.phone && (
              <div className="space-y-4">
                <div className="uppercase text-muted-foreground text-xs">
                  Phone
                </div>
                <div>{user.phone}</div>
              </div>
            )}

            {user.country && (
              <div className="space-y-4">
                <div className="uppercase text-muted-foreground text-xs">
                  Country
                </div>
                <div>{user.country}</div>
              </div>
            )}
            {user.gender && (
              <div className="space-y-4">
                <div className="uppercase text-muted-foreground text-xs">
                  Gender
                </div>
                <div>{user.gender}</div>
              </div>
            )}
            {user.website && (
              <div className="space-y-4">
                <div className="uppercase text-muted-foreground text-xs">
                  Website
                </div>
                <Link
                  href={user.website}
                  className="inline-block hover:underline"
                  target="_blank"
                >
                  {user.website}
                </Link>
              </div>
            )}
            {user.last_seen && (
              <div className="space-y-4">
                <div className="uppercase text-muted-foreground text-xs">
                  Last seen
                </div>
                <div>{user.last_seen}</div>
              </div>
            )}
            {user.social_links?.length && (
              <div className="flex items-center gap-4">
                {user.social_links.map((item, key) => (
                  <Button
                    key={key}
                    asChild
                    variant="outline"
                    className="w-12 h-12 p-0 items-center rounded-full"
                  >
                    <Link
                      href={item.url ?? "#"}
                      target="_blank"
                      className="w-10 h-10 flex items-center justify-center rounded-full *:w-5 *:h-5"
                    >
                      {item.name === "Facebook" && <Facebook />}
                      {item.name === "X" && <X />}
                      {item.name === "Dribbble" && <Dribbble />}
                      {item.name === "Linkedin" && <Linkedin />}
                      {item.name === "Instagram" && <Instagram />}
                    </Link>
                  </Button>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
