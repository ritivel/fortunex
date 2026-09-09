"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/", label: "Lobby" },
  { href: "/play", label: "Slots" },
  { href: "/roulette", label: "Table" },
  { href: "/account", label: "Account" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-black/90 backdrop-blur-xl md:hidden">
      <ul className="grid grid-cols-4">
        {ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block py-3 text-center text-[10px] uppercase tracking-[0.18em] ${
                  active ? "text-[var(--fx-purple-hot)]" : "text-white/50"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
