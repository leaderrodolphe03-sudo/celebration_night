import React from "react";

interface StatItem {
  number: string;
  label: string;
  sublabel: string;
  colorClass: string;
}

const STATS_DATA: StatItem[] = [
  {
    number: "6H",
    label: "De louange & prière non-stop",
    sublabel: "Une atmosphère d'adoration continue",
    colorClass: "text-cn-gold-light",
  },
  {
    number: "5+",
    label: "Chantres, musiciens & choristes",
    sublabel: "Un collectif d'excellence vocale & scénique",
    colorClass: "text-cn-gold",
  },
  {
    number: "100%",
    label: "Gratuit sur inscription",
    sublabel: "Accès libre pour toute la jeunesse",
    colorClass: "text-cn-amber",
  },
];

export default function StatsSection() {
  return (
    <section
      className="relative z-10 bg-gradient-to-b from-cn-black via-cn-dark to-cn-black py-16 sm:py-24 px-5 sm:px-8 lg:px-10"
      aria-label="Célébration Night 2026 en chiffres"
    >
      <div className="mx-auto max-w-7xl">
        {/* Titre de la section */}
        <div className="mb-12 text-center">
          <h2 className="font-heading text-4xl sm:text-6xl lg:text-7xl uppercase tracking-wider text-white">
            2026 en chiffres
          </h2>
        </div>

        {/* Grille des 3 métriques fluides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {STATS_DATA.map((item, idx) => (
            <div
              key={idx}
              className="group rounded-2xl  p-8 sm:p-10 flex flex-col justify-between text-left transition-all duration-300"
            >
              <div
                className={`font-heading text-6xl sm:text-7xl lg:text-8xl leading-none tracking-tight ${item.colorClass}`}
              >
                {item.number}
              </div>

              <div className="mt-6">
                <h3 className="font-body text-base sm:text-lg font-bold text-white leading-snug">
                  {item.label}
                </h3>
                <p className="font-body text-xs sm:text-sm text-cn-gray-300 mt-1.5 leading-relaxed">
                  {item.sublabel}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
