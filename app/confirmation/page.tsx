"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { CheckCircle2, Ticket, QrCode, Calendar, MapPin, Share2, Download, ArrowRight, Printer } from "lucide-react";
import { EVENT } from "@/lib/event-config";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const ticketNumber = searchParams.get("ticketNumber") || "CN-2026-000001";
  const count = searchParams.get("count") || "1";

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "CÉLÉBRATION NIGHT 2026 — HAGIAZO Ministry",
        text: "Je viens de réserver ma place pour Célébration Night le 14 Novembre 2026 ! Viens adorer avec nous, c'est gratuit sur inscription :",
        url: window.location.origin,
      });
    } else {
      navigator.clipboard.writeText(window.location.origin);
      alert("Lien copié dans le presse-papiers ! Partagez-le avec vos amis.");
    }
  };

  return (
    <div className="min-h-screen bg-[#17165A] text-white py-16 px-4 sm:px-6 lg:px-8">
      {/* Halo d'ambiance */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-12 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[#38217F]/60 blur-[130px]"
      />

      <div className="relative mx-auto max-w-2xl text-center">
        {/* Icône de succès */}
        <div className="mx-auto h-20 w-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-[0_0_40px_rgba(52,211,153,0.3)]">
          <CheckCircle2 size={42} />
        </div>

        <span className="mt-6 inline-block text-[11px] font-bold uppercase tracking-[0.3em] text-[#F5B900]">
          Inscription Validée
        </span>
        <h1 className="mt-2 font-heading text-4xl sm:text-5xl uppercase tracking-wider text-white">
          Félicitations ! Votre Place est Réservée
        </h1>
        <p className="mt-3 text-sm sm:text-base text-cn-gray-300 font-body">
          Un email de confirmation vous a été adressé. Votre billet numérique officiel et son QR Code
          unique sont désormais disponibles.
        </p>

        {/* Carte Récapitulative du Billet */}
        <div className="mt-8 rounded-2xl border border-[#F5B900]/40 bg-gradient-to-b from-[#111111]/90 to-[#17165A] p-6 sm:p-8 backdrop-blur-md shadow-2xl text-left">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#F5B900]">
                Numéro de Billet Principal
              </span>
              <p className="font-heading text-2xl sm:text-3xl text-white tracking-widest mt-0.5">
                {ticketNumber}
              </p>
            </div>
            <span className="rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 text-xs font-bold uppercase">
              ✓ Billet Valide
            </span>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-cn-gray-500 block uppercase tracking-wider">Événement</span>
              <span className="font-semibold text-white text-sm">{EVENT.name}</span>
            </div>
            <div>
              <span className="text-cn-gray-500 block uppercase tracking-wider">Nombre de places</span>
              <span className="font-semibold text-white text-sm">
                {count} {parseInt(count, 10) > 1 ? "personnes" : "personne"}
              </span>
            </div>
            <div>
              <span className="text-cn-gray-500 block uppercase tracking-wider">Date & Heure</span>
              <span className="font-semibold text-white text-sm">
                {EVENT.dateLabel} à {EVENT.timeLabel}
              </span>
            </div>
            <div>
              <span className="text-cn-gray-500 block uppercase tracking-wider">Lieu</span>
              <span className="font-semibold text-white text-sm">{EVENT.venue}</span>
            </div>
          </div>

          {/* Boutons d'action principaux */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col gap-3">
            <Link
              href={`/billet/${encodeURIComponent(ticketNumber)}`}
              className="w-full flex items-center justify-center gap-2 rounded-md bg-[#F5B900] py-4 text-center font-body text-xs font-bold uppercase tracking-widest text-[#111111] hover:bg-[#FFD84A] shadow-xl transition-transform hover:scale-[1.02]"
            >
              <QrCode size={18} />
              <span>Afficher & Télécharger mon Billet avec QR Code</span>
              <ArrowRight size={16} />
            </Link>

            <button
              type="button"
              onClick={handleShare}
              className="w-full flex items-center justify-center gap-2 rounded-md border border-white/20 bg-white/5 py-3 text-center font-body text-xs font-semibold uppercase tracking-wider text-white hover:bg-white/10 transition-colors"
            >
              <Share2 size={16} className="text-[#F5B900]" />
              Inviter un ami / Partager l&apos;événement
            </button>
          </div>
        </div>

        {/* Rappel des consignes */}
        <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-cn-gray-300 text-left">
          <h4 className="font-bold uppercase tracking-wider text-white text-xs mb-1">
            À noter pour le jour de l&apos;événement :
          </h4>
          <p className="leading-relaxed">
            Présentez ce billet directement sur l&apos;écran de votre smartphone (luminosité au maximum)
            ou sur une feuille imprimée. Le QR Code sera scanné à l&apos;entrée pour valider votre admission.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#17165A] text-white p-12 text-center">Chargement de votre confirmation...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
