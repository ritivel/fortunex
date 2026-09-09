import Link from "next/link";
import { Logo } from "@/components/Logo";

export function Footer() {
  return (
    <footer className="border-t border-white/8 bg-black">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-6 text-white/45">
            FortuneX is a demonstration casino built for a responsible-gambling
            film. No real money, no payouts, no accounts that can cash out.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 text-sm">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-white/35">Play</p>
            <ul className="mt-3 space-y-2 text-white/60">
              <li>
                <Link href="/play" className="hover:text-white">
                  Neon Slots
                </Link>
              </li>
              <li>
                <Link href="/roulette" className="hover:text-white">
                  Roulette
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-white">
                  Account
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-white/35">
              Safer play
            </p>
            <ul className="mt-3 space-y-2 text-white/60">
              <li>
                <Link href="/responsible" className="hover:text-white">
                  Play responsibly
                </Link>
              </li>
              <li>
                <a
                  href="https://www.begambleaware.org/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white"
                >
                  BeGambleAware
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-white/8">
        <p className="mx-auto max-w-6xl px-4 py-5 text-center text-[11px] uppercase tracking-[0.28em] text-white/40 sm:px-6">
          18+ · Gambling is not a way to make money · Play responsibly. Know your
          limit.
        </p>
      </div>
    </footer>
  );
}
