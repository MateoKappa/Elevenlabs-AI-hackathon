"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="flex z-10 flex-col bg-background p-4 rounded-lg mb-4 shadow-sm border">
      <nav className="flex flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="#"
            className="group aspect-square flex shrink-0 rounded-lg items-center justify-center gap-2 bg-black/90 dark:bg-white/20 text-lg font-semibold text-primary-foreground md:text-base h-12 w-12"
          >
            <Image
              src="/logo.svg"
              width={24}
              height={24}
              alt="sohopro logo svg"
            />
            <span className="sr-only">SohoPro</span>
          </Link>
          <span className="font-semibold">SohoPro Docs</span>
        </div>
        <Button asChild variant="secondary">
          <Link
            href="https://sohopro.laborasyon.com"
            className={cn(
              "flex items-center justify-center rounded-lg text-accent-foreground transition-colors hover:text-foreground",
              { "bg-accent": pathname === "/contacts" }
            )}
          >
            <span>Get Template</span>
          </Link>
        </Button>
      </nav>
    </header>
  );
}
