import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  Clock,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Ticket,
} from "lucide-react";
import Countdown from "./Countdown";
import HeroScrollCards from "./HeroScrollCards";
import { EVENT } from "@/lib/event-config";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-between overflow-hidden isolate bg-[#080808]">

      {/* ── 1. FOND CINÉMATIQUE (Photo authentique + Dégradé tricolore + Grain argentique) ── */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-cinematic-bg.jpg"
          alt="Célébration Night — Sanctuaire et ambiance cinématique"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
          quality={95}
        />
        {/* Voile cinématographique subtil pour faire ressortir les textes tout en préservant l'éclat lumineux du dégradé */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/15 via-transparent to-[#080808]/35 pointer-events-none" />
      </div>

      {/* ── 2. COMPTE À REBOURS COMPACT EN HAUT À DROITE (Masqué sur mobile) ── */}
      <div className="absolute top-24 right-5 sm:right-8 lg:right-12 z-20 hidden md:block animate-fade-in">
        <Countdown targetDate={EVENT.date} variant="compact" />
      </div>

      {/* ── 3. CONTENU MONUMENTAL CENTRÉ ── */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center text-center px-4 pt-28 pb-20 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">

        {/* Logo officiel réduit en haut au centre */}
        <div className="relative w-36 sm:w-44 md:w-52 mb-3 select-none transition-transform hover:scale-105 duration-300">
          <Image
            src="/logos/celebration-night-logo.png"
            alt="Célébration Night — Emblème officiel"
            width={1016}
            height={467}
            priority
            className="w-full h-auto object-contain drop-shadow-[0_8px_25px_rgba(245,158,11,0.45)]"
          />
        </div>

        {/* Grand Titre en une seule ligne */}
        <div className="w-full mb-3">
          <h1 className="font-heading uppercase tracking-wide text-white drop-shadow-[0_8px_35px_rgba(0,0,0,0.95)] text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[6.5rem] leading-none whitespace-nowrap overflow-hidden text-ellipsis">
            <span className="text-white">CÉLÉBRATION </span>
            <span className="text-[#F59E0B]">NIGHT</span>
          </h1>
        </div>

        {/* Slogan */}
        <p className="font-body text-sm sm:text-base md:text-lg text-[#EDE8DC] max-w-xl mx-auto leading-relaxed mb-6 font-medium drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
          « {EVENT.tagline} »
        </p>

        {/* Carrousel 3D d'images qui défile centré */}
        <div className="w-full max-w-xl mx-auto mb-6">
          <HeroScrollCards />
        </div>

        {/* Infos événement (date, heure, lieu) */}
        <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-5 font-body text-xs sm:text-sm text-[#EDE8DC]/90 mb-6 drop-shadow-sm">
          <span className="flex items-center gap-1.5">
            <CalendarDays size={14} className="text-[#F59E0B]" />
            <span className="font-semibold text-white">{EVENT.dateLabel}</span>
          </span>
          <span className="text-white/30 hidden sm:inline">•</span>
          <span className="flex items-center gap-1.5">
            <Clock size={14} className="text-[#F59E0B]" />
            <span className="font-semibold text-white">{EVENT.timeLabel}</span>
          </span>
          <span className="text-white/30 hidden sm:inline">•</span>
          <span className="flex items-center gap-1.5">
            <MapPin size={14} className="text-[#F59E0B]" />
            <span>Palais des Congrès, Abidjan</span>
          </span>
        </div>

        {/* Bouton d'action unique : Réserver ma place */}
        <div className="flex flex-col items-center gap-3">
          <Link
            href="/inscription"
            className="group flex items-center justify-center gap-2 rounded-full bg-[#F59E0B] px-8 sm:px-10 py-4 font-body text-xs sm:text-sm font-bold uppercase tracking-[0.18em] text-[#080808] transition-all hover:bg-[#FCD34D] hover:shadow-[0_8px_35px_rgba(245,158,11,0.65)] hover:scale-105 active:scale-[0.98] shadow-[0_4px_25px_rgba(245,158,11,0.4)] cursor-pointer"
          >
            <Ticket size={16} />
            <span>Réserver ma place</span>
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="flex items-center gap-1.5 font-body text-[11px] text-[#EDE8DC]/70">
            <ShieldCheck size={13} className="text-emerald-400 shrink-0" />
            Entrée gratuite · Billet numérique avec QR Code sécurisé
          </p>
        </div>
      </div>

      {/* ── 6. FLAMME SACRÉE ANCRÉE AU BORD INFÉRIEUR ── */}
      <div
        aria-hidden
        className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20 pointer-events-none select-none translate-y-2 drop-shadow-[0_0_25px_rgba(245,158,11,0.7)]"
      >
        <Image
          src="/images/flame-bottom.png"
          alt="Flamme Sacrée Célébration Night"
          width={164}
          height={177}
          priority
          className="w-16 sm:w-20 md:w-24 h-auto object-contain animate-pulse"
        />
      </div>

    </section>
  );
}
