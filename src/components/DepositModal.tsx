"use client";

import { useState } from "react";
import { useWallet } from "@/components/WalletProvider";
import { formatMoney } from "@/lib/format";
import { sounds } from "@/lib/sounds";

const PRESETS = [20, 50, 100, 250, 500, 1000];

export function DepositModal() {
  const { depositOpen, setDepositOpen, deposit, depositLimit, totalDeposited, soundOn } =
    useWallet();
  const [amount, setAmount] = useState(20);
  const [custom, setCustom] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (!depositOpen) return null;

  const close = () => {
    setDepositOpen(false);
    setError(null);
    setDone(false);
    setCustom("");
  };

  const chosen = custom ? Number(custom) : amount;

  const confirm = () => {
    if (soundOn) sounds.click();
    const result = deposit(chosen);
    if (!result.ok) {
      setError(result.message ?? "Could not add funds.");
      setDone(false);
      return;
    }
    setError(null);
    setDone(true);
    window.setTimeout(close, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Close deposit"
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={close}
      />
      <div className="fx-panel relative z-10 w-full max-w-md p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.35em] text-[var(--fx-purple-hot)]">
          Add funds
        </p>
        <h2 className="mt-2 font-display text-2xl text-white">Put in an amount</h2>
        <p className="mt-2 text-sm text-white/55">
          Demo credits only. Never gamble more than you can afford to lose.
        </p>

        <div className="mt-6 grid grid-cols-3 gap-2">
          {PRESETS.map((value) => (
            <button
              key={value}
              type="button"
              className={`fx-chip ${!custom && amount === value ? "fx-chip-active" : ""}`}
              onClick={() => {
                setAmount(value);
                setCustom("");
                setError(null);
              }}
            >
              {formatMoney(value)}
            </button>
          ))}
        </div>

        <label className="mt-5 block text-xs uppercase tracking-[0.2em] text-white/40">
          Custom amount
          <input
            type="number"
            min={1}
            inputMode="numeric"
            value={custom}
            onChange={(event) => {
              setCustom(event.target.value);
              setError(null);
            }}
            placeholder="Enter amount"
            className="fx-input mt-2"
          />
        </label>

        {depositLimit !== null ? (
          <p className="mt-3 text-xs text-white/45">
            Limit {formatMoney(depositLimit)} · used {formatMoney(totalDeposited)}
          </p>
        ) : null}

        {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}
        {done ? (
          <p className="mt-3 text-sm text-[var(--fx-purple-hot)]">
            {formatMoney(chosen)} added.
          </p>
        ) : null}

        <div className="mt-6 flex gap-3">
          <button type="button" className="fx-btn-primary flex-1" onClick={confirm}>
            Confirm {Number.isFinite(chosen) && chosen > 0 ? formatMoney(chosen) : ""}
          </button>
          <button type="button" className="fx-btn-ghost" onClick={close}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
