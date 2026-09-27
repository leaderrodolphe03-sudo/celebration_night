import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Clock, MapPin, QrCode, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import Countdown from "./Countdown";
import { EVENT } from "@/lib/event-config";

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden px-4 pb-20 pt-24 sm:px-6 md:pb-28 md:pt-32 lg:px-8">
      {/* 1. Photographie d'ambiance réelle en arrière-plan */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg.jpg"
          alt="Célébration Night — Louange et adoration chrétienne contemporaine"
          fill
          priority
          className="object-cover object-center scale-105 transition-transform duration-1000"
        />
        {/* Voiles de dégradé cinématiques pour sublimer le contraste sans masquer l'émotion */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#17165A] via-[#17165A]/85 to-[#17165A]/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#17165A]/90 via-transparent to-[#38217F]/80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,33,127,0.3)_0%,transparent_70%)]" />
      </div>

      {/* 2. Motif africain contemporain discret en filigrane */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] opacity-35 bg-[radial-gradient(#F5B900_1px,transparent_1px)] [background-size:24px_24px]"
      />

      {/* 3. Lueurs atmosphériques douces or et violet */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[#5A35A8]/50 blur-[130px] z-[1]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-10 right-10 h-80 w-80 rounded-full bg-[#F5B900]/15 blur-[120px] z-[1]"
      />

      {/* 4. Contenu Principal du Hero */}
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-7 text-center">
        {/* Badge supérieur */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#F5B900]/40 bg-[#17165A]/80 px-4 py-1.5 shadow-[0_0_20px_rgba(245,185,0,0.15)] backdrop-blur-md">
          <Sparkles size={14} className="text-[#FFD84A]" />
          <span className="font-body text-xs font-bold uppercase tracking-[0.25em] text-[#FFD84A]">
            {EVENT.organizer} présente
          </span>
        </div>

        {/* Titre Principal Majestueux */}
        <div className="space-y-2">
          <h1 className="font-heading text-6xl uppercase tracking-wider text-white sm:text-7xl md:text-8xl lg:text-9xl drop-shadow-[0_8px_32px_rgba(0,0,0,0.8)]">
            CÉLÉBRATION <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD84A] via-[#F5B900] to-[#E5A800]">NIGHT</span>
          </h1>

          <p className="font-body text-lg font-medium text-cn-gold-light sm:text-xl md:text-2xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
            « {EVENT.tagline} »
          </p>
        </div>

        {/* Coordonnées de l'événement (Date, Heure, Lieu) */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 rounded-2xl border border-white/15 bg-[#111111]/70 px-6 py-3.5 backdrop-blur-md shadow-2xl font-body text-xs sm:text-sm text-cn-gray-300">
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
            <MapPin size={16} className="text-[#F5B900]" />
            <span className="text-cn-gray-200">Palais des Congrès (Abidjan)</span>
          </span>
        </div>

        {/* Compte à rebours dynamique */}
        <div className="w-full max-w-md my-2">
          <Countdown targetDate={EVENT.date} />
        </div>

        {/* Boutons d'Action Principaux */}
        <div className="flex w-full max-w-md flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/inscription"
            className="w-full sm:w-auto min-w-[200px] flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-[#F5B900] to-[#FFD84A] px-8 py-4 font-body text-xs font-bold uppercase tracking-widest text-[#111111] shadow-[0_8px_32px_rgba(245,185,0,0.45)] transition-all hover:scale-105 hover:shadow-[0_12px_40px_rgba(245,185,0,0.6)]"
          >
            <span>Participer (Gratuit)</span>
            <ArrowRight size={16} />
          </Link>

          <Link
            href="/programme"
            className="w-full sm:w-auto min-w-[180px] flex items-center justify-center gap-2 rounded-md border border-white/25 bg-white/5 px-6 py-4 font-body text-xs font-semibold uppercase tracking-widest text-white backdrop-blur-sm transition-all hover:border-[#F5B900] hover:text-[#F5B900] hover:bg-white/10"
          >
            Voir le programme
          </Link>
        </div>

        {/* Mention de réassurance sur le QR Code */}
        <p className="inline-flex items-center gap-2 font-body text-xs text-cn-gray-400">
          <ShieldCheck size={15} className="text-emerald-400" />
          <span>Billet numérique instantané avec QR Code sécurisé infalsifiable</span>
        </p>
      </div>
    </section>
  );
}
