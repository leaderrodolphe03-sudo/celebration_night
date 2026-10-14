import Link from "next/link";
import Image from "next/image";

import Hero from "@/components/hero/Hero";
import StatsSection from "@/components/home/StatsSection";
import PresentationSection from "@/components/event/PresentationSection";
import HomeGallerySection from "@/components/gallery/HomeGallerySection";
import PartnersMarquee from "@/components/partners/PartnersMarquee";
import SponsorsCtaSection from "@/components/partners/SponsorsCtaSection";
import { EVENT } from "@/lib/event-config";
import Button from "@/components/ui/Button";

export default function HomePage() {
  return (
    <>
      {/* 1. Hero */}
      <Hero />

      {/* 2. 2026 en chiffres (Section style Effuzion avec nos 3 statistiques) */}
      <StatsSection />

      {/* 3. Présentation */}
      <PresentationSection />

      {/* 4. Galerie */}
      <HomeGallerySection />

      {/* 5. Ministère Hôte — HAGIAZO Ministry (Dégradé jaune éclatant & authentique) */}
      <section className="relative bg-gradient-to-br from-[#FCD34D] via-[#F59E0B] to-[#D97706] text-cn-black px-5 py-24 sm:px-8 lg:px-10 overflow-hidden selection:bg-cn-black selection:text-white">
        {/* Lueur et reflets subtils */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 right-1/4 h-96 w-96 rounded-full bg-white/20 blur-[120px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 left-1/4 h-96 w-96 rounded-full bg-amber-900/10 blur-[120px]"
        />

        <div className="relative mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-center justify-between">
            {/* Texte à gauche */}
            <div className="w-full lg:w-5/12 lg:max-w-lg shrink-0">
              <h2 className="font-heading text-4xl sm:text-6xl lg:text-7xl uppercase leading-[0.92] tracking-wide text-cn-black">
                HAGIAZO<br />
                <span className="text-[#6D2800] drop-shadow-sm">Ministry</span>
              </h2>

              <p className="mt-6 font-body text-base sm:text-lg leading-relaxed text-[#2B1B10] font-medium">
                HAGIAZO (ἁγιάζω) porte une vision de sainteté, d&apos;adoration contemporaine
                et de communion fraternelle au service d&apos;une jeunesse en quête d&apos;authenticité spirituelle.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button
                  href="/notre-histoire"
                  variant="dark"
                  size="md"
                >
                  Découvrir Notre Histoire
                </Button>
                <Button
                  href="/medias"
                  variant="outline-dark"
                  size="md"
                >
                  Galerie &amp; Médias
                </Button>
              </div>
            </div>

            {/* Image du groupe HAGIAZO à droite — plein format panoramique 1080x578 sans rognage */}
            <div className="w-full lg:w-7/12 flex justify-center lg:justify-end">
              <div className="w-full max-w-3xl group relative overflow-hidden rounded-2xl sm:rounded-3xl border-2 border-black/15 shadow-[0_20px_50px_rgba(28,22,19,0.25)] transition-all duration-300 hover:shadow-[0_25px_60px_rgba(28,22,19,0.35)] bg-black/10">
                <Image
                  src="/images/gallery/visuel_hote.jpg"
                  alt="Le collectif vocal et musical HAGIAZO en ferveur lors de CÉLÉBRATION Night"
                  width={1080}
                  height={578}
                  priority
                  className="w-full h-auto block rounded-2xl sm:rounded-3xl transition-transform duration-700 group-hover:scale-[1.01]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Partenaires */}
      <PartnersMarquee />

      {/* 7. Sponsors */}
      <SponsorsCtaSection />

      {/* 8. CTA Final */}
      <section className="relative bg-cn-black overflow-hidden">
        {/* Image de fond avec fort voile et photo réelle du sanctuaire */}
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/gallery/photo-10.jpg"
            alt=""
            aria-hidden
            className="w-full h-full object-cover object-center opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cn-black via-cn-black/85 to-cn-black" />
        </div>

        <div className="relative px-5 py-28 sm:px-8 lg:px-10 text-center">
          <div className="mx-auto max-w-2xl">
            <div className="flex items-center justify-center gap-3 mb-6">
              
              <span className="font-body text-[11px] font-bold uppercase tracking-[0.2em] text-cn-gold">
                Capacité limitée · Réservation gratuite
              </span>
              
            </div>
            <h2 className="font-heading text-5xl sm:text-7xl lg:text-8xl uppercase leading-[0.9] tracking-wide text-white">
              Rejoignez la CELEBRATION
            </h2>
            <p className="mt-6 font-body text-base text-cn-gray-300 leading-relaxed">
              Entrée 100% gratuite. Téléversez votre photo pour générer votre pass officiel avec votre code QR unique.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                href="/inscription"
                size="lg"
                variant="primary"
                className="w-full sm:w-auto px-10 py-4.5"
              >
                
                <span>Générer mon badge</span>
                
              </Button>
              <Button
                href="/soutenir"
                size="lg"
                variant="outline"
                className="w-full sm:w-auto px-8 py-4.5"
              >
                Devenir Partenaire
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
