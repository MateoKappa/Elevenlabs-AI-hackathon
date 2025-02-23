import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Logo from "../logo";
import { Button } from "@/components/ui/button";

export const FooterSection = () => {
  return (
    <footer id="footer" className="container pb-8 lg:pb-16">
      <div className="p-10 bg-muted border rounded-2xl">
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-x-12 gap-y-8">
          <div className="col-span-full xl:col-span-2">
            <Logo />
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg mb-2">Contact</h3>
            <div>
              <Link href="https://github.com/MateoKappa/Elevenlabs-AI-hackathon" className="opacity-60 hover:opacity-100">
                Github
              </Link>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="text-sm text-muted-foreground">
          &copy; 2025 | Built by the {" "}
          <Button variant="link" className="p-0 h-auto" asChild>
            <Link target="_blank" href="https://sensay.io/">
              Sensay
            </Link>
          </Button>
          {" "}engineering team.
        </div>
      </div>
    </footer>
  );
};
