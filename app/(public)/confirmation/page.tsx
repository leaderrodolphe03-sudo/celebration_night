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
    <div className="min-h-screen bg-[#080808] text-[#EDE8DC] py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Halo d'ambiance */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-12 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#F59E0B]/20 via-[#EA580C]/15 to-[#FCD34D]/20 blur-[130px]"
      />

      <div className="relative mx-auto max-w-3xl text-center">
        {/* Icône de succès */}
        <div className="mx-auto h-20 w-20 rounded-full bg-[#F59E0B]/20 border-2 border-[#F59E0B] flex items-center justify-center text-[#FCD34D] shadow-[0_0_40px_rgba(245,158,11,0.35)]">
          <CheckCircle2 size={42} />
        </div>

        <span className="mt-6 inline-block text-[11px] font-bold uppercase tracking-[0.3em] text-[#FCD34D]">
          Inscription Confirmée avec Succès
        </span>
        <h1 className="mt-2 font-heading text-4xl sm:text-6xl uppercase tracking-wider text-[#EDE8DC]">
          Félicitations {name} !
        </h1>
        <p className="mt-3 text-sm sm:text-base text-[#BFB89E] font-body max-w-xl mx-auto">
          Votre place pour CÉLÉBRATION NIGHT est validée. Voici votre badge & pass officiel au format carré
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
          <button
            type="button"
            onClick={handleDownloadSquareBadge}
            disabled={downloading}
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-[#EA580C] via-[#F59E0B] to-[#FCD34D] px-6 py-4 font-body text-xs font-black uppercase tracking-widest text-[#080808] shadow-[0_10px_30px_rgba(245,158,11,0.35)] transition-all hover:scale-105"
          >
            <Download size={16} />
            <span>{downloading ? "Génération du pass..." : "Télécharger mon pass carré (PNG HD)"}</span>
          </button>

          <Link
            href={`/billet/${encodeURIComponent(ticketNumber)}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md border border-[#F59E0B]/30 bg-[#120E0A] px-6 py-4 font-body text-xs font-semibold uppercase tracking-wider text-[#EDE8DC] hover:bg-[#1A140E] transition-colors"
          >
            <Printer size={16} className="text-[#FCD34D]" />
            <span>Imprimer le pass</span>
          </Link>
        </div>

        {/* Carte Récapitulative Complémentaire */}
        <div className="mt-10 rounded-2xl border border-[#F59E0B]/30 bg-gradient-to-b from-[#18120B] to-[#0A0806] p-6 text-left shadow-2xl max-w-xl mx-auto">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#FCD34D]">
                Numéro de Pass
              </span>
              <p className="font-heading text-2xl text-[#EDE8DC] tracking-widest">
                {ticketNumber}
              </p>
            </div>
            <span className="rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 text-xs font-bold uppercase">
              100% Gratuit
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[#BFB89E]/70 block uppercase">Nombre de places</span>
              <span className="font-semibold text-[#EDE8DC]">{count} {parseInt(count, 10) > 1 ? "personnes" : "personne"}</span>
            </div>
            <div>
              <span className="text-[#BFB89E]/70 block uppercase">Date & Heure</span>
              <span className="font-semibold text-[#EDE8DC]">{EVENT.dateLabel} • {EVENT.timeLabel}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleShare}
            className="mt-6 w-full flex items-center justify-center gap-2 rounded-md border border-[#F59E0B]/40 bg-[#1F1710] py-3 text-xs font-semibold uppercase tracking-wider text-[#FCD34D] hover:bg-[#2A1F16] transition-colors"
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
        <div className="min-h-screen bg-[#080808] text-[#EDE8DC] p-12 text-center">
          Chargement de votre confirmation...
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
