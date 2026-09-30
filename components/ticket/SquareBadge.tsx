"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import Image from "next/image";
import { Sparkles, CheckCircle2, QrCode as QrIcon } from "lucide-react";
import { EVENT } from "@/lib/event-config";

export interface SquareBadgeProps {
  fullName: string;
  ticketNumber: string;
  qrToken?: string;
  photoUrl?: string | null;
  className?: string;
}

export default function SquareBadge({
  fullName,
  ticketNumber,
  qrToken,
  photoUrl,
  className = "",
}: SquareBadgeProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  useEffect(() => {
    const tokenToEncode = qrToken || ticketNumber || "CN-2026-VALIDE";
    QRCode.toDataURL(tokenToEncode, {
      errorCorrectionLevel: "H",
      margin: 1,
      width: 250,
      color: {
        dark: "#0A0304",
        light: "#FFFFFF",
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error("Erreur QR:", err));
  }, [qrToken, ticketNumber]);

  const displayName = fullName.trim() || "PARTICIPANT OFFICIEL";
  const initial = (fullName.trim()[0] || "C").toUpperCase();

  return (
    <div
      className={`relative aspect-square w-full max-w-[480px] rounded-3xl p-5 sm:p-7 flex flex-col justify-between overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)] border-2 border-white/20 bg-gradient-to-br from-[#0A0304] via-[#24080C] to-[#140507] select-none ${className}`}
      style={{
        boxShadow: "0 0 0 1px rgba(245, 185, 0, 0.3), 0 25px 50px -12px rgba(229, 37, 42, 0.35)",
      }}
    >
      {/* Halos d'ambiance d'arrière-plan */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-[#E5252A]/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-16 right-0 h-64 w-64 rounded-full bg-[#F5B900]/20 blur-3xl"
      />

      {/* Liseré or intérieur */}
      <div className="pointer-events-none absolute inset-2.5 rounded-[22px] border border-[#F5B900]/40" />

      {/* 1. En-tête : Titre & Organisation */}
      <div className="relative z-10 text-center">
        <span className="font-body text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.3em] text-[#FFD84A] block">
          HAGIAZO MINISTRY PRÉSENTE
        </span>
        <h3 className="mt-1 font-heading text-3xl sm:text-5xl uppercase tracking-wider text-white drop-shadow-md leading-none">
          CÉLÉBRATION NIGHT
        </h3>
        <p className="mt-1 font-body text-[10px] sm:text-xs font-semibold tracking-wider text-cn-gray-300 uppercase">
          {EVENT.dateLabel} • {EVENT.timeLabel} • ABIDJAN
        </p>
      </div>

      {/* 2. Centre : Photo avec le macaron graphique « J'Y SERAI ! » */}
      <div className="relative z-10 my-auto flex justify-center">
        <div className="relative">
          {/* Cadre photo façon poster haute facture */}
          <div className="relative h-44 w-44 sm:h-56 sm:w-56 rounded-2xl overflow-hidden border-[3.5px] border-white shadow-2xl bg-[#24080C]">
            {photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photoUrl}
                alt={`Photo de ${displayName}`}
                className="h-full w-full object-cover object-center"
              />
            ) : (
              <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-[#24080C] via-[#B71C1C] to-[#140507] text-center p-4">
                <span className="font-heading text-6xl sm:text-7xl text-[#FFD84A] leading-none">
                  {initial}
                </span>
                <span className="mt-2 font-body text-[10px] font-bold tracking-widest text-white/80 uppercase">
                  Ta photo ici
                </span>
              </div>
            )}
          </div>

          {/* Macaron / Tampon officiel « J'Y SERAI ! » incliné sur la photo */}
          <div className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 rotate-[-8deg] shadow-xl">
            <div className="rounded-xl border-2 border-white bg-gradient-to-r from-[#B71C1C] via-[#E5252A] to-[#F5B900] px-3.5 py-1.5 sm:px-4 sm:py-2 text-white shadow-[0_8px_20px_rgba(229,37,42,0.6)]">
              <span className="font-heading text-sm sm:text-xl font-black uppercase tracking-wider text-white flex items-center gap-1 drop-shadow">
                <span>★</span> J&apos;Y SERAI ! <span>★</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Pied du badge : Nom du participant et QR Code optique */}
      <div className="relative z-10 flex items-end justify-between gap-3 pt-2">
        {/* Coordonnées & Statut */}
        <div className="space-y-1 text-left">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#F5B900]/15 border border-[#F5B900]/40 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#FFD84A]">
            <Sparkles size={11} />
            <span>Pass Officiel Participant</span>
          </div>

          <h4 className="font-heading text-2xl sm:text-3xl uppercase tracking-wide text-white leading-tight line-clamp-1">
            {displayName}
          </h4>

          <div className="flex flex-wrap items-center gap-x-2 text-[10px] sm:text-xs text-cn-gray-300 font-mono">
            <span>N° {ticketNumber}</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 size={12} /> Entrée Confirmée
            </span>
          </div>
        </div>

        {/* QR Code de contrôle optique */}
        <div className="shrink-0 text-center">
          <div className="rounded-xl border-2 border-[#F5B900] bg-white p-1.5 shadow-lg">
            {qrDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrDataUrl}
                alt={`QR code pour le billet ${ticketNumber}`}
                className="h-16 w-16 sm:h-20 sm:w-20"
              />
            ) : (
              <div className="h-16 w-16 sm:h-20 sm:w-20 flex items-center justify-center bg-gray-100 text-gray-400">
                <QrIcon size={24} />
              </div>
            )}
          </div>
          <span className="mt-1 block text-[8px] font-bold uppercase tracking-wider text-cn-gray-400">
            Pass à scanner
          </span>
        </div>
      </div>
    </div>
  );
}
