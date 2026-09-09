"use client";

import Image from "next/image";
import Link from "next/link";
import { useWallet } from "@/components/WalletProvider";

export function HomeView() {
  const { setDepositOpen, balance } = useWallet();

  return (
    <>
      <section className="relative isolate min-h-[88vh] overflow-hidden">
        <Image
          src="/brand/hero.jpg"
          alt="Cards, dice, and a FortuneX chip in neon purple light"
          fill
          priority
          className="object-cover object-right"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/88 to-black/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
        <div className="fx-hero-mist" />

        <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-center px-4 py-20 sm:px-6">
          <p className="text-xs uppercase tracking-[0.45em] text-[var(--fx-purple-hot)]">
            Online casino
          </p>
          <h1 className="mt-5 max-w-xl font-display text-5xl leading-[0.95] text-white sm:text-7xl">
            The night
            <br />
            is open.
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-white/65 sm:text-lg">
            Put in a little. Play another round. The tables do not sleep.
            FortuneX is a demo casino built for the film — no real money leaves
            your pocket.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/play" className="fx-btn-primary text-center">
              Play now
            </Link>
            <button type="button" className="fx-btn-ghost" onClick={() => setDepositOpen(true)}>
              {balance > 0 ? "Add more funds" : "Put in an amount"}
            </button>
          </div>
          <p className="mt-6 text-[11px] uppercase tracking-[0.28em] text-white/35">
            18+ · Play responsibly · Know your limit
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--fx-purple-hot)]">
              Tables
            </p>
            <h2 className="mt-2 font-display text-3xl text-white">Choose a game</h2>
          </div>
          <Link href="/responsible" className="text-xs uppercase tracking-[0.2em] text-white/40 hover:text-white">
            Safer play
          </Link>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <Link href="/play" className="fx-game-card">
            <div className="flex items-start justify-between">
              <p className="text-4xl">♠ 7 ◉</p>
              <span className="fx-live">Live</span>
            </div>
            <h3 className="mt-8 font-display text-2xl text-white">Neon Slots</h3>
            <p className="mt-2 text-sm text-white/55">
              Three reels. One more spin. The game used in the commercial.
            </p>
          </Link>
          <Link href="/roulette" className="fx-game-card">
            <div className="flex items-start justify-between">
              <p className="text-4xl">◎</p>
              <span className="fx-live">Live</span>
            </div>
            <h3 className="mt-8 font-display text-2xl text-white">Neon Roulette</h3>
            <p className="mt-2 text-sm text-white/55">
              Red, black, or green. Watch the wheel, watch the balance.
            </p>
          </Link>
        </div>
      </section>

      <section className="border-y border-white/8 bg-[var(--fx-ink)]">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-3">
          {[
            {
              n: "01",
              t: "Put in a small amount",
              d: "Add demo credits. Start small. The film begins here.",
            },
            {
              n: "02",
              t: "Play another round",
              d: "Lose, raise the stake, tell yourself just one more.",
            },
            {
              n: "03",
              t: "See the balance",
              d: "When it hits zero, the night goes quiet.",
            },
          ].map((step) => (
            <div key={step.n}>
              <p className="font-display text-sm text-[var(--fx-purple-hot)]">{step.n}</p>
              <h3 className="mt-2 font-display text-xl text-white">{step.t}</h3>
              <p className="mt-2 text-sm leading-6 text-white/50">{step.d}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
