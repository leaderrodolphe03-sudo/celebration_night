import Link from "next/link";
import {
  Calendar,
  Clock,
  CheckCircle2,
  Ticket,
  ArrowRight,
  Users,
  Music2,
} from "lucide-react";
import Hero from "@/components/hero/Hero";
import PresentationSection from "@/components/event/PresentationSection";
import HomeGallerySection from "@/components/gallery/HomeGallerySection";
import PartnersMarquee from "@/components/partners/PartnersMarquee";
import SponsorsCtaSection from "@/components/partners/SponsorsCtaSection";
import { EVENT } from "@/lib/event-config";

const STATS = [
  { number: "6H",   label: "De louange & prière non-stop",   icon: Clock },
  { number: "25+",  label: "Chantres, musiciens & choristes", icon: Music2 },
  { number: "100%", label: "Gratuit sur inscription",         icon: CheckCircle2 },
  { number: "1",    label: "Génération embrasée pour Christ", icon: Users },
];

export default function HomePage() {
  return (
    <>
      {/* 1. Hero */}
      <Hero />

      {/* 2. Bandeau chiffres */}
      <section className="bg-[#0B0806] border-y border-white/6 px-5 py-14 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
            {STATS.map((stat, idx) => {
              const Icon = stat.icon;
              const isLast = idx === STATS.length - 1;
              return (
                <div
                  key={idx}
                  className={`flex flex-col items-center text-center py-6 px-4 rounded-lg bg-[#120E0A]/60 border border-white/5 hover:border-[#F59E0B]/30 transition-all ${
                    !isLast ? "md:border-r md:border-white/8" : ""
                  }`}
                >
                  <Icon size={18} className="text-[#F59E0B] mb-2.5 opacity-90" />
                  <span className="font-heading text-5xl sm:text-6xl leading-none text-[#F59E0B] tracking-wide">
                    {stat.number}
                  </span>
                  <p className="mt-2.5 font-body text-[11px] font-semibold uppercase tracking-[0.1em] text-[#BFB89E] leading-snug max-w-[150px]">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Présentation */}
      <PresentationSection />

      {/* 4. Galerie */}
      <HomeGallerySection />

      {/* 5. HAGIAZO Ministry */}
      <section className="relative bg-[#080808] border-t border-white/6 px-5 py-24 sm:px-8 lg:px-10 overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 right-1/4 h-96 w-96 rounded-full bg-[#F59E0B]/5 blur-[130px]"
        />
        <div className="relative mx-auto max-w-5xl">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
            {/* Texte */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-5">
                <span className="h-px w-6 bg-[#F59E0B]" />
                <span className="font-body text-[11px] font-bold uppercase tracking-[0.2em] text-[#F59E0B]">
                  Le Ministère Hôte
                </span>
              </div>
              <h2 className="font-heading text-[clamp(2.5rem,5vw,4.5rem)] uppercase leading-[0.9] tracking-wide text-white">
                HAGIAZO<br /><span className="text-[#F59E0B]">Ministry</span>
              </h2>
              <p className="mt-6 font-body text-base leading-relaxed text-[#BFB89E]">
                HAGIAZO (ἁγιάζω) porte une vision de sainteté, d&apos;adoration contemporaine
                et de communion fraternelle au service d&apos;une jeunesse en quête d&apos;authenticité spirituelle.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/notre-histoire"
                  className="group flex items-center gap-2 font-body text-sm font-semibold text-[#F59E0B] hover:text-[#FCD34D] transition-colors"
                >
                  <span>Découvrir Notre Histoire</span>
                  <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <span className="text-white/20 hidden sm:inline">·</span>
                <Link
                  href="/medias"
                  className="group flex items-center gap-2 font-body text-sm font-semibold text-white/70 hover:text-white transition-colors"
                >
                  <span>Galerie &amp; Médias</span>
                  <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Séparateur vertical */}
            <div className="hidden lg:block w-px self-stretch bg-white/8" />

            {/* Citation */}
            <div className="flex-1 lg:pt-2">
              <blockquote className="border-l-2 border-[#F59E0B] pl-6 bg-[#120E0A]/40 py-4 rounded-r-md">
                <p className="font-body text-xl sm:text-2xl italic leading-relaxed text-[#EDE8DC]">
                  « Une génération. Une foi. Une célébration. »
                </p>
                <footer className="mt-4 font-body text-sm text-[#7D7560]">
                  — HAGIAZO Ministry, Abidjan
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Partenaires */}
      <PartnersMarquee />

      {/* 7. Sponsors */}
      <SponsorsCtaSection />

      {/* 8. CTA Final */}
      <section className="relative bg-[#080808] border-t border-white/6 overflow-hidden">
        {/* Image de fond avec fort voile et photo réelle du sanctuaire */}
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/gallery/photo-10.jpg"
            alt=""
            aria-hidden
            className="w-full h-full object-cover object-center opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/80 to-[#080808]" />
        </div>


        <div className="relative px-5 py-28 sm:px-8 lg:px-10 text-center">
          <div className="mx-auto max-w-2xl">
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="h-px w-8 bg-[#F59E0B]" />
              <span className="font-body text-[11px] font-bold uppercase tracking-[0.2em] text-[#F59E0B]">
                Capacité limitée · Réservation gratuite
              </span>
              <span className="h-px w-8 bg-[#F59E0B]" />
            </div>
            <h2 className="font-heading text-[clamp(3rem,8vw,7rem)] uppercase leading-[0.9] tracking-wide text-white">
              Rejoignez la Célébration
            </h2>
            <p className="mt-6 font-body text-base text-[#BFB89E] leading-relaxed">
              Entrée 100% gratuite. Téléversez votre photo pour générer votre pass officiel avec votre code QR unique.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/inscription"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-sm bg-[#F59E0B] px-10 py-4.5 font-body text-sm font-bold uppercase tracking-[0.15em] text-[#080808] transition-all hover:bg-[#FCD34D] hover:shadow-[0_8px_40px_rgba(245,158,11,0.5)] active:scale-[0.98]"
              >
                <Ticket size={16} />
                <span>Générer mon badge &amp; réserver</span>
                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/soutenir"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-sm border border-white/15 px-8 py-4.5 font-body text-sm font-semibold uppercase tracking-wider text-white hover:border-white/30 hover:bg-white/5 transition-all"
              >
                Devenir Partenaire
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
