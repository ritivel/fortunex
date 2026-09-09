"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { useWallet } from "@/components/WalletProvider";
import { formatMoney } from "@/lib/format";

export function AccountView() {
  const {
    balance,
    totalDeposited,
    totalWagered,
    lostThisSession,
    depositLimit,
    lossLimit,
    selfExcluded,
    setDepositOpen,
    setDepositLimit,
    setLossLimit,
    setSelfExcluded,
    setZeroOpen,
  } = useWallet();
  const [depositInput, setDepositInput] = useState(depositLimit?.toString() ?? "");
  const [lossInput, setLossInput] = useState(lossLimit?.toString() ?? "");

  const empty = balance <= 0;

  return (
    <div className="mx-auto min-h-[80vh] max-w-lg px-4 py-10 pb-24 sm:px-6">
      <div className="flex justify-center">
        <Logo variant="chip" href={null} />
      </div>
      <p className="mt-6 text-center text-xs uppercase tracking-[0.4em] text-white/40">
        Account
      </p>
      <p className="mt-4 text-center text-[11px] uppercase tracking-[0.35em] text-white/35">
        Balance
      </p>
      <p
        className={`mt-2 text-center font-display ${
          empty ? "text-6xl text-white" : "text-5xl text-white"
        }`}
      >
        {formatMoney(balance)}
      </p>
      {empty ? (
        <p className="mt-4 text-center text-sm text-white/45">
          Nothing left. The night is quiet.
        </p>
      ) : null}

      <div className="mt-8 grid grid-cols-3 gap-3 text-center">
        <Stat label="Deposited" value={formatMoney(totalDeposited)} />
        <Stat label="Wagered" value={formatMoney(totalWagered)} />
        <Stat label="Lost" value={formatMoney(lostThisSession)} />
      </div>

      <div className="mt-8 flex flex-col gap-3">
        <button type="button" className="fx-btn-primary" onClick={() => setDepositOpen(true)}>
          Add funds
        </button>
        {empty ? (
          <button type="button" className="fx-btn-ghost" onClick={() => setZeroOpen(true)}>
            View empty balance
          </button>
        ) : (
          <Link href="/play" className="fx-btn-ghost text-center">
            Back to the tables
          </Link>
        )}
        <Link href="/" className="text-center text-xs uppercase tracking-[0.2em] text-white/40">
          Back to lobby
        </Link>
      </div>

      <section className="fx-panel mt-10 p-5">
        <h2 className="font-display text-xl text-white">Know your limit</h2>
        <p className="mt-2 text-sm text-white/50">
          Set a cap before the night gets away from you. These tools are part of
          the brand message in the film.
        </p>

        <label className="mt-5 block text-xs uppercase tracking-[0.2em] text-white/40">
          Deposit limit
          <div className="mt-2 flex gap-2">
            <input
              className="fx-input"
              inputMode="numeric"
              value={depositInput}
              onChange={(event) => setDepositInput(event.target.value)}
              placeholder="None"
            />
            <button
              type="button"
              className="fx-btn-ghost !px-3"
              onClick={() =>
                setDepositLimit(depositInput ? Number(depositInput) : null)
              }
            >
              Save
            </button>
          </div>
        </label>

        <label className="mt-4 block text-xs uppercase tracking-[0.2em] text-white/40">
          Loss limit
          <div className="mt-2 flex gap-2">
            <input
              className="fx-input"
              inputMode="numeric"
              value={lossInput}
              onChange={(event) => setLossInput(event.target.value)}
              placeholder="None"
            />
            <button
              type="button"
              className="fx-btn-ghost !px-3"
              onClick={() => setLossLimit(lossInput ? Number(lossInput) : null)}
            >
              Save
            </button>
          </div>
        </label>

        <button
          type="button"
          className={`mt-5 w-full ${selfExcluded ? "fx-btn-primary" : "fx-btn-ghost"}`}
          onClick={() => setSelfExcluded(!selfExcluded)}
        >
          {selfExcluded ? "Lift self-exclusion" : "Self-exclude from play"}
        </button>
      </section>

      <p className="mt-8 text-center text-sm text-white/40">
        <Link href="/responsible" className="text-[var(--fx-purple-hot)]">
          Play responsibly. Know your limit.
        </Link>
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/3 px-2 py-3">
      <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">{label}</p>
      <p className="mt-1 font-display text-lg text-white">{value}</p>
    </div>
  );
}
