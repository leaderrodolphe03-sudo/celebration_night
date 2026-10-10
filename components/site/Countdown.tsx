"use client";

import { useSyncExternalStore } from "react";

// Horloge partagee : une seule minuterie, lue via useSyncExternalStore
// (pas de setState dans un effet, pas d'ecart d'hydratation).
let now = Date.now();
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | undefined;

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!timer) {
    timer = setInterval(() => {
      now = Date.now();
      listeners.forEach((l) => l());
    }, 1000);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && timer) {
      clearInterval(timer);
      timer = undefined;
    }
  };
}

const getSnapshot = () => now;
const getServerSnapshot = () => null;

export function Countdown({ target }: { target: string }) {
  const current = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const diff = current === null ? null : Math.max(0, new Date(target).getTime() - current);

  const parts = [
    { label: "Jours", value: diff === null ? null : Math.floor(diff / 86_400_000) },
    { label: "Heures", value: diff === null ? null : Math.floor(diff / 3_600_000) % 24 },
    { label: "Minutes", value: diff === null ? null : Math.floor(diff / 60_000) % 60 },
    { label: "Secondes", value: diff === null ? null : Math.floor(diff / 1000) % 60 },
  ];

  return (
    <div
      role="timer"
      aria-label="Compte à rebours avant la soirée"
      className="grid grid-cols-4 gap-2 sm:gap-3"
    >
      {parts.map((p) => (
        <div
          key={p.label}
          className="rounded-xl border border-primary/25 bg-card/70 px-2 py-3 text-center backdrop-blur sm:px-4"
        >
          <span className="block font-heading text-3xl tabular-nums leading-none text-primary sm:text-5xl">
            {p.value === null ? "--" : String(p.value).padStart(2, "0")}
          </span>
          <span className="mt-1 block text-[9px] font-semibold uppercase tracking-[0.08em] text-muted-foreground sm:text-xs sm:tracking-[0.2em]">
            {p.label}
          </span>
        </div>
      ))}
    </div>
  );
}
