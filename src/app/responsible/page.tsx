import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function ResponsiblePage() {
  return (
    <div className="relative isolate overflow-hidden">
      <div className="fx-vignette" />
      <div className="mx-auto flex min-h-[80vh] max-w-2xl flex-col items-center justify-center px-6 py-20 text-center">
        <Logo href={null} />
        <p className="mt-10 text-xs uppercase tracking-[0.4em] text-[var(--fx-purple-hot)]">
          A message from FortuneX
        </p>
        <h1 className="mt-6 font-display text-4xl leading-tight text-white sm:text-5xl">
          Gambling is not a way to make money.
        </h1>
        <p className="mt-6 text-lg leading-8 text-white/65">
          Never gamble more than you can afford to lose.
        </p>
        <div className="mt-10 h-px w-48 bg-gradient-to-r from-transparent via-[var(--fx-purple)] to-transparent" />
        <p className="mt-10 font-display text-2xl tracking-[0.18em] text-white sm:text-3xl">
          PLAY RESPONSIBLY.
        </p>
        <p className="mt-2 font-display text-xl tracking-[0.22em] text-[var(--fx-purple-hot)]">
          KNOW YOUR LIMIT.
        </p>

        <div className="mt-12 space-y-3 text-sm text-white/55">
          <p>
            If play stops being a game, stop. Talk to someone. Use the limits on
            your account.
          </p>
          <p>
            Help:{" "}
            <a
              href="https://www.begambleaware.org/"
              className="text-white underline underline-offset-4"
              target="_blank"
              rel="noreferrer"
            >
              begambleaware.org
            </a>
          </p>
        </div>

        <div className="mt-12 flex flex-col gap-3 sm:flex-row">
          <Link href="/account" className="fx-btn-primary">
            Set a limit
          </Link>
          <Link href="/" className="fx-btn-ghost">
            Back to lobby
          </Link>
        </div>
      </div>
    </div>
  );
}
