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
  ArrowRight,
  Printer,
  Sparkles,
} from "lucide-react";
import { EVENT } from "@/lib/event-config";
import SquareBadge from "@/components/ticket/SquareBadge";
import { renderBadgeToDataUrl, downloadDataUrl } from "@/lib/badge-canvas";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const ticketNumber = searchParams.get("ticketNumber") || "CN-2026-000001";
  const name = searchParams.get("name") || "Participant Officiel";
  const count = searchParams.get("count") || "1";

  const [downloading, setDownloading] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "CELEBRATION NIGHT 2026",
        text: `J'ai réservé ma place pour Célébration Night le ${EVENT.dateLabel} ! Viens adorer avec nous, inscris-toi ici :`,
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
    <div className="min-h-screen bg-[#0A0304] px-4 py-16 text-white sm:px-6 lg:px-8">
      {/* Halo d'ambiance */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-12 h-96 w-96 -translate-x-1/2 rounded-full bg-[#E5252A]/20 blur-[130px]"
      />

      <div className="relative mx-auto max-w-3xl text-center">
        {/* Icône de succès */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-emerald-400 bg-emerald-500/20 text-emerald-400 shadow-[0_0_40px_rgba(52,211,153,0.3)]">
          <CheckCircle2 size={42} />
        </div>

        <span className="mt-6 inline-block text-[11px] font-bold uppercase tracking-[0.3em] text-[#FFD84A]">
          Inscription Confirmée avec Succès
        </span>
        <h1 className="mt-2 font-heading text-4xl uppercase tracking-wider text-white sm:text-6xl">
          Félicitations {name} !
        </h1>
        <p className="mx-auto mt-3 max-w-xl font-body text-sm text-cn-gray-300 sm:text-base">
          Votre place pour CÉLÉBRATION NIGHT est validée. Voici votre badge & pass officiel au
          format carré comportant votre code QR unique.
        </p>

        {/* AFFICHAGE DU BADGE CARRÉ OFFICIEL */}
        <div className="mt-10 flex flex-col items-center justify-center">
          <SquareBadge fullName={name} ticketNumber={ticketNumber} qrToken={ticketNumber} />
        </div>

        {/* Actions directes pour le badge carré */}
        <div className="mx-auto mt-8 flex max-w-lg flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            type="button"
            onClick={handleDownloadSquareBadge}
            disabled={downloading}
            className="inline-flex w-full flex-1 items-center justify-center gap-2 rounded-md bg-gradient-to-r from-[#B71C1C] via-[#E5252A] to-[#F5B900] bg-[length:200%_auto] px-6 py-4 font-body text-xs font-bold uppercase tracking-widest text-white shadow-xl transition-all hover:scale-105 hover:bg-right sm:w-auto"
          >
            <Download size={16} />
            <span>
              {downloading ? "Génération du pass..." : "Télécharger mon pass carré (PNG HD)"}
            </span>
          </button>

          <Link
            href={`/billet/${encodeURIComponent(ticketNumber)}`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-white/20 bg-white/5 px-6 py-4 font-body text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-white/10 sm:w-auto"
          >
            <Printer size={16} className="text-[#FFD84A]" />
            <span>Imprimer le pass</span>
          </Link>
        </div>

        {/* Carte Récapitulative Complémentaire */}
        <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-white/15 bg-gradient-to-b from-[#140507] to-[#0A0304] p-6 text-left shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFD84A]">
                Numéro de Pass
              </span>
              <p className="font-heading text-2xl tracking-widest text-white">{ticketNumber}</p>
            </div>
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/20 px-3 py-1 text-xs font-bold uppercase text-emerald-400">
              100% Gratuit
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-cn-gray-400 block uppercase">Nombre de places</span>
              <span className="font-semibold text-white">
                {count} {parseInt(count, 10) > 1 ? "personnes" : "personne"}
              </span>
            </div>
            <div>
              <span className="text-cn-gray-400 block uppercase">Date & Heure</span>
              <span className="font-semibold text-white">
                {EVENT.dateLabel} • {EVENT.timeLabel}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleShare}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-md border border-white/15 bg-white/5 py-3 text-xs font-semibold uppercase tracking-wider text-[#FFD84A] transition-colors hover:bg-white/10"
          >
            <Share2 size={15} />
            <span>Partager à un ami sur WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0A0304] p-12 text-center text-white">
          Chargement de votre confirmation...
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
