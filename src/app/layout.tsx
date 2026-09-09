import type { Metadata } from "next";
import { Orbitron, Outfit } from "next/font/google";
import { Providers } from "@/components/Providers";
import { SiteShell } from "@/components/SiteShell";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FortuneX Online Casino",
  description:
    "FortuneX is a demonstration casino for a responsible-gambling film. Play demo slots and roulette. Know your limit.",
  icons: {
    icon: "/brand/chip.png",
    apple: "/brand/chip.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${orbitron.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-black font-sans text-white">
        <Providers>
          <SiteShell>{children}</SiteShell>
        </Providers>
      </body>
    </html>
  );
}
