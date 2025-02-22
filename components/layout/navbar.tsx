"use client";

import { icons, Menu } from "lucide-react";
import React from "react";
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
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";
import { Button } from "../ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ToggleTheme } from "./toogle-theme";
import Logo from "./logo";
import { productList, routeList } from "@/@data/navbar";
import { Icon } from "../ui/extras/icon";

export const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header className="sticky top-2 lg:top-5 z-40">
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
                <NavigationMenuTrigger className="bg-transparent hover:!bg-transparent">
                  Products
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[300px] gap-5 p-2">
                    <ul className="flex flex-col">
                      {productList.map(({ title, description, icon }) => (
                        <li key={title}>
                          <Link
                            href="/"
                            className="flex gap-6 items-start rounded-md p-4 text-sm hover:bg-muted"
                          >
                            <div className="flex items-center justify-center size-8 bg-primary/20 p-2 rounded-full ring-8 ring-primary/10 mb-4">
                              <Icon
                                name={icon as keyof typeof icons}
                                color="hsl(var(--primary))"
                                className="text-primary flex-shrink-0 size-5"
                              />
                            </div>
                            <div>
                              <p className="mb-1 font-semibold leading-none text-foreground">
                                {title}
                              </p>
                              <p className="line-clamp-2 text-muted-foreground">
                                {description}
                              </p>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

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

          <div className="hidden lg:flex">
            <ToggleTheme />

            <Button
              asChild
              size="sm"
              className="ms-2"
              aria-label="Get Template"
            >
              <Link
                aria-label="Get Template"
                href="https://bundui.lemonsqueezy.com/buy/1bdac9fb-8246-494a-b28c-6c2ca6a28867"
                target="_blank"
              >
                Get Template
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
