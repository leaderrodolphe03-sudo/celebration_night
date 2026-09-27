"use client";

import { useEffect, useState } from "react";

function getTimeLeft(target: Date) {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    jours: Math.floor(diff / (1000 * 60 * 60 * 24)),
    heures: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    secondes: Math.floor((diff / 1000) % 60),
  };
}

export default function Countdown({ targetDate }: { targetDate: string }) {
  const target = new Date(targetDate);
  const [time, setTime] = useState(() => getTimeLeft(target));

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft(target)), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetDate]);

  const units: Array<[string, number]> = [
    ["Jours", time.jours],
    ["Heures", time.heures],
    ["Min", time.minutes],
    ["Sec", time.secondes],
  ];

  return (
    <div
      className="grid w-full max-w-sm grid-cols-4 gap-2 rounded-md bg-white/5 p-2 backdrop-blur-md"
      role="timer"
      aria-label="Compte à rebours avant Célébration Night"
    >
      {units.map(([label, value]) => (
        <div
          key={label}
          className="flex flex-col items-center justify-center rounded-sm bg-white/5 py-2"
        >
          <span className="font-heading text-2xl leading-none text-cn-gold">
            {String(value).padStart(2, "0")}
          </span>
          <span className="mt-1 font-body text-[10px] uppercase tracking-wider text-cn-gray-300">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
