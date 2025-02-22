"use client";

import Link from "next/link";
import React, { useContext } from "react";
import { UserProfileContextType, UserPropsTypes } from "@/types";
import { generateAvatarFallback } from "@/lib/generate-avatar-fallback";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dribbble,
  Facebook,
  FileText,
  Instagram,
  Linkedin,
  SheetIcon,
  X,
} from "lucide-react";
import { UserProfileContext } from "@/components/contexts";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import UserAvatar from "@/components/user-avatar";
import { Button } from "@/components/ui/button";

export default function UserDetailSheet({ user }: { user: UserPropsTypes }) {
  const { show, setShow } = useContext(
    UserProfileContext
  ) as UserProfileContextType;

  return (
    <Sheet open={show} onOpenChange={setShow}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-2xl">Profile</SheetTitle>
          <SheetDescription className="text-start">
            <ScrollArea className="h-[calc(100vh_-_5rem)]">
              <div className="flex flex-col justify-end items-center my-4">
                <UserAvatar
                  image={user.avatar}
                  className="w-32 h-32 mb-4"
                  fallback={generateAvatarFallback(user.name)}
                />
                <h4 className="text-xl font-bold mb-2">{user.name}</h4>
                <div className="text-sm">
                  Last seen:{" "}
                  {user.online_status == "success" ? (
                    <span className="text-green-500">Online</span>
                  ) : (
                    <span className="text-muted-foreground">
                      {user.last_seen}
                    </span>
                  )}
                </div>
              </div>
              <div className="divide-y space-y-2">
                {user.about && (
                  <div className="py-4 space-y-3">
                    <h5 className="uppercase text-xs font-semibold">About</h5>
                    <div>{user.about}</div>
                  </div>
                )}
                {user.phone && (
                  <div className="py-4 space-y-3">
                    <h5 className="uppercase text-xs font-semibold">Phone</h5>
                    <div>{user.phone}</div>
                  </div>
                )}
                {user.country && (
                  <div className="py-4 space-y-3">
                    <h5 className="uppercase text-xs font-semibold">Country</h5>
                    <div>{user.country}</div>
                  </div>
                )}
                {user.medias?.length && (
                  <div className="py-4 space-y-3">
                    <h5 className="uppercase text-xs font-semibold">Media</h5>
                    <div>
                      <ScrollArea className="w-full">
                        <div className="flex gap-4 *:flex-shrink-0">
                          {user.medias.map((item) => (
                            <>
                              {item.type === "image" && (
                                <div>
                                  <img
                                    className="w-20 h-20 rounded-lg"
                                    src={item.path}
                                    alt="..."
                                  />
                                </div>
                              )}
                              {item.type === "pdf" && (
                                <div>
                                  <Link
                                    href={item.path ?? "#"}
                                    className="bg-green-200 rounded-lg w-20 flex items-center justify-center aspect-square"
                                  >
                                    <SheetIcon className="w-8 h-8 text-green-500" />
                                  </Link>
                                </div>
                              )}
                              {item.type === "file" && (
                                <div>
                                  <a
                                    href="#"
                                    className="bg-orange-200 rounded-lg w-20 flex items-center justify-center aspect-square"
                                  >
                                    <FileText className="w-8 h-8 text-orange-500" />
                                  </a>
                                </div>
                              )}
                              {item.type === "excel" && (
                                <div>
                                  <a
                                    href="#"
                                    className="bg-orange-200 rounded-lg w-20 flex items-center justify-center aspect-square"
                                  >
                                    <FileText className="w-8 h-8 text-orange-500" />
                                  </a>
                                </div>
                              )}
                            </>
                          ))}
                        </div>
                        <ScrollBar orientation="horizontal" />
                      </ScrollArea>
                    </div>
                  </div>
                )}
                {user.website && (
                  <div className="py-4 space-y-3">
                    <h5 className="uppercase text-xs font-semibold">Website</h5>
                    <div>
                      <a
                        href={user.website}
                        target="_blank"
                        className="hover:underline"
                      >
                        {user.website}
                      </a>
                    </div>
                  </div>
                )}
                {user.social_links?.length && (
                  <div className="py-4 space-y-3">
                    <h5 className="uppercase text-xs font-semibold">
                      Social Links
                    </h5>
                    <div className="flex flex-wrap items-center gap-2 *:flex-shrink-0">
                      {user.social_links.map((item, key) => (
                        <Button
                          key={key}
                          asChild
                          variant="secondary"
                          className="w-12 h-12 p-0 items-center rounded-full"
                        >
                          <Link
                            href="#"
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
                  </div>
                )}
              </div>
            </ScrollArea>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
