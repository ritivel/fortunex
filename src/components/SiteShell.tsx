import { ConditionalFooter } from "@/components/ConditionalFooter";
import { Header } from "@/components/Header";
import { MobileNav } from "@/components/MobileNav";
import { Whisper } from "@/components/Whisper";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Header />
      <Whisper />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <ConditionalFooter />
      <MobileNav />
    </div>
  );
}
