"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { sounds } from "@/lib/sounds";

export type ForceOutcome = "lose" | "win" | "bust" | null;

type WalletSnapshot = {
  balance: number;
  totalDeposited: number;
  totalWagered: number;
  totalWon: number;
  depositLimit: number | null;
  lossLimit: number | null;
  selfExcluded: boolean;
  sessionStartedAt: number;
};

type WalletContextValue = WalletSnapshot & {
  ready: boolean;
  director: boolean;
  forceOutcome: ForceOutcome;
  depositOpen: boolean;
  zeroOpen: boolean;
  whisper: string | null;
  soundOn: boolean;
  clock: Date;
  lostThisSession: number;
  canPlay: boolean;
  playBlockReason: string | null;
  setDirector: (on: boolean) => void;
  setForceOutcome: (outcome: ForceOutcome) => void;
  setDepositOpen: (open: boolean) => void;
  setZeroOpen: (open: boolean) => void;
  setWhisper: (text: string | null) => void;
  setSoundOn: (on: boolean) => void;
  setClockOffset: (ms: number) => void;
  deposit: (amount: number) => { ok: boolean; message?: string };
  placeBet: (amount: number) => { ok: boolean; message?: string };
  settle: (payout: number, options?: { bust?: boolean }) => void;
  setBalance: (amount: number) => void;
  setDepositLimit: (amount: number | null) => void;
  setLossLimit: (amount: number | null) => void;
  setSelfExcluded: (excluded: boolean) => void;
  resetSession: () => void;
  triggerZero: () => void;
};

const STORAGE_KEY = "fortunex-wallet-v1";
const DIRECTOR_KEY = "fortunex-director";
const SOUND_KEY = "fortunex-sound";

const emptyWallet: WalletSnapshot = {
  balance: 0,
  totalDeposited: 0,
  totalWagered: 0,
  totalWon: 0,
  depositLimit: null,
  lossLimit: null,
  selfExcluded: false,
  sessionStartedAt: Date.now(),
};

const WalletContext = createContext<WalletContextValue | null>(null);

