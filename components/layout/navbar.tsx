"use client";

import { Menu } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Separator } from "../ui/separator";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";
import { Button } from "../ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ToggleTheme } from "./toogle-theme";
import Logo from "./logo";
import { routeList } from "@/data/navbar";
import { createClient } from "@/supabase/client";

export const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isSignedIn, setIsSignedIn] = React.useState(false);
  const supabase = createClient();

  supabase.auth.onAuthStateChange((event, session) => {
    if (event === "INITIAL_SESSION" || event === "SIGNED_IN") {
      setIsSignedIn(!!session);
    }
  });

  return (
    <header className="sticky top-2 lg:top-5 z-40 mb-10">
      <div className="container">
        <div className="bg-opacity-15 border rounded-2xl flex justify-between items-center p-2 bg-background/70 backdrop-blur-sm">
          <Logo />
          {/* <!-- Mobile --> */}
          <div className="flex items-center lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Menu
                  onClick={() => setIsOpen(!isOpen)}
                  className="cursor-pointer lg:hidden"
                />
              </SheetTrigger>

              <SheetContent
                side="left"
                className="flex flex-col justify-between rounded-tr-2xl rounded-br-2xl bg-card border-secondary"
              >
                <div>
                  <SheetHeader className="mb-4 ml-4">
                    <SheetTitle className="flex items-center">
                      <Logo />
                    </SheetTitle>
                  </SheetHeader>

                  <div className="flex flex-col gap-2">
                    {routeList.map(({ href, label }) => (
                      <Button
                        key={href}
                        onClick={() => setIsOpen(false)}
                        asChild
                        variant="ghost"
                        className="justify-start text-base"
                      >
                        <Link href={href}>{label}</Link>
                      </Button>
                    ))}
                  </div>
                </div>

                <SheetFooter className="flex-col sm:flex-col justify-start items-start">
                  <Separator className="mb-2" />
                  <ToggleTheme />
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>

          {/* <!-- Desktop --> */}
          <NavigationMenu className="hidden lg:block mx-auto">
            <NavigationMenuList className="space-x-0">
              <NavigationMenuItem>
                {routeList.map(({ href, label }) => (
                  <NavigationMenuLink
                    key={href}
                    asChild
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "!bg-transparent"
                    )}
                  >
                    <Link href={href}>{label}</Link>
                  </NavigationMenuLink>
                ))}
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex">
            <ToggleTheme />

            {isSignedIn ? (
              <Button
                size="sm"
                className="ms-2"
                aria-label="Sign Out"
                onClick={() => supabase.auth.signOut()}
              >
                Sign Out
              </Button>
            ) : (
              <Button asChild size="sm" className="ms-2" aria-label="Join">
                <Link aria-label="Join" href="/login" target="_blank">
                  Join
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
