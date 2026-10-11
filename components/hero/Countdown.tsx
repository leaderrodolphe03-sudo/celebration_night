"use client";

import { useEffect, useState } from "react";

function getTimeLeft(target: Date) {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    jours:    Math.floor(diff / (1000 * 60 * 60 * 24)),
    heures:   Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes:  Math.floor((diff / (1000 * 60)) % 60),
    secondes: Math.floor((diff / 1000) % 60),
  };
}

export default function Countdown({
  targetDate,
  variant = "default",
}: {
  targetDate: string;
  variant?: "default" | "compact";
}) {
  const target = new Date(targetDate);
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState(() => getTimeLeft(target));

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setTime(getTimeLeft(target)), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const units: Array<[string, number]> = [
    ["Jours",   mounted ? time.jours    : 0],
    ["Heures",  mounted ? time.heures   : 0],
    ["Min",     mounted ? time.minutes  : 0],
    ["Sec",     mounted ? time.secondes : 0],
  ];

  if (variant === "compact") {
    return (
      <div
        role="timer"
        aria-label="Compte à rebours avant Célébration Night"
        className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-black/65 px-4 py-1.5 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.6)] select-none"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#F59E0B] opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#F59E0B]" />
        </span>
        <div className="flex items-center gap-1.5 font-body text-xs font-semibold tracking-wider text-white">
          <span className="font-bold text-[#FCD34D]">{String(units[0][1]).padStart(2, "0")}j</span>
          <span className="text-white/35">:</span>
          <span className="font-bold text-[#FCD34D]">{String(units[1][1]).padStart(2, "0")}h</span>
          <span className="text-white/35">:</span>
          <span className="font-bold text-[#FCD34D]">{String(units[2][1]).padStart(2, "0")}m</span>
          <span className="text-white/35">:</span>
          <span className="font-bold text-[#FCD34D]">{String(units[3][1]).padStart(2, "0")}s</span>
        </div>
      </div>
    );
  }

  return (
    <div
      role="timer"
      aria-label="Compte à rebours avant Célébration Night"
      className="grid grid-cols-4 gap-2 max-w-xs"
    >
      {units.map(([label, value]) => (
        <div key={label} className="text-center">
          {/* Valeur numérique */}
          <div className="rounded-sm bg-[#1A1108] border border-[#F59E0B]/20 py-3 px-1">
            <span className="block font-heading text-3xl sm:text-4xl leading-none text-[#F59E0B]">
              {String(value).padStart(2, "0")}
            </span>
          </div>
          {/* Label */}
          <span className="mt-1.5 block font-body text-[9px] font-bold uppercase tracking-[0.15em] text-[#7D7560]">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