function loadWallet(): WalletSnapshot {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...emptyWallet, sessionStartedAt: Date.now() };
    const parsed = JSON.parse(raw) as Partial<WalletSnapshot>;
    return { ...emptyWallet, ...parsed };
  } catch {
    return { ...emptyWallet, sessionStartedAt: Date.now() };
  }
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [wallet, setWallet] = useState<WalletSnapshot>(emptyWallet);
  const [director, setDirectorState] = useState(false);
  const [forceOutcome, setForceOutcome] = useState<ForceOutcome>(null);
  const [depositOpen, setDepositOpen] = useState(false);
  const [zeroOpen, setZeroOpen] = useState(false);
  const [whisper, setWhisper] = useState<string | null>(null);
  const [soundOn, setSoundOnState] = useState(true);
  const [clockOffset, setClockOffset] = useState(0);
  const [clock, setClock] = useState(() => new Date());

  useEffect(() => {
    const next = loadWallet();
    setWallet(next);
    const params = new URLSearchParams(window.location.search);
    const adMode =
      params.get("ad") === "1" || localStorage.getItem(DIRECTOR_KEY) === "1";
    setDirectorState(adMode);
    const storedSound = localStorage.getItem(SOUND_KEY);
    setSoundOnState(storedSound !== "0");
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wallet));
  }, [ready, wallet]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setClock(new Date(Date.now() + clockOffset));
    }, 1000);
    return () => window.clearInterval(id);
  }, [clockOffset]);

  const setDirector = useCallback((on: boolean) => {
    setDirectorState(on);
    localStorage.setItem(DIRECTOR_KEY, on ? "1" : "0");
  }, []);

  const setSoundOn = useCallback((on: boolean) => {
    setSoundOnState(on);
    localStorage.setItem(SOUND_KEY, on ? "1" : "0");
  }, []);

  const lostThisSession = Math.max(0, wallet.totalWagered - wallet.totalWon);

  const playBlockReason = wallet.selfExcluded
    ? "Self-exclusion is on. Play is locked."
    : wallet.lossLimit !== null && lostThisSession >= wallet.lossLimit
      ? "You have reached your loss limit."
      : null;

  const persist = useCallback((updater: (prev: WalletSnapshot) => WalletSnapshot) => {
    setWallet((prev) => updater(prev));
  }, []);

  const deposit = useCallback(
    (amount: number) => {
      if (wallet.selfExcluded) {
        return { ok: false, message: "Account is self-excluded." };
      }
      if (!Number.isFinite(amount) || amount <= 0) {
        return { ok: false, message: "Enter a valid amount." };
      }
      if (
        wallet.depositLimit !== null &&
        wallet.totalDeposited + amount > wallet.depositLimit
      ) {
        return {
          ok: false,
          message: `Deposit limit is ${wallet.depositLimit}. Know your limit.`,
        };
      }
      persist((prev) => ({
        ...prev,
        balance: prev.balance + amount,
        totalDeposited: prev.totalDeposited + amount,
      }));
      if (soundOn) sounds.deposit();
      setZeroOpen(false);
      return { ok: true };
    },
    [persist, soundOn, wallet.depositLimit, wallet.selfExcluded, wallet.totalDeposited],
  );

  const placeBet = useCallback(
    (amount: number) => {
      if (playBlockReason) return { ok: false, message: playBlockReason };
      if (amount <= 0) return { ok: false, message: "Choose a stake." };
      if (wallet.balance < amount) {
        setDepositOpen(true);
        return { ok: false, message: "Not enough balance. Add funds." };
      }
      persist((prev) => ({
        ...prev,
        balance: prev.balance - amount,
        totalWagered: prev.totalWagered + amount,
      }));
      return { ok: true };
    },
    [persist, playBlockReason, wallet.balance],
  );

  const settle = useCallback(
    (payout: number, options?: { bust?: boolean }) => {
      persist((prev) => {
        const nextBalance = options?.bust ? 0 : prev.balance + Math.max(0, payout);
        return {
          ...prev,
          balance: nextBalance,
          totalWon: prev.totalWon + Math.max(0, payout),
        };
      });
    },
    [persist],
  );

  const setBalance = useCallback(
    (amount: number) => {
      persist((prev) => ({ ...prev, balance: Math.max(0, amount) }));
      if (amount <= 0) setZeroOpen(true);
      else setZeroOpen(false);
    },
    [persist],
  );

  const setDepositLimit = useCallback(
    (amount: number | null) => {
      persist((prev) => ({ ...prev, depositLimit: amount }));
    },
    [persist],
  );

  const setLossLimit = useCallback(
    (amount: number | null) => {
      persist((prev) => ({ ...prev, lossLimit: amount }));
    },
    [persist],
  );

  const setSelfExcluded = useCallback(
    (excluded: boolean) => {
      persist((prev) => ({ ...prev, selfExcluded: excluded }));
    },
    [persist],
  );

  const resetSession = useCallback(() => {
    const next = { ...emptyWallet, sessionStartedAt: Date.now() };
    setWallet(next);
    setZeroOpen(false);
    setWhisper(null);
    setForceOutcome(null);
    setDepositOpen(false);
  }, []);

  const triggerZero = useCallback(() => {
    persist((prev) => ({ ...prev, balance: 0 }));
    setZeroOpen(true);
    if (soundOn) sounds.zero();
  }, [persist, soundOn]);

  const value = useMemo<WalletContextValue>(
    () => ({
      ...wallet,
      ready,
      director,
      forceOutcome,
      depositOpen,
      zeroOpen,
      whisper,
      soundOn,
      clock,
      lostThisSession,
      canPlay: !playBlockReason,
      playBlockReason,
      setDirector,
      setForceOutcome,
      setDepositOpen,
      setZeroOpen,
      setWhisper,
      setSoundOn,
      setClockOffset,
      deposit,
      placeBet,
      settle,
      setBalance,
      setDepositLimit,
      setLossLimit,
      setSelfExcluded,
      resetSession,
      triggerZero,
    }),
    [
      wallet,
      ready,
      director,
      forceOutcome,
      depositOpen,
      zeroOpen,
      whisper,
      soundOn,
      clock,
      lostThisSession,
      playBlockReason,
      setDirector,
      setSoundOn,
      deposit,
      placeBet,
      settle,
      setBalance,
      setDepositLimit,
      setLossLimit,
      setSelfExcluded,
      resetSession,
      triggerZero,
    ],
  );

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) {
    throw new Error("useWallet must be used within WalletProvider");
  }
  return ctx;
}
