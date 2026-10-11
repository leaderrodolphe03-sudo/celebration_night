"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Printer,
  Download,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Ticket as TicketIcon,
} from "lucide-react";
import { CelebrationNightLogo, HagiazoLogo } from "@/components/layout/Logos";

interface TicketDetails {
  event: {
    name: string;
    organizer: string;
    tagline: string;
    dateLabel: string;
    timeLabel: string;
    venue: string;
  };
  ticket: {
    ticketNumber: string;
    ticketType: "STANDARD" | "VIP";
    status: "VALID" | "USED" | "CANCELLED";
    scannedAt?: string | null;
    createdAt: string;
  };
  participant: {
    firstName: string;
    lastName: string;
    email: string;
    city: string;
    country: string;
  };
  qrCodeDataUrl: string;
  qrCodeSvg: string;
}

export default function TicketPage() {
  const params = useParams();
  const rawTicketNumber = params?.ticketNumber as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TicketDetails | null>(null);

  useEffect(() => {
    if (!rawTicketNumber) return;

    fetch(`/api/ticket/${encodeURIComponent(rawTicketNumber)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Billet non trouvé ou introuvable.");
        return res.json();
      })
      .then((resData) => {
        setData(resData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Erreur de chargement du billet.");
        setLoading(false);
      });
  }, [rawTicketNumber]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadQr = () => {
    if (!data?.qrCodeDataUrl) return;
    const link = document.createElement("a");
    link.href = data.qrCodeDataUrl;
    link.download = `QR-${data.ticket.ticketNumber}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080808] text-[#EDE8DC] flex flex-col items-center justify-center p-6 text-center">
        <div className="h-12 w-12 rounded-full border-4 border-[#F59E0B] border-t-transparent animate-spin mb-4" />
        <p className="font-heading text-xl uppercase tracking-wider text-[#BFB89E]">
          Chargement de votre billet officiel...
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#080808] text-[#EDE8DC] flex flex-col items-center justify-center p-6 text-center">
        <div className="h-16 w-16 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mb-4">
          <AlertTriangle size={32} />
        </div>
        <h1 className="font-heading text-3xl uppercase tracking-wider text-[#EDE8DC]">
          Billet Introuvable
        </h1>
        <p className="mt-2 text-sm text-[#BFB89E] max-w-md">
          {error || "Ce numéro de billet n'existe pas ou a été annulé."}
        </p>
        <Link
          href="/mon-billet"
          className="mt-6 rounded-md bg-gradient-to-r from-[#EA580C] to-[#F59E0B] px-6 py-3 font-body text-xs font-bold uppercase tracking-wider text-[#080808] shadow-lg"
        >
          Rechercher un autre billet
        </Link>
      </div>
    );
  }

  const isVip = data.ticket.ticketType === "VIP";
  const isValid = data.ticket.status === "VALID";

  return (
    <div className="min-h-screen bg-[#080808] text-[#EDE8DC] py-12 px-4 sm:px-6 lg:px-8">
      {/* Barre d'action supérieure (masquée à l'impression) */}
      <div className="print:hidden mx-auto max-w-3xl mb-8 flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-[#BFB89E] hover:text-white uppercase tracking-wider"
        >
          <ArrowLeft size={16} />
          <span>Retour à l&apos;accueil</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={async () => {
              try {
                const { renderBadgeToDataUrl, downloadDataUrl } = await import("@/lib/badge-canvas");
                const dataUrl = await renderBadgeToDataUrl({
                  fullName: `${data.participant.firstName} ${data.participant.lastName}`,
                  ticketNumber: data.ticket.ticketNumber,
                  qrToken: data.ticket.ticketNumber,
                });
                downloadDataUrl(dataUrl, `badge-carre-${data.ticket.ticketNumber}.png`);
              } catch (e) {
                console.error(e);
              }
            }}
            className="inline-flex items-center gap-2 rounded-md border border-[#F59E0B]/40 bg-[#F59E0B]/10 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#FCD34D] hover:bg-[#F59E0B]/20 transition-colors"
          >
            <Download size={14} className="text-[#FCD34D]" />
            <span>Pass Carré J&apos;y Serai (HD)</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadQr}
            className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/5 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#EDE8DC] hover:bg-white/10 transition-colors"
          >
            <Download size={14} className="text-[#FCD34D]" />
            <span>QR Code</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-[#EA580C] via-[#F59E0B] to-[#FCD34D] px-5 py-2.5 text-xs font-black uppercase tracking-wider text-[#080808] shadow-lg transition-transform hover:scale-105"
          >
            <Printer size={15} />
            <span>Imprimer le Billet</span>
          </button>
        </div>
      </div>

      {/* BILLET OFFICIEL HAUTE FIDÉLITÉ (Imprimable et affichable) */}
      <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl border-2 border-[#F59E0B]/40 bg-[#120E0A] shadow-[0_20px_60px_rgba(0,0,0,0.8)] print:border-black print:shadow-none print:m-0 print:w-full">
        {/* Bandeau d'en-tête du billet */}
        <div className={`p-6 sm:p-8 relative ${
          isVip
            ? "bg-gradient-to-r from-[#1F1710] via-[#2A1F16] to-[#120E0A] border-b-2 border-[#F59E0B]"
            : "bg-gradient-to-r from-[#18120B] via-[#120E0A] to-[#0A0806] border-b border-white/10"
        }`}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#FCD34D]">
                {data.event.organizer} Présente
              </span>
              <h1 className="font-heading text-3xl sm:text-5xl uppercase tracking-wider text-[#EDE8DC]">
                {data.event.name}
              </h1>
              <p className="font-body text-xs sm:text-sm text-[#BFB89E]">
                {data.event.tagline}
              </p>
            </div>

            <div className="text-right flex flex-col items-end">
              <span
                className={`rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wider ${
                  isVip
                    ? "bg-[#F59E0B] text-[#080808] font-black shadow-lg"
                    : "bg-[#1F1710] text-[#FCD34D] border border-[#F59E0B]/40"
                }`}
              >
                {isVip ? "★ Pass Partenaire VIP" : "Pass Standard"}
              </span>
              <span className="mt-2 text-xs font-mono text-[#BFB89E]">
                Statut : {isValid ? "✓ VALIDE" : "UTILISÉ"}
              </span>
            </div>
          </div>
        </div>

        {/* Corps du Billet : Données Participant + QR Code */}
        <div className="p-6 sm:p-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-[#080808]/70">
          {/* Colonne Informations (7 colonnes) */}
          <div className="md:col-span-7 space-y-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#BFB89E]/70">
                Participant(e) Enregistré(e)
              </span>
              <h2 className="font-heading text-2xl sm:text-4xl uppercase tracking-wide text-[#EDE8DC] mt-0.5">
                {data.participant.firstName} {data.participant.lastName}
              </h2>
              <p className="text-xs text-[#FCD34D] font-medium mt-0.5">
                {data.participant.city}, {data.participant.country} • {data.participant.email}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10 text-xs">
              <div>
                <span className="text-[#BFB89E]/70 uppercase tracking-wider block flex items-center gap-1">
                  <Calendar size={13} className="text-[#FCD34D]" /> Date
                </span>
                <span className="font-semibold text-[#EDE8DC] text-sm mt-0.5 block">
                  {data.event.dateLabel}
                </span>
              </div>
              <div>
                <span className="text-[#BFB89E]/70 uppercase tracking-wider block flex items-center gap-1">
                  <Clock size={13} className="text-[#FCD34D]" /> Heure
                </span>
                <span className="font-semibold text-[#EDE8DC] text-sm mt-0.5 block">
                  {data.event.timeLabel} (Accès 17h30)
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-[#BFB89E]/70 uppercase tracking-wider block flex items-center gap-1">
                  <MapPin size={13} className="text-[#EA580C]" /> Lieu du Rassemblement
                </span>
                <span className="font-semibold text-[#EDE8DC] text-sm mt-0.5 block">
                  Palais des Congrès / Grande Halle de Célébration (Abidjan)
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-[#BFB89E]/70">
              <span>N° de série : <strong className="text-[#EDE8DC] font-mono">{data.ticket.ticketNumber}</strong></span>
              <span>Émis le : {new Date(data.ticket.createdAt).toLocaleDateString("fr-FR")}</span>
            </div>
          </div>

          {/* Colonne QR Code (5 colonnes) */}
          <div className="md:col-span-5 flex flex-col items-center text-center justify-center p-6 rounded-2xl bg-white text-[#080808] shadow-2xl">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#EA580C] mb-2">
              Pass de Contrôle Unique
            </span>

            {/* Image du QR Code généré dynamiquement */}
            <div className="p-2 border-2 border-dashed border-[#EA580C]/30 rounded-xl">
              <img
                src={data.qrCodeDataUrl}
                alt={`QR Code Billet ${data.ticket.ticketNumber}`}
                className="w-48 h-48 object-contain"
              />
            </div>

            <p className="mt-3 font-mono text-xs font-bold text-[#080808] tracking-wider">
              {data.ticket.ticketNumber}
            </p>

            <p className="mt-2 text-[10px] text-neutral-500 leading-tight">
              Présentez ce QR Code au portique de validation pour entrer.
            </p>
          </div>
        </div>

        {/* Pied du Billet / Sécurité et Conditions */}
        <div className="bg-[#0D0A08] p-4 sm:px-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#BFB89E]/70">
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>Billet sécurisé par token cryptographique haché • Zéro PII exposée</span>
          </div>
          <span>Usage personnel unique • Toute reproduction est interdite</span>
        </div>
      </div>

      {/* Guide & Consignes pour le contrôle d'accès */}
      <div className="print:hidden mx-auto max-w-3xl mt-8 text-center text-xs text-[#BFB89E]/70">
        <p>
          Une question sur votre venue ? Consultez notre{" "}
          <Link href="/contact" className="text-[#FCD34D] underline">
            FAQ & Contact
          </Link>{" "}
          ou retrouvez d&apos;autres billets associés sur{" "}
          <Link href="/mon-billet" className="text-[#FCD34D] underline">
            Mon Billet
          </Link>.
        </p>
      </div>
    </div>
  );
}
