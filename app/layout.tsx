import "./globals.css";

import { Inter, Bricolage_Grotesque } from "next/font/google";
import { cn } from "@/lib/utils";
import { fal } from "@fal-ai/client";

const inter = Inter({ subsets: ["latin"] });

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--bricolage-grotesque",
});

fal.config({
  proxyUrl: "/api/fal",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="el" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background",
          inter.className,
          bricolageGrotesque.variable
        )}
      >
        {/* <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >*/}
        {children}
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}
