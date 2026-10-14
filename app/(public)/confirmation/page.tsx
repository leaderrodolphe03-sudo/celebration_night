"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense, useState, useEffect } from "react";
import {
  CheckCircle2,
  Calendar,
  MapPin,
  Share2,
  Printer,
  Sparkles,
  Camera,
} from "lucide-react";
import { EVENT } from "@/lib/event-config";
import BadgeGenerator from "@/components/ticket/BadgeGenerator";
import Button from "@/components/ui/Button";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const ticketNumber = searchParams.get("ticketNumber") || "CN-2026-000001";
  const name = searchParams.get("name") || "Participant Officiel";

  const handleShare = () => {
    const text = `J'ai réservé ma place pour CELEBRATION NIGHT le ${EVENT.dateLabel} ! Viens adorer avec nous, c'est 100% gratuit sur inscription :`;
    const shareUrl = typeof window !== "undefined" ? window.location.origin : "https://celebrationnight.org";

    if (navigator.share) {
      navigator.share({
        title: "CELEBRATION NIGHT — HAGIAZO Ministry",
        text,
        url: shareUrl,
      });
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(`${text} ${shareUrl}`);
      alert("Lien copié dans le presse-papiers ! Partagez-le avec vos proches.");
    }
  };

  return (
    <div className="min-h-screen bg-cn-black text-white pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Halo d'ambiance cinématique */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-12 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-gradient-to-r from-cn-gold/15 via-cn-amber/10 to-cn-gold-light/15 blur-[130px]"
      />

      <div className="relative mx-auto max-w-4xl text-center">
        {/* Icône de succès */}
        <div className="mx-auto h-20 w-20 rounded-full bg-cn-gold/20 border-2 border-cn-gold flex items-center justify-center text-cn-gold-light shadow-[0_0_40px_rgba(245,158,11,0.35)]">
          <CheckCircle2 size={42} />
        </div>

        <span className="mt-6 inline-block text-[11px] font-bold uppercase tracking-[0.3em] text-cn-gold-light">
          Inscription Confirmée avec Succès
        </span>
        <h1 className="mt-2 font-heading text-4xl sm:text-6xl uppercase tracking-wider text-white">
          Félicitations {name} !
        </h1>
        <p className="mt-3 text-sm sm:text-base text-cn-gray-300 font-body max-w-xl mx-auto">
          Votre place pour CELEBRATION NIGHT est validée. Ajoutez dès maintenant votre photo ci-dessous pour personnaliser et télécharger votre badge officiel carré &laquo; J&apos;y serai &raquo;.
        </p>

        {/* MODULE INTERACTIF : GÉNÉRATEUR DU BADGE AVEC SA PHOTO */}
        <div className="mt-10 rounded-3xl border border-cn-gold/30 bg-gradient-to-b from-cn-dark to-cn-deep p-6 sm:p-10 shadow-2xl text-left">
          <div className="border-b border-white/10 pb-5 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-cn-gold-light block">
                Pass Carré 1:1 &bull; WhatsApp Status &amp; Instagram Story
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl uppercase tracking-wide text-white mt-1 flex items-center gap-2">
                <Camera size={24} className="text-cn-amber" />
                Personnalise ton badge officiel
              </h2>
            </div>
            <span className="self-start sm:self-auto rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 text-xs font-bold uppercase">
              Billet N° {ticketNumber}
            </span>
          </div>

          <BadgeGenerator
            fullName={name}
            ticketNumber={ticketNumber}
            qrToken={ticketNumber}
            showDownloadButton={true}
          />
        </div>

        {/* Actions complémentaires & Partage */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
          <Button
            href={`/billet/${encodeURIComponent(ticketNumber)}`}
            variant="outline"
            size="lg"
            icon={<Printer size={16} />}
            className="w-full sm:w-auto flex-1 justify-center"
          >
            Imprimer mon billet complet
          </Button>

          <Button
            type="button"
            onClick={handleShare}
            variant="secondary"
            size="lg"
            icon={<Share2 size={16} />}
            className="w-full sm:w-auto flex-1 justify-center"
          >
            Inviter un proche sur WhatsApp
          </Button>
        </div>

        {/* Carte Récapitulative Détails Événement */}
        <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6 max-w-xl mx-auto text-left text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-cn-gray-400 block uppercase">Événement</span>
              <span className="font-semibold text-white">{EVENT.name}</span>
            </div>
            <div>
              <span className="text-cn-gray-400 block uppercase">Date &amp; Heure</span>
              <span className="font-semibold text-white">{EVENT.dateLabel} à {EVENT.timeLabel}</span>
            </div>
            <div>
              <span className="text-cn-gray-400 block uppercase">Lieu</span>
              <span className="font-semibold text-white">{EVENT.venue}</span>
            </div>
            <div>
              <span className="text-cn-gray-400 block uppercase">Tarif</span>
              <span className="font-semibold text-emerald-400">100% Gratuit sur inscription</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-cn-black text-white p-12 text-center flex items-center justify-center">
          <div className="h-10 w-10 border-4 border-cn-gold border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
