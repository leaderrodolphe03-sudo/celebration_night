import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  Clock,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Flame,
  Ticket,
} from "lucide-react";
import Countdown from "./Countdown";
import HeroScrollCards from "./HeroScrollCards";
import { EVENT } from "@/lib/event-config";

export default function Hero() {
  return (
    <section className="relative min-h-[95vh] flex items-center overflow-hidden px-4 pb-16 pt-24 sm:px-6 md:pb-24 md:pt-28 lg:px-8">
      {/* 1. PHOTOGRAPHIE D'AMBIANCE DU LIEU & ÉGLISE EN ARRIÈRE-PLAN */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero/hero-backdrop.jpg"
          alt="Célébration Night — Scène d'adoration et ferveur spirituelle"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-105 transition-transform duration-1000"
        />

        {/* Voiles de dégradé cinématiques légers : image mise en valeur avec lisibilité préservée à gauche */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0304] via-transparent to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0304]/90 via-[#0A0304]/50 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_35%,rgba(229,37,42,0.18)_0%,transparent_65%)]" />
      </div>


      {/* 3. Lueur de braise sacrée au centre-haut */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#E5252A]/25 blur-[150px] z-[1]"
      />

      {/* 4. GRILLE PRINCIPALE (TEXTE À GAUCHE / CARTES DÉFILANTES À DROITE) */}
      <div className="relative z-10 mx-auto max-w-7xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* COLONNE GAUCHE : IDENTITÉ, TITRE, DÉTAILS & ACTIONS */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
            {/* Badge supérieur inspiré de CU Chapel */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E5252A]/50 bg-[#1A0508]/85 px-4 py-1.5 shadow-[0_0_25px_rgba(229,37,42,0.3)] backdrop-blur-md">
              <Flame size={15} className="text-[#E5252A] animate-pulse" />
              <span className="font-body text-xs font-extrabold uppercase tracking-[0.25em] text-[#FFD84A]">
                {EVENT.organizer} présente
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#F5B900]" />
              <span className="font-body text-[10px] font-bold uppercase tracking-widest text-[#E5E5EA]">
                Édition 2026
              </span>
            </div>

            {/* Titre Principal Majestueux et Flamboyant */}
            <div className="space-y-2">
              <h1 className="font-heading text-5xl uppercase tracking-wider text-white sm:text-7xl md:text-8xl xl:text-9xl drop-shadow-[0_8px_32px_rgba(0,0,0,0.9)] leading-none">
                CÉLÉBRATION{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD84A] via-[#F5B900] to-[#E5252A]">
                  NIGHT
                </span>
              </h1>

              <p className="font-body text-base font-semibold text-[#F5ECEC] sm:text-xl md:text-2xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                « {EVENT.tagline} »
              </p>
            </div>

            {/* Coordonnées de l'événement (Date, Heure, Lieu) */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-5 rounded-2xl border border-white/20 bg-[#140507]/80 px-5 py-3.5 backdrop-blur-md shadow-2xl font-body text-xs sm:text-sm text-[#E5E5EA]">
              <span className="inline-flex items-center gap-2">
                <CalendarDays size={16} className="text-[#F5B900]" />
                <strong className="text-white">{EVENT.dateLabel}</strong>
              </span>
              <span className="hidden sm:inline text-white/30">•</span>
              <span className="inline-flex items-center gap-2">
                <Clock size={16} className="text-[#F5B900]" />
                <strong className="text-white">{EVENT.timeLabel}</strong>
              </span>
              <span className="hidden sm:inline text-white/30">•</span>
              <span className="inline-flex items-center gap-2">
                <MapPin size={16} className="text-[#E5252A]" />
                <span className="text-white font-medium">Palais des Congrès (Abidjan)</span>
              </span>
            </div>

            {/* Compte à rebours dynamique stylisé */}
            <div className="w-full max-w-md pt-1">
              <Countdown targetDate={EVENT.date} />
            </div>

            {/* Boutons d'Action Principaux */}
            <div className="flex w-full max-w-md flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/inscription"
                className="w-full sm:w-auto min-w-[210px] flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#B71C1C] via-[#E5252A] to-[#F5B900] bg-[length:200%_auto] hover:bg-right px-8 py-4 font-body text-xs font-extrabold uppercase tracking-widest text-white shadow-[0_8px_30px_rgba(229,37,42,0.5)] transition-all duration-300 hover:scale-105 hover:shadow-[0_12px_40px_rgba(229,37,42,0.7)]"
              >
                <Ticket size={17} />
                <span>Réserver ma place</span>
                <ArrowRight size={16} />
              </Link>

              <Link
                href="/notre-histoire"
                className="w-full sm:w-auto min-w-[170px] flex items-center justify-center gap-2 rounded-lg border border-white/30 bg-white/5 px-6 py-4 font-body text-xs font-semibold uppercase tracking-widest text-white backdrop-blur-sm transition-all hover:border-[#F5B900] hover:text-[#F5B900] hover:bg-white/10"
              >
                <span>Notre Histoire</span>
              </Link>
            </div>

            {/* Mention de réassurance sur le QR Code */}
            <div className="pt-1 flex items-center justify-center lg:justify-start gap-2 font-body text-xs text-[#E5E5EA]">
              <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
              <span>Billet numérique gratuit avec QR Code sécurisé infalsifiable</span>
            </div>
          </div>

          {/* COLONNE DROITE : CARTES PHOTOS INCLINÉES ET DÉFILANTES */}
          <div className="lg:col-span-5 w-full flex items-center justify-center">
            <HeroScrollCards />
          </div>
        </div>
      </div>
    </section>
  );
}
