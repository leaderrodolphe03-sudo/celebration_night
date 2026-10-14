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
    <div className="min-h-screen bg-cn-black text-cn-gray-100 py-12 px-4 sm:px-6 lg:px-8 print:p-0 print:m-0 print:bg-white print:text-black">
      {/* Barre d'action supérieure (masquée à l'impression) */}
      <div className="print:hidden mx-auto max-w-3xl mb-8 flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-cn-gray-300 hover:text-white uppercase tracking-wider font-semibold"
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
            className="inline-flex items-center gap-2 rounded-lg border border-cn-gold/40 bg-cn-gold/10 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-cn-gold-light hover:bg-cn-gold/20 transition-colors whitespace-nowrap flex-nowrap"
          >
            <Download size={14} className="text-cn-gold shrink-0" />
            <span className="whitespace-nowrap">Pass Carré HD</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadQr}
            className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-cn-gray-100 hover:bg-white/10 transition-colors whitespace-nowrap flex-nowrap"
          >
            <Download size={14} className="text-cn-gold shrink-0" />
            <span className="whitespace-nowrap">QR Code</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cn-gold to-cn-amber px-5 py-2.5 text-xs font-black uppercase tracking-wider text-cn-black shadow-gold hover:brightness-110 transition-all hover:scale-105 whitespace-nowrap flex-nowrap"
          >
            <Printer size={15} className="shrink-0" />
            <span className="whitespace-nowrap">Imprimer le Billet</span>
          </button>
        </div>
      </div>

      {/* BILLET OFFICIEL HAUTE FIDÉLITÉ (Imprimable sur fond blanc éco-responsable) */}
      <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl border-2 border-cn-gold/40 bg-cn-dark shadow-2xl print:border-2 print:border-black print:rounded-none print:shadow-none print:m-0 print:w-full print:bg-white">
        {/* Bandeau d'en-tête du billet */}
        <div className={`p-6 sm:p-8 relative print:bg-white print:border-b-2 print:border-black ${
          isVip
            ? "bg-gradient-to-r from-cn-deep via-cn-dark to-cn-black border-b-2 border-cn-gold"
            : "bg-gradient-to-r from-cn-deep via-cn-dark to-cn-black border-b border-white/10"
        }`}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-cn-gold-light print:text-neutral-700">
                {data.event.organizer} Présente
              </span>
              <h1 className="font-heading text-3xl sm:text-5xl uppercase tracking-wider text-white print:text-black">
                {data.event.name}
              </h1>
              <p className="font-body text-xs sm:text-sm text-cn-gray-300 print:text-neutral-600">
                {data.event.tagline}
              </p>
            </div>

            <div className="text-right flex flex-col items-end">
              <span
                className={`rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wider print:border print:border-black print:bg-white print:text-black ${
                  isVip
                    ? "bg-cn-gold text-cn-black font-black shadow-lg"
                    : "bg-cn-deep text-cn-gold-light border border-cn-gold/40"
                }`}
              >
                {isVip ? "★ Pass Partenaire VIP" : "Pass Standard"}
              </span>
              <span className="mt-2 text-xs font-mono text-cn-gray-400 print:text-neutral-700">
                Statut : {isValid ? "✓ VALIDE" : "UTILISÉ"}
              </span>
            </div>
          </div>
        </div>

        {/* Corps du Billet : Données Participant + QR Code */}
        <div className="p-6 sm:p-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-cn-deep/40 print:bg-white print:p-6">
          {/* Colonne Informations (7 colonnes) */}
          <div className="md:col-span-7 space-y-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-cn-gray-400 print:text-neutral-600">
                Participant(e) Enregistré(e)
              </span>
              <h2 className="font-heading text-2xl sm:text-4xl uppercase tracking-wide text-white print:text-black mt-0.5">
                {data.participant.firstName} {data.participant.lastName}
              </h2>
              <p className="text-xs text-cn-gold print:text-neutral-700 font-medium mt-0.5">
                {data.participant.city}, {data.participant.country} • {data.participant.email}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10 print:border-neutral-300 text-xs">
              <div>
                <span className="text-cn-gray-400 print:text-neutral-600 uppercase tracking-wider block flex items-center gap-1">
                  <Calendar size={13} className="text-cn-gold print:text-black" /> Date
                </span>
                <span className="font-semibold text-white print:text-black text-sm mt-0.5 block">
                  {data.event.dateLabel}
                </span>
              </div>
              <div>
                <span className="text-cn-gray-400 print:text-neutral-600 uppercase tracking-wider block flex items-center gap-1">
                  <Clock size={13} className="text-cn-gold print:text-black" /> Heure
                </span>
                <span className="font-semibold text-white print:text-black text-sm mt-0.5 block">
                  {data.event.timeLabel} (Accès 17h30)
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-cn-gray-400 print:text-neutral-600 uppercase tracking-wider block flex items-center gap-1">
                  <MapPin size={13} className="text-cn-amber print:text-black" /> Lieu du Rassemblement
                </span>
                <span className="font-semibold text-white print:text-black text-sm mt-0.5 block">
                  Temple des Leaders FOURSQUARE Sikècodji
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 print:border-neutral-300 flex items-center justify-between text-xs text-cn-gray-400 print:text-neutral-600">
              <span>N° de série : <strong className="text-white print:text-black font-mono">{data.ticket.ticketNumber}</strong></span>
              <span>Émis le : {new Date(data.ticket.createdAt).toLocaleDateString("fr-FR")}</span>
            </div>
          </div>

          {/* Colonne QR Code (5 colonnes) */}
          <div className="md:col-span-5 flex flex-col items-center text-center justify-center p-6 rounded-2xl bg-white text-black shadow-xl print:shadow-none print:border print:border-neutral-300">
            <span className="text-[10px] font-bold uppercase tracking-widest text-cn-amber print:text-black mb-2">
              Pass de Contrôle Unique
            </span>

            {/* Image du QR Code */}
            <div className="p-2 border-2 border-dashed border-cn-gold/40 print:border-neutral-400 rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.qrCodeDataUrl}
                alt={`QR Code Billet ${data.ticket.ticketNumber}`}
                className="w-48 h-48 object-contain"
              />
            </div>

            <p className="mt-3 font-mono text-xs font-bold text-black tracking-wider">
              {data.ticket.ticketNumber}
            </p>

            <p className="mt-2 text-[10px] text-neutral-600 leading-tight">
              Présentez ce QR Code au portique de validation pour entrer.
            </p>
          </div>
        </div>

        {/* Pied du Billet / Sécurité et Conditions */}
        <div className="bg-cn-black print:bg-white print:border-t print:border-black p-4 sm:px-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-cn-gray-400 print:text-neutral-700">
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-emerald-400 print:text-black" />
            <span>Billet sécurisé par token cryptographique haché • Zéro PII exposée</span>
          </div>
          <span>Usage personnel unique • Toute reproduction est interdite</span>
        </div>
      </div>

      {/* Guide & Consignes pour le contrôle d'accès */}
      <div className="print:hidden mx-auto max-w-3xl mt-8 text-center text-xs text-cn-gray-400">
        <p>
          Une question sur votre venue ? Consultez notre{" "}
          <Link href="/contact" className="text-cn-gold-light underline">
            FAQ & Contact
          </Link>{" "}
          ou retrouvez d&apos;autres billets associés sur{" "}
          <Link href="/mon-billet" className="text-cn-gold-light underline">
            Mon Billet
          </Link>.
        </p>
      </div>
    </div>
  );
}
