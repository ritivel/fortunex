"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import { useWallet } from "@/components/WalletProvider";
import { formatClock, formatMoney } from "@/lib/format";
import { setMuted } from "@/lib/sounds";
import { useEffect } from "react";

const NAV = [
  { href: "/", label: "Lobby" },
  { href: "/play", label: "Slots" },
  { href: "/roulette", label: "Roulette" },
  { href: "/account", label: "Account" },
  { href: "/responsible", label: "Responsible" },
];

export function Header() {
  const pathname = usePathname();
  const { balance, setDepositOpen, soundOn, setSoundOn, clock, ready } =
    useWallet();

  useEffect(() => {
    setMuted(!soundOn);
  }, [soundOn]);

  return (
    <header className="sticky top-0 z-40 border-b border-white/8 bg-black/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:h-[4.5rem] sm:px-6">
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex">
            <Logo variant="full" priority />
          </span>
          <span className="sm:hidden">
            <Logo variant="chip" priority />
          </span>
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3 py-1.5 text-xs uppercase tracking-[0.18em] transition ${
                  active
                    ? "text-[var(--fx-purple-hot)]"
                    : "text-white/55 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <p className="hidden font-display text-xs tracking-[0.2em] text-white/40 lg:block">
            {ready ? formatClock(clock) : "--:--"}
          </p>
          <button
            type="button"
            onClick={() => setSoundOn(!soundOn)}
            className="hidden rounded-full border border-white/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-white/45 sm:inline"
            aria-label={soundOn ? "Mute sounds" : "Unmute sounds"}
          >
            {soundOn ? "Sound" : "Muted"}
          </button>
          <div className={`fx-balance ${balance === 0 ? "fx-balance-empty" : ""}`}>
            <span className="text-[10px] uppercase tracking-[0.22em] text-white/45">
              Balance
            </span>
            <strong className="font-display text-base text-white sm:text-lg">
              {ready ? formatMoney(balance) : "—"}
            </strong>
          </div>
          <button
            type="button"
            className="fx-btn-primary !px-3 !py-2 text-xs sm:!px-4"
            onClick={() => setDepositOpen(true)}
          >
            Add funds
          </button>
        </div>
      </div>
    </header>
  );
}
