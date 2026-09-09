"use client";

import { useWallet } from "@/components/WalletProvider";

export function Whisper() {
  const { whisper } = useWallet();
  if (!whisper) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-24 z-30 flex justify-center px-4">
      <p className="fx-whisper">{whisper}</p>
    </div>
  );
}
