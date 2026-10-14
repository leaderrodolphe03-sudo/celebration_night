"use client";

import Image from "next/image";

export interface Partner {
  id: string;
  name: string;
  logoSrc: string;
  logoAlt: string;
  logoHeightClass?: string;
}

/**
 * Liste officielle des partenaires & ministères associés.
 * 💡 Note pour les 3 prochains partenaires :
 * Il suffira d'ajouter leur objet avec leur chemin dans /logos/partenaire/
 */
export const PARTNERS: Partner[] = [
  {
    id: "foursquare",
    name: "Foursquare Gospel Church",
    logoSrc: "/logos/partenaire/foursquare.png",
    logoAlt: "Logo officiel Église Foursquare",
    logoHeightClass: "h-11 sm:h-13 lg:h-15",
  },
  {
    id: "hagiazo-ministry",
    name: "Hagïazo Ministry",
    logoSrc: "/logos/partenaire/hagiazo-ministry.png",
    logoAlt: "Logo officiel Hagïazo Ministry",
    logoHeightClass: "h-12 sm:h-14 lg:h-16",
  },
  {
    id: "lynus",
    name: "LYNUS",
    logoSrc: "/logos/partenaire/lynus.png",
    logoAlt: "Logo officiel LYNUS",
    logoHeightClass: "h-8 sm:h-10 lg:h-11",
  },
  {
    id: "nexa",
    name: "NEXA Sound & Light",
    logoSrc: "/logos/partenaire/nexa-sound-light.png",
    logoAlt: "Logo officiel NEXA Sound & Light",
    logoHeightClass: "h-9 sm:h-11 lg:h-12",
  },
  {
    id: "chic-event",
    name: "Chic Event",
    logoSrc: "/logos/partenaire/chic-event.png",
    logoAlt: "Logo officiel Chic Event",
    logoHeightClass: "h-10 sm:h-12 lg:h-14",
  },
  {
    id: "hosle-houefa",
    name: "Hoslé Houéfa",
    logoSrc: "/logos/partenaire/hosle-houefa.png",
    logoAlt: "Logo signature Hoslé Houéfa",
    logoHeightClass: "h-9 sm:h-11 lg:h-13",
  },
];

// Pour un défilement infini fluide et continu, la séquence est dédoublée mathématiquement
const BASE_SET = [...PARTNERS, ...PARTNERS];
const MARQUEE_ITEMS = [...BASE_SET, ...BASE_SET];

export default function PartnersMarquee() {
  return (
    <section className="bg-cn-black py-12 sm:py-16 overflow-hidden relative border-y border-white/5">
      {/* Halo lumineux d'ambiance discret */}
      <div 
        aria-hidden 
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-44 w-[600px] rounded-full bg-cn-gold/5 blur-[120px]" 
      />

      {/* En-tête de section */}
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 mb-8 sm:mb-12 text-center">
        <p className="font-body text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-cn-gold">
          Ils nous accompagnent
        </p>
        <h3 className="mt-1.5 font-heading text-2xl sm:text-4xl uppercase tracking-wider text-white">
          Partenaires &amp; Ministères Associés
        </h3>
      </div>

      {/* Ruban défilant avec fondu sur les bords */}
      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex w-max items-center animate-marquee-horizontal pause-hover gap-12 sm:gap-16 lg:gap-24 py-4">
          {MARQUEE_ITEMS.map((partner, idx) => (
            <div
              key={`${partner.id}-${idx}`}
              className="flex items-center justify-center shrink-0 select-none group cursor-default transition-transform duration-300 hover:scale-105"
            >
              <Image
                src={partner.logoSrc}
                alt={partner.logoAlt}
                width={240}
                height={90}
                className={`w-auto object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-sm ${partner.logoHeightClass || "h-10 sm:h-12"}`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
