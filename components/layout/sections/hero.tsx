"use client";

import { Button } from "@/components/ui/button";
import { BackgroundBeamsWithCollision } from "@/components/ui/extras/background-beams-with-collision";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const HeroSection = () => {
  return (
    <section className="container w-full">
      <div className="grid place-items-center lg:max-w-screen-xl mx-auto py-16 md:py-32">
        <BackgroundBeamsWithCollision>
          <div className="text-center space-y-8 pb-20">
            <div className="max-w-screen-md mx-auto text-center text-4xl md:text-6xl font-bold">
              <h1>AI Podcast creator for your business</h1>
            </div>
            <p className="max-w-screen-sm mx-auto text-xl text-muted-foreground">
              Meet our AI-powered SaaS solution to lighten your workload,
              increase efficiency and make more accurate decisions.
            </p>
            <div className="space-y-4 md:space-y-0 md:space-x-4">
              <Button asChild className="w-5/6 md:w-1/4 font-bold group/arrow">
                <Link href="/chats">
                  Go to studio
                  <ArrowRight className="size-5 ml-2 group-hover/arrow:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </BackgroundBeamsWithCollision>

        <div className="relative group">
          <div className="absolute top-2 lg:-top-8 left-1/2 transform -translate-x-1/2 w-[90%] mx-auto h-24 lg:h-80 bg-primary/60 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-full h-20 md:h-32 bg-gradient-to-b from-background/0 via-background/60 to-background rounded-lg" />
        </div>
      </div>
    </section>
  );
};
