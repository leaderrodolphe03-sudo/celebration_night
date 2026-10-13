"use client";

import { Handshake, Sparkles, Building2, Radio, Tv, Music2, HeartHandshake, Mic2 } from "lucide-react";

interface Partner {
  name: string;
  category: string;
  icon: typeof Handshake;
}

const PARTNERS: Partner[] = [
  { name: "HAGIAZO RECORDS",     category: "Production Musicale",    icon: Music2 },
  { name: "GOSPEL ACTU AFRIQUE", category: "Média Officiel",         icon: Tv },
  { name: "RADIO ALLÉLUIA FM",   category: "Diffusion Nationale",    icon: Radio },
  { name: "ALLIANCE DES ÉGLISES", category: "Fédération Chrétienne", icon: Building2 },
  { name: "VOIX DE LOUANGE",     category: "Plateforme Gospel",      icon: Mic2 },
  { name: "DIVINE SOUND SYSTEM", category: "Régie Son & Lumière",    icon: Sparkles },
  { name: "FONDATION ESPÉRANCE", category: "Partenaire Social",      icon: HeartHandshake },
  { name: "ABIDJAN WORSHIP HUB", category: "Communauté de Chantres", icon: Handshake },
];

export default function PartnersMarquee() {
  return (
    <section className="bg-cn-black py-16 overflow-hidden">
      {/* En-tête */}
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 mb-10 text-center">
        <p className="font-body text-[10px] font-bold uppercase tracking-[0.25em] text-cn-gold">
          Ils nous accompagnent
        </p>
        <h3 className="mt-1.5 font-heading text-2xl sm:text-4xl uppercase tracking-wider text-white">
          Partenaires &amp; Ministères Associés
        </h3>
      </div>

      {/* Ruban défilant */}
      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex w-max animate-marquee-horizontal pause-hover gap-4">
          {[...PARTNERS, ...PARTNERS].map((partner, idx) => {
            const Icon = partner.icon;
            return (
              <div
                key={idx}
                className="group flex items-center gap-3.5 rounded-xl border border-white/10 bg-cn-dark px-6 py-4 transition-all hover:border-cn-gold/40 hover:bg-cn-deep hover:shadow-gold shrink-0 cursor-default"
              >
                <div className="h-9 w-9 rounded-lg bg-cn-deep border border-white/10 flex items-center justify-center shrink-0 group-hover:border-cn-gold/50 transition-colors">
                  <Icon size={16} className="text-cn-gold group-hover:text-cn-gold-light transition-colors" />
                </div>
                <div>
                  <p className="font-heading text-base uppercase tracking-wider text-white leading-tight group-hover:text-cn-gold-light transition-colors">
                    {partner.name}
                  </p>
                  <span className="font-body text-xs text-cn-gray-400 tracking-wide font-medium">
                    {partner.category}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
