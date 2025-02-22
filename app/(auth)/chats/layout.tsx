import { Navbar } from "@/components/layout/navbar";
import Providers from "@/components/providers";

export default function ChatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <Navbar />

      {children}
    </Providers>
  );
}
