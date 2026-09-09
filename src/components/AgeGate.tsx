"use client";

import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";

const KEY = "fortunex-age-ok";

export function AgeGate({ children }: { children: React.ReactNode }) {
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("ad") === "1" || localStorage.getItem(KEY) === "1") {
      setAllowed(true);
      return;
    }
    setAllowed(false);
  }, []);

  if (allowed === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <Logo variant="chip" href={null} priority />
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-6">
        <div className="fx-vignette" />
        <div className="fx-grid" />
        <div className="relative z-10 w-full max-w-md text-center">
          <Logo variant="full" href={null} priority className="mx-auto justify-center" />
          <p className="mt-8 text-sm uppercase tracking-[0.35em] text-white/50">
            18+ only
          </p>
          <h1 className="mt-4 font-display text-3xl text-white sm:text-4xl">
            Are you of legal age?
          </h1>
          <p className="mt-4 text-sm leading-6 text-white/60">
            FortuneX is a demonstration casino for responsible-play education.
            No real money is wagered. Gambling can be harmful.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              className="fx-btn-primary"
              onClick={() => {
                localStorage.setItem(KEY, "1");
                setAllowed(true);
              }}
            >
              I am 18 or older
            </button>
            <a
              href="https://www.begambleaware.org/"
              target="_blank"
              rel="noreferrer"
              className="fx-btn-ghost"
            >
              Get help instead
            </a>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
