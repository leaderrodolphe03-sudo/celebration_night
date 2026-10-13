"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense, useState } from "react";
import {
  CheckCircle2,
  Ticket,
  QrCode,
  Calendar,
  MapPin,
  Share2,
  Download,
  Printer,
  Sparkles,
} from "lucide-react";
import { EVENT } from "@/lib/event-config";
import SquareBadge from "@/components/ticket/SquareBadge";
import { renderBadgeToDataUrl, downloadDataUrl } from "@/lib/badge-canvas";
import Button from "@/components/ui/Button";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const ticketNumber = searchParams.get("ticketNumber") || "CN-2026-000001";
  const name = searchParams.get("name") || "Participant Officiel";
  const count = searchParams.get("count") || "1";

  const [downloading, setDownloading] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "CÉLÉBRATION NIGHT — HAGIAZO Ministry",
        text: `J'ai réservé ma place pour Célébration Night le ${EVENT.dateLabel} ! Viens adorer avec nous, c'est 100% gratuit sur inscription :`,
        url: window.location.origin,
      });
    } else {
      navigator.clipboard.writeText(window.location.origin);
      alert("Lien copié dans le presse-papiers ! Partagez-le avec vos proches.");
    }
  };

  const handleDownloadSquareBadge = async () => {
    try {
      setDownloading(true);
      const dataUrl = await renderBadgeToDataUrl({
        fullName: name,
        ticketNumber,
        qrToken: ticketNumber,
      });
      const cleanName = name.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
      downloadDataUrl(dataUrl, `billet-carre-celebration-night-${cleanName}.png`);
    } catch (err) {
      console.error("Erreur téléchargement badge:", err);
      alert("Erreur lors de la génération du badge carré.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cn-black text-white pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Halo d'ambiance */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-12 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-gradient-to-r from-cn-gold/15 via-cn-amber/10 to-cn-gold-light/15 blur-[130px]"
      />

      <div className="relative mx-auto max-w-3xl text-center">
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
          Votre place pour CÉLÉBRATION NIGHT est validée. Voici votre badge &amp; pass officiel au format carré
          comportant votre code QR unique.
        </p>

        {/* AFFICHAGE DU BADGE CARRÉ OFFICIEL */}
        <div className="mt-10 flex flex-col items-center justify-center">
          <SquareBadge
            fullName={name}
            ticketNumber={ticketNumber}
            qrToken={ticketNumber}
          />
        </div>

        {/* Actions directes pour le badge carré */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
          <Button
            type="button"
            onClick={handleDownloadSquareBadge}
            loading={downloading}
            variant="primary"
            size="lg"
            icon={<Download size={16} />}
            className="w-full sm:w-auto flex-1 justify-center"
          >
            {downloading ? "Génération du pass..." : "Télécharger mon pass (PNG HD)"}
          </Button>

          <Button
            href={`/billet/${encodeURIComponent(ticketNumber)}`}
            variant="outline"
            size="lg"
            icon={<Printer size={16} />}
            className="w-full sm:w-auto justify-center"
          >
            Imprimer le pass
          </Button>
        </div>

        {/* Carte Récapitulative Complémentaire */}
        <div className="mt-10 rounded-2xl border border-cn-gold/30 bg-gradient-to-b from-cn-dark to-cn-deep p-6 text-left shadow-2xl max-w-xl mx-auto">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-cn-gold-light">
                Numéro de Pass
              </span>
              <p className="font-heading text-2xl text-white tracking-widest">
                {ticketNumber}
              </p>
            </div>
            <span className="rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 text-xs font-bold uppercase">
              100% Gratuit
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-cn-gray-400 block uppercase">Nombre de places</span>
              <span className="font-semibold text-white">{count} {parseInt(count, 10) > 1 ? "personnes" : "personne"}</span>
            </div>
            <div>
              <span className="text-cn-gray-400 block uppercase">Date &amp; Heure</span>
              <span className="font-semibold text-white">{EVENT.dateLabel} • {EVENT.timeLabel}</span>
            </div>
          </div>

          <div className="mt-6">
            <Button
              type="button"
              onClick={handleShare}
              variant="secondary"
              icon={<Share2 size={15} />}
              className="w-full justify-center"
            >
              Partager à un ami sur WhatsApp
            </Button>
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
        <div className="min-h-screen bg-cn-black text-white p-12 text-center">
          Chargement de votre confirmation...
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
