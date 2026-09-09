import { SlotMachine } from "@/components/SlotMachine";

export default function PlayPage() {
  return (
    <div className="relative isolate overflow-hidden px-4 py-10 sm:px-6 sm:py-16">
      <div className="fx-grid" />
      <div className="fx-vignette" />
      <div className="relative z-10 mx-auto max-w-6xl">
        <p className="text-center text-xs uppercase tracking-[0.4em] text-[var(--fx-purple-hot)]">
          FortuneX
        </p>
        <h1 className="mt-3 text-center font-display text-4xl text-white sm:text-5xl">
          Neon Slots
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-center text-sm text-white/50">
          Late-night play. Demo credits only. The balance in the corner is the
          shot.
        </p>
        <div className="mt-10">
          <SlotMachine />
        </div>
      </div>
    </div>
  );
}
