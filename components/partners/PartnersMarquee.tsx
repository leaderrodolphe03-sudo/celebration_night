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
    <section className="bg-[#17110E] border-t border-white/6 py-18 overflow-hidden">
      {/* En-tête */}
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 mb-10 flex items-center gap-6">
        <span className="h-px flex-1 bg-white/8" />
        <div className="text-center">
          <p className="font-body text-[10px] font-bold uppercase tracking-[0.25em] text-[#F59E0B]">
            Ils nous accompagnent
          </p>
          <h3 className="mt-1.5 font-heading text-xl sm:text-3xl uppercase tracking-wider text-white">
            Partenaires &amp; Ministères Associés
          </h3>
        </div>
        <span className="h-px flex-1 bg-white/8" />
      </div>

      {/* Ruban défilant */}
      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex w-max animate-marquee-horizontal pause-hover gap-4">
          {[...PARTNERS, ...PARTNERS].map((partner, idx) => {
            const Icon = partner.icon;
            return (
              <div
                key={idx}
                className="group flex items-center gap-3.5 rounded-md border border-white/8 bg-[#120E0A] px-6 py-3.5 transition-all hover:border-[#F59E0B]/40 hover:bg-[#1A1410] hover:shadow-[0_4px_20px_rgba(245,158,11,0.15)] shrink-0 cursor-default"
              >
                <div className="h-8 w-8 rounded-full bg-[#1A1410] border border-white/10 flex items-center justify-center shrink-0 group-hover:border-[#F59E0B]/50 transition-colors">
                  <Icon size={15} className="text-[#F59E0B] group-hover:text-[#FCD34D] transition-colors" />
                </div>
                <div>
                  <p className="font-heading text-base uppercase tracking-wider text-white leading-tight group-hover:text-[#FCD34D] transition-colors">
                    {partner.name}
                  </p>
                  <span className="font-body text-[10.5px] text-[#7D7560] tracking-wide">
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
