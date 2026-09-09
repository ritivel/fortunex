"use client";

import Link from "next/link";
import { useWallet } from "@/components/WalletProvider";
import { Logo } from "@/components/Logo";

export function BalanceZeroOverlay() {
  const { zeroOpen, setZeroOpen, setDepositOpen, balance } = useWallet();

  if (!zeroOpen || balance > 0) return null;

  return (
    <div className="fx-zero-overlay">
      <div className="fx-vignette" />
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p className="text-xs uppercase tracking-[0.5em] text-white/35">Account</p>
        <p className="mt-6 font-display text-5xl tracking-[0.18em] text-white sm:text-7xl">
          BALANCE
        </p>
        <p className="mt-3 font-display text-6xl text-white sm:text-8xl">$0</p>
        <div className="mt-10 h-px w-40 bg-gradient-to-r from-transparent via-[var(--fx-purple)] to-transparent" />
        <p className="mt-10 max-w-md text-base leading-7 text-white/55">
          Gambling is not a way to make money.
          <br />
          Never gamble more than you can afford to lose.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link href="/responsible" className="fx-btn-primary" onClick={() => setZeroOpen(false)}>
            Play responsibly
          </Link>
          <button
            type="button"
            className="fx-btn-ghost"
            onClick={() => {
              setZeroOpen(false);
              setDepositOpen(true);
            }}
          >
            Add funds anyway
          </button>
        </div>
        <div className="mt-16 opacity-80">
          <Logo href="/" />
        </div>
        <p className="mt-3 text-[11px] uppercase tracking-[0.35em] text-white/40">
          Know your limit
        </p>
      </div>
    </div>
  );
}
