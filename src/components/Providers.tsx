"use client";

import { AgeGate } from "@/components/AgeGate";
import { BalanceZeroOverlay } from "@/components/BalanceZeroOverlay";
import { DepositModal } from "@/components/DepositModal";
import { DirectorPanel } from "@/components/DirectorPanel";
import { WalletProvider } from "@/components/WalletProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WalletProvider>
      <AgeGate>
        {children}
        <DepositModal />
        <BalanceZeroOverlay />
        <DirectorPanel />
      </AgeGate>
    </WalletProvider>
  );
}
