import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  ArrowRight,
  Flame,
  CheckCircle2,
  Ticket,
} from "lucide-react";
import Hero from "@/components/hero/Hero";
import PresentationSection from "@/components/event/PresentationSection";
import HomeGallerySection from "@/components/gallery/HomeGallerySection";
import PartnersMarquee from "@/components/partners/PartnersMarquee";
import SponsorsCtaSection from "@/components/partners/SponsorsCtaSection";
import { EVENT } from "@/lib/event-config";

const STATS = [
  { number: "6H", label: "De louange & prière non-stop" },
  { number: "25+", label: "Chantres, musiciens & choristes" },
  { number: "100%", label: "Gratuit sur inscription" },
  { number: "1", label: "Génération embrasée pour Christ" },
];

export default function HomePage() {
  return (
    <>
      {/* 1. Hero Principal avec Cartes Marquee Immersives */}
      <Hero />

      {/* 2. Bandeau Chiffres Clés */}
      <section className="border-y border-[#E5252A]/20 bg-[#140507]/90 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map((stat, idx) => (
            <div key={idx} className="space-y-1">
              <span className="font-heading text-4xl sm:text-5xl text-[#FFD84A] tracking-wider drop-shadow-[0_2px_10px_rgba(245,185,0,0.3)]">
                {stat.number}
              </span>
              <p className="font-body text-xs text-cn-gray-300 uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Section Présentation de l'Événement & Mission */}
      <PresentationSection />

      {/* 4. NOUVELLE SECTION GALERIE (Remplace le chronogramme & artistes) */}
      {/* Titre à gauche "ILS ÉTAIENT À LA CÉLÉBRATION NIGHT" + Bouton à droite "Voir la galerie" + 10 photos en 2 lignes */}
      <HomeGallerySection />

      {/* 5. Section HAGIAZO Ministry (Vision & Mandat Spirituel) */}
      <section className="bg-gradient-to-b from-[#0A0304] to-[#1A0508] border-t border-white/10 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#E5252A]">
            Le Ministère Hôte
          </span>
          <h2 className="mt-2 font-heading text-3xl sm:text-5xl uppercase tracking-wide text-white">
            HAGIAZO Ministry
          </h2>
          <p className="mx-auto mt-4 max-w-2xl font-body text-base leading-relaxed text-cn-gray-300">
            HAGIAZO (ἁγιάζω) porte une vision de sainteté, d&apos;adoration contemporaine et de communion
            fraternelle au service d&apos;une jeunesse en quête d&apos;authenticité spirituelle.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/notre-histoire"
              className="rounded-md border border-[#E5252A] px-7 py-3.5 font-body text-xs font-bold uppercase tracking-widest text-[#FFD84A] hover:bg-[#E5252A] hover:text-white transition-colors"
            >
              Découvrir Notre Histoire & Vision
            </Link>
            <Link
              href="/worship-session"
              className="rounded-md border border-white/20 px-7 py-3.5 font-body text-xs font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-colors"
            >
              Écouter les Worship Sessions
            </Link>
          </div>
        </div>
      </section>

      {/* 6. SECTION PARTENAIRES (Marquee continu style effuzion.org) */}
      <PartnersMarquee />

      {/* 7. SECTION APPEL AUX PARTENAIRES & SPONSORS */}
      <SponsorsCtaSection />

      {/* 8. Grand Appel à l'Action (CTA Billeterie & Badge Carré) */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 bg-[#0A0304]">
        <div className="mx-auto max-w-5xl rounded-3xl border-2 border-[#E5252A]/50 bg-gradient-to-r from-[#24080C] via-[#140507] to-[#0A0304] p-8 sm:p-14 text-center shadow-[0_20px_60px_rgba(229,37,42,0.25)]">
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#FFD84A]">
            Capacité limitée • Réservation obligatoire & Gratuite
          </span>
          <h2 className="mt-3 font-heading text-4xl sm:text-6xl uppercase tracking-wide text-white">
            Rejoignez la Célébration
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-body text-sm sm:text-base text-cn-gray-300">
            Entrée 100% gratuite. Téléversez votre photo pour générer votre pass carré officiel « J&apos;y serai » avec votre code QR unique.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/inscription"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-[#B71C1C] via-[#E5252A] to-[#F5B900] bg-[length:200%_auto] hover:bg-right px-10 py-4 font-body text-xs font-extrabold uppercase tracking-widest text-white hover:opacity-95 shadow-2xl transition-all hover:scale-105"
            >
              <Ticket size={16} />
              <span>Générer mon badge & réserver ma place</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/soutenir"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md border border-white/20 bg-white/5 px-8 py-4 font-body text-xs font-semibold uppercase tracking-wider text-white hover:bg-white/10 transition-colors"
            >
              Devenir Partenaire
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
