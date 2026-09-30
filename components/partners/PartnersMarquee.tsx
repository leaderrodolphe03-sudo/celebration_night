"use client";

import { Handshake, Sparkles, Building2, Radio, Tv, Music2, HeartHandshake, Mic2 } from "lucide-react";
import Link from "next/link";

interface Partner {
  name: string;
  category: string;
  icon: typeof Handshake;
}

const PARTNERS: Partner[] = [
  { name: "HAGIAZO RECORDS", category: "Production Musicale", icon: Music2 },
  { name: "GOSPEL ACTU AFRIQUE", category: "Média Officiel", icon: Tv },
  { name: "RADIO ALLÉLUIA FM", category: "Diffusion Nationale", icon: Radio },
  { name: "ALLIANCE DES ÉGLISES", category: "Fédération Chrétienne", icon: Building2 },
  { name: "VOIX DE LOUANGE", category: "Plateforme Gospel", icon: Mic2 },
  { name: "DIVINE SOUND SYSTEM", category: "Régie Son & Lumière", icon: Sparkles },
  { name: "FONDATION ESPÉRANCE", category: "Partenaire Social", icon: HeartHandshake },
  { name: "ABIDJAN WORSHIP HUB", category: "Communauté de Chantres", icon: Handshake },
];

export default function PartnersMarquee() {
  return (
    <section className="relative bg-[#0A0304] py-14 border-t border-b border-[#E5252A]/20 overflow-hidden">
      {/* Halo subtil */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0A0304] via-transparent to-[#0A0304] z-10"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-8 text-center">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#FFD84A] block">
          Ils Croient en la Vision
        </span>
        <h3 className="mt-1 font-heading text-2xl sm:text-3xl uppercase tracking-wider text-white">
          Nos Partenaires & Ministères Associés
        </h3>
      </div>

      {/* RUBAN MARQUEE DÉFILANT CONTINU (Style Effuzion.org) */}
      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex w-max animate-marquee-horizontal pause-hover gap-6 py-2">
          {/* Liste 1 */}
          {PARTNERS.map((partner, idx) => {
            const Icon = partner.icon;
            return (
              <div
                key={`p1-${idx}`}
                className="group flex items-center gap-3.5 rounded-xl border border-white/10 bg-[#140507]/90 px-6 py-3.5 backdrop-blur-sm transition-all hover:border-[#F5B900] hover:bg-[#24080C] shrink-0 shadow-md"
              >
                <div className="h-9 w-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#FFD84A] group-hover:scale-110 transition-transform">
                  <Icon size={18} />
                </div>
                <div className="text-left">
                  <p className="font-heading text-base uppercase tracking-wider text-white group-hover:text-[#FFD84A] transition-colors leading-tight">
                    {partner.name}
                  </p>
                  <span className="font-body text-[10px] uppercase font-semibold text-cn-gray-400 tracking-wider">
                    {partner.category}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Liste 2 (Duplication pour boucle infinie transparente) */}
          {PARTNERS.map((partner, idx) => {
            const Icon = partner.icon;
            return (
              <div
                key={`p2-${idx}`}
                className="group flex items-center gap-3.5 rounded-xl border border-white/10 bg-[#140507]/90 px-6 py-3.5 backdrop-blur-sm transition-all hover:border-[#F5B900] hover:bg-[#24080C] shrink-0 shadow-md"
              >
                <div className="h-9 w-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#FFD84A] group-hover:scale-110 transition-transform">
                  <Icon size={18} />
                </div>
                <div className="text-left">
                  <p className="font-heading text-base uppercase tracking-wider text-white group-hover:text-[#FFD84A] transition-colors leading-tight">
                    {partner.name}
                  </p>
                  <span className="font-body text-[10px] uppercase font-semibold text-cn-gray-400 tracking-wider">
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
