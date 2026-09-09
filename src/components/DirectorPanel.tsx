"use client";

import { useState } from "react";
import { useWallet } from "@/components/WalletProvider";

export function DirectorPanel() {
  const {
    director,
    setDirector,
    setForceOutcome,
    forceOutcome,
    setBalance,
    triggerZero,
    resetSession,
    setDepositOpen,
    setZeroOpen,
    setClockOffset,
    setWhisper,
  } = useWallet();
  const [open, setOpen] = useState(false);
  const [customBalance, setCustomBalance] = useState("50");

  if (!director) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[60] w-[min(100%-2rem,20rem)] font-sans text-xs">
      <button
        type="button"
        className="mb-2 rounded-full border border-white/15 bg-black/70 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-white/70"
        onClick={() => setOpen((value) => !value)}
      >
        Ad controls {open ? "▾" : "▸"}
      </button>
      {open ? (
        <div className="rounded-2xl border border-[var(--fx-purple)]/40 bg-black/85 p-3 shadow-[0_0_40px_rgba(157,80,255,0.2)] backdrop-blur">
          <p className="mb-2 text-[10px] uppercase tracking-[0.3em] text-[var(--fx-purple-hot)]">
            Filming
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" className="fx-dir-btn" onClick={() => setForceOutcome("lose")}>
              Next: lose
            </button>
            <button type="button" className="fx-dir-btn" onClick={() => setForceOutcome("win")}>
              Next: win
            </button>
            <button type="button" className="fx-dir-btn" onClick={() => setForceOutcome("bust")}>
              Next: bust to $0
            </button>
            <button
              type="button"
              className="fx-dir-btn"
              onClick={() => {
                setOpen(false);
                triggerZero();
              }}
            >
              Show BALANCE $0
            </button>
            <button
              type="button"
              className="fx-dir-btn"
              onClick={() => {
                setWhisper("Just one more…");
                window.setTimeout(() => setWhisper(null), 2600);
              }}
            >
              Super: one more
            </button>
            <button type="button" className="fx-dir-btn" onClick={() => setDepositOpen(true)}>
              Open deposit
            </button>
            <button
              type="button"
              className="fx-dir-btn"
              onClick={() => setClockOffset(-3.5 * 60 * 60 * 1000)}
            >
              Clock: late night
            </button>
            <button type="button" className="fx-dir-btn" onClick={() => resetSession()}>
              Reset session
            </button>
          </div>
          <div className="mt-2 flex gap-2">
            <input
              className="fx-input !py-1.5 !text-xs"
              value={customBalance}
              onChange={(event) => setCustomBalance(event.target.value)}
            />
            <button
              type="button"
              className="fx-dir-btn shrink-0"
              onClick={() => {
                setBalance(Number(customBalance) || 0);
                setZeroOpen(Number(customBalance) <= 0);
              }}
            >
              Set $
            </button>
          </div>
          <p className="mt-2 text-white/40">
            Forced: {forceOutcome ?? "none"} · add <code>?ad=1</code> to the URL
          </p>
          <button
            type="button"
            className="mt-2 text-white/35 underline"
            onClick={() => setDirector(false)}
          >
            Hide director mode
          </button>
        </div>
      ) : null}
    </div>
  );
}
