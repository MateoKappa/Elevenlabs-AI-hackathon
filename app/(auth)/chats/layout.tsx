import Providers from "@/components/providers";

export default function ChatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Providers>{children}</Providers>;
}
