"use client";

import { useState } from "react";
import { useWallet } from "@/components/WalletProvider";
import { formatMoney } from "@/lib/format";
import { sounds } from "@/lib/sounds";

const STAKES = [5, 10, 25, 50, 100];
const REDS = new Set([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]);

type Bet = "red" | "black" | "green";

function colorOf(n: number): Bet {
  if (n === 0) return "green";
  return REDS.has(n) ? "red" : "black";
}

function nextNumber(force: "lose" | "win" | "bust" | null, bet: Bet): number {
  if (force === "win") {
    if (bet === "green") return 0;
    const pool = Array.from({ length: 37 }, (_, i) => i).filter((n) => colorOf(n) === bet);
    return pool[Math.floor(Math.random() * pool.length)];
  }
  if (force === "lose" || force === "bust") {
    const pool = Array.from({ length: 37 }, (_, i) => i).filter((n) => colorOf(n) !== bet);
    return pool[Math.floor(Math.random() * pool.length)];
  }
  if (Math.random() < 0.18) {
    const pool = Array.from({ length: 37 }, (_, i) => i).filter((n) => colorOf(n) === bet);
    return pool[Math.floor(Math.random() * pool.length)];
  }
  const pool = Array.from({ length: 37 }, (_, i) => i).filter((n) => colorOf(n) !== bet);
  return pool[Math.floor(Math.random() * pool.length)];
}

export function RouletteTable() {
  const {
    balance,
    placeBet,
    settle,
    forceOutcome,
    setForceOutcome,
    setWhisper,
    setZeroOpen,
    setDepositOpen,
    canPlay,
    playBlockReason,
    soundOn,
  } = useWallet();

  const [stake, setStake] = useState(10);
  const [bet, setBet] = useState<Bet>("red");
  const [spinning, setSpinning] = useState(false);
  const [number, setNumber] = useState<number | null>(null);
  const [banner, setBanner] = useState("Pick a color. Place a stake.");

  const spin = () => {
    if (spinning) return;
    if (!canPlay) {
      setBanner(playBlockReason ?? "Play is locked.");
      return;
    }
    const placed = placeBet(stake);
    if (!placed.ok) {
      setBanner(placed.message ?? "Add funds to play.");
      setDepositOpen(true);
      return;
    }

    const result = nextNumber(forceOutcome, bet);
    const willBust =
      forceOutcome === "bust" || (colorOf(result) !== bet && balance - stake <= 0);
    setForceOutcome(null);
    setSpinning(true);
    setBanner("The wheel is turning…");
    setWhisper(null);
    if (soundOn) sounds.spin();

    window.setTimeout(() => {
      setNumber(result);
      setSpinning(false);
      const won = colorOf(result) === bet;
      const payout = won ? stake * (bet === "green" ? 14 : 2) : 0;
      settle(payout, { bust: willBust });

      if (willBust || (!won && balance - stake <= 0)) {
        setBanner("BALANCE: $0");
        if (soundOn) sounds.zero();
        window.setTimeout(() => setZeroOpen(true), 700);
        return;
      }

      if (won) {
        setBanner(`Hit ${result}. You won ${formatMoney(payout)}.`);
        if (soundOn) sounds.win();
        return;
      }

      setBanner(`${result} · ${colorOf(result)}. Not this time.`);
      if (soundOn) sounds.lose();
      setWhisper("Just one more…");
      window.setTimeout(() => setWhisper(null), 2400);
    }, 1600);
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="fx-machine">
        <p className="text-[10px] uppercase tracking-[0.35em] text-[var(--fx-purple-hot)]">
          Neon Roulette
        </p>

        <div className="mt-6 flex flex-col items-center">
          <div className={`fx-wheel ${spinning ? "fx-wheel-spin" : ""}`}>
            <span className="font-display text-4xl text-white">
              {number === null ? "•" : number}
            </span>
          </div>
          <p className="mt-4 text-sm uppercase tracking-[0.25em] text-white/40">
            {number === null ? "No spin yet" : colorOf(number)}
          </p>
        </div>

        <p className="mt-6 text-center font-display text-xl text-white">{banner}</p>

        <div className="mt-6 grid grid-cols-3 gap-2">
          {(["red", "black", "green"] as const).map((value) => (
            <button
              key={value}
              type="button"
              className={`fx-chip capitalize ${bet === value ? "fx-chip-active" : ""}`}
              onClick={() => setBet(value)}
            >
              {value}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {STAKES.map((value) => (
            <button
              key={value}
              type="button"
              className={`fx-chip ${stake === value ? "fx-chip-active" : ""}`}
              onClick={() => setStake(value)}
            >
              {formatMoney(value)}
            </button>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center gap-3">
          <button type="button" className="fx-spin" disabled={spinning} onClick={spin}>
            {spinning ? "Spinning" : "Spin the wheel"}
          </button>
          <p className="text-xs text-white/40">
            Stake {formatMoney(stake)} on {bet}
          </p>
        </div>
      </div>
    </div>
  );
}
