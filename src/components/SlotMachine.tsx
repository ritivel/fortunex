"use client";

import { useEffect, useMemo, useState } from "react";
import { useWallet } from "@/components/WalletProvider";
import { formatMoney } from "@/lib/format";
import { sounds } from "@/lib/sounds";

const STAKES = [5, 10, 25, 50, 100, 250];

type SymbolId = "spade" | "seven" | "diamond" | "star" | "bar" | "chip";

type SlotSymbol = {
  id: SymbolId;
  label: string;
  className: string;
};

const SYMBOLS: SlotSymbol[] = [
  { id: "spade", label: "♠", className: "text-white" },
  { id: "seven", label: "7", className: "text-[var(--fx-purple-hot)]" },
  { id: "diamond", label: "♦", className: "text-violet-200" },
  { id: "star", label: "★", className: "text-white" },
  { id: "bar", label: "BAR", className: "text-sm tracking-[0.2em] text-white" },
  { id: "chip", label: "◉", className: "text-[var(--fx-purple)]" },
];

function pick(id?: SymbolId): SlotSymbol {
  if (id) return SYMBOLS.find((item) => item.id === id) ?? SYMBOLS[0];
  return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

function differentFrom(a: SlotSymbol, b?: SlotSymbol): SlotSymbol {
  let next = pick();
  let guard = 0;
  while ((next.id === a.id || (b && next.id === b.id)) && guard < 12) {
    next = pick();
    guard += 1;
  }
  return next;
}

function decideReels(force: "lose" | "win" | "bust" | null): {
  reels: [SlotSymbol, SlotSymbol, SlotSymbol];
  multiplier: number;
} {
  if (force === "win") {
    const seven = pick("seven");
    return { reels: [seven, seven, seven], multiplier: 8 };
  }

  if (force === "lose" || force === "bust") {
    const first = pick();
    const second = differentFrom(first);
    const third = differentFrom(first, second);
    return { reels: [first, second, third], multiplier: 0 };
  }

  const roll = Math.random();
  if (roll < 0.07) {
    const symbol = pick();
    return { reels: [symbol, symbol, symbol], multiplier: symbol.id === "seven" ? 8 : 5 };
  }
  if (roll < 0.16) {
    const symbol = pick();
    return { reels: [symbol, symbol, differentFrom(symbol)], multiplier: 2 };
  }

  const first = pick();
  const second = differentFrom(first);
  const third = differentFrom(first, second);
  return { reels: [first, second, third], multiplier: 0 };
}

export function SlotMachine() {
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
  const [reels, setReels] = useState<[SlotSymbol, SlotSymbol, SlotSymbol]>([
    pick("spade"),
    pick("seven"),
    pick("chip"),
  ]);
  const [spinning, setSpinning] = useState(false);
  const [stopped, setStopped] = useState<[boolean, boolean, boolean]>([true, true, true]);
  const [banner, setBanner] = useState("Place a stake. Spin the night.");
  const [lastWin, setLastWin] = useState(0);

  const spinDisabled = spinning || !canPlay;

  const displayReels = useMemo(() => reels, [reels]);

  useEffect(() => {
    if (!spinning) return;
    const id = window.setInterval(() => {
      setReels([pick(), pick(), pick()]);
      if (soundOn) sounds.tick();
    }, 90);
    return () => window.clearInterval(id);
  }, [spinning, soundOn]);

  const spin = () => {
    if (spinning) return;
    if (!canPlay) {
      setBanner(playBlockReason ?? "Play is locked.");
      return;
    }
    const bet = placeBet(stake);
    if (!bet.ok) {
      setBanner(bet.message ?? "Add funds to play.");
      return;
    }

    const planned = decideReels(forceOutcome);
    const willBust = forceOutcome === "bust" || (planned.multiplier === 0 && balance - stake <= 0);
    setForceOutcome(null);
    setSpinning(true);
    setStopped([false, false, false]);
    setBanner("Spinning…");
    setLastWin(0);
    setWhisper(null);
    if (soundOn) sounds.spin();

    window.setTimeout(() => setStopped([true, false, false]), 900);
    window.setTimeout(() => setStopped([true, true, false]), 1300);
    window.setTimeout(() => {
      setSpinning(false);
      setStopped([true, true, true]);
      setReels(planned.reels);
      const payout = stake * planned.multiplier;
      settle(payout, { bust: willBust });

      if (willBust || (payout === 0 && balance - stake <= 0)) {
        setBanner("BALANCE: $0");
        setLastWin(0);
        if (soundOn) sounds.zero();
        window.setTimeout(() => setZeroOpen(true), 700);
        return;
      }

      if (payout > 0) {
        setBanner(`You won ${formatMoney(payout)}`);
        setLastWin(payout);
        if (soundOn) sounds.win();
        return;
      }

      setBanner("Not this time.");
      setLastWin(0);
      if (soundOn) sounds.lose();
      setWhisper("Just one more…");
      window.setTimeout(() => setWhisper(null), 2400);
    }, 1800);
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="fx-machine">
        <div className="flex items-center justify-between gap-3 px-2">
          <p className="text-[10px] uppercase tracking-[0.35em] text-[var(--fx-purple-hot)]">
            Neon Slots
          </p>
          <p className="text-[10px] uppercase tracking-[0.25em] text-white/35">
            Demo play
          </p>
        </div>

        <div className="fx-reel-window mt-5">
          {displayReels.map((symbol, index) => (
            <div
              key={`${symbol.id}-${index}`}
              className={`fx-reel ${!stopped[index] ? "fx-reel-spin" : ""}`}
            >
              <span className={`fx-symbol ${symbol.className}`}>{symbol.label}</span>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center font-display text-xl text-white sm:text-2xl">
          {banner}
        </p>
        {lastWin > 0 ? (
          <p className="mt-1 text-center text-sm text-[var(--fx-purple-hot)]">
            +{formatMoney(lastWin)}
          </p>
        ) : null}

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {STAKES.map((value) => (
            <button
              key={value}
              type="button"
              disabled={spinning}
              className={`fx-chip ${stake === value ? "fx-chip-active" : ""}`}
              onClick={() => setStake(value)}
            >
              {formatMoney(value)}
            </button>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center gap-3">
          <button
            type="button"
            className="fx-spin"
            disabled={spinDisabled}
            onClick={() => {
              if (balance < stake) {
                setDepositOpen(true);
                setBanner("Add funds to keep playing.");
                return;
              }
              spin();
            }}
          >
            {spinning ? "Good luck" : "Spin"}
          </button>
          <p className="text-xs text-white/40">
            Stake {formatMoney(stake)} · Balance {formatMoney(balance)}
          </p>
          {playBlockReason ? (
            <p className="text-center text-sm text-rose-300">{playBlockReason}</p>
          ) : null}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3 text-center text-[11px] uppercase tracking-[0.18em] text-white/40">
        <p>3 × 7 pays 8×</p>
        <p>3 match pays 5×</p>
        <p>2 match pays 2×</p>
      </div>
    </div>
  );
}
