import { Card, CardContent } from "@/components/ui/card";
import Header from "./header";
import Link from "next/link";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="py-4 lg:py-8 container mx-auto">
      <Header />
      <main>
        <div className="grid lg:grid-cols-8 gap-4">
          <div className="lg:col-span-2">
            <Card className=" sticky top-4">
              <CardContent className="p-0 py-4">
                <div className="px-6 py-3 text-sm text-muted-foreground">
                  Table of Content
                </div>
                <div className="*:block *:px-6 *:py-3 hover:*:bg-muted">
                  <Link href="#Introduction">Introduction</Link>
                  <Link href="#Development">Development</Link>
                  <Link href="#Production">Production</Link>
                  <Link href="#FileStructure">File Structure</Link>
                  <Link href="#ThemeCustomization">Theme Customization</Link>
                  <Link href="#Support">Support</Link>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-6">
            <Card>
              <CardContent className="pt-6">{children}</CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
