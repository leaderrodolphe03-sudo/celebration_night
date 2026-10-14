import Image from "next/image";
import {
  CalendarDays,
  Clock,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import HeroPhotoGallery from "./HeroPhotoGallery";
import Button from "@/components/ui/Button";
import { EVENT } from "@/lib/event-config";

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] sm:min-h-screen flex flex-col justify-between overflow-hidden isolate bg-hero-warm">

      {/* ── 1. FOND CINÉMATIQUE (Photo authentique + Dégradé chaud + Grain) ── */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-cinematic-bg.jpg"
          alt="CELEBRATION Night — Sanctuaire et ambiance cinématique"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-90"
          quality={95}
        />
        {/* Voile cinématographique chaud pour unifier avec la palette non-sombre */}
        <div className="absolute inset-0 bg-gradient-to-b from-cn-black/40 via-cn-black/20 to-cn-black/70 pointer-events-none" />
      </div>

      {/* ── 2. CONTENU MONUMENTAL CENTRÉ ── */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center text-center px-4 pt-28 pb-24 sm:pb-28 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">

        {/* Logo officiel monumental au centre */}
        <div className="relative w-[240px] sm:w-[320px] md:w-[420px] lg:w-[480px] max-w-[85vw] mb-4 select-none transition-transform hover:scale-[1.01] duration-300">
          <Image
            src="/logos/celebration-night-logo-3d.png"
            alt="CELEBRATION Night — Emblème officiel"
            width={1402}
            height={1122}
            priority
            className="w-full h-auto object-contain drop-shadow-[0_16px_50px_rgba(245,158,11,0.45)]"
          />
        </div>

        {/* Titre sémantique pour lecteurs d'écran */}
        <h1 className="sr-only">CELEBRATION NIGHT — HAGIAZO Ministry</h1>

        {/* Slogan */}
        <p className="font-body text-sm sm:text-base md:text-lg text-cn-gray-100 max-w-xl mx-auto leading-relaxed mb-6 font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
          « {EVENT.tagline} »
        </p>

        {/* Galerie interactive d'images épurée */}
        <div className="w-full max-w-4xl mx-auto mb-6">
          <HeroPhotoGallery />
        </div>

        {/* Infos événement (date, heure, lieu) */}
        <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-5 font-body text-xs sm:text-sm text-cn-gray-100 mb-6 drop-shadow-sm">
          <span className="flex items-center gap-1.5">
            <CalendarDays size={14} className="text-cn-gold" />
            <span className="font-semibold text-white">{EVENT.dateLabel}</span>
          </span>
          <span className="text-white/30 hidden sm:inline">•</span>
          <span className="flex items-center gap-1.5">
            <Clock size={14} className="text-cn-gold" />
            <span className="font-semibold text-white">{EVENT.timeLabel}</span>
          </span>
          <span className="text-white/30 hidden sm:inline">•</span>
          <span className="flex items-center gap-1.5">
            <MapPin size={14} className="text-cn-gold" />
            <span>Temple des Leaders FOURSQUARE Sikècodji</span>
          </span>
        </div>

        {/* Bouton d'action unique unifié */}
        <div className="flex flex-col items-center gap-3">
          <Button
            href="/inscription"
            size="lg"
            variant="primary"
            className="rounded-full px-8 sm:px-10 py-4 shadow-gold hover:shadow-gold-strong"
          >
            Réserver ma place
          </Button>
        </div>
      </div>

      {/* ── 3. FLAMME ANCRÉE AU BORD INFÉRIEUR AVEC MARGE DE SÉCURITÉ ── */}
      <div
        aria-hidden
        className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20 pointer-events-none select-none translate-y-2 drop-shadow-[0_0_20px_rgba(245,158,11,0.6)]"
      >
        <Image
          src="/images/flame-bottom.png"
          alt="Flamme Sacrée CELEBRATION Night"
          width={164}
          height={177}
          priority
          className="w-14 sm:w-18 md:w-22 h-auto object-contain animate-pulse"
        />
      </div>

    </section>
  );
}
