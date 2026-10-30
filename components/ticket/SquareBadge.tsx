"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { QrCode as QrIcon } from "lucide-react";

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
        dark: "#080808",
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
      className={`relative aspect-square w-full max-w-[480px] rounded-3xl overflow-hidden shadow-2xl select-none ${className}`}
      style={{
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6)",
      }}
    >
      {/* 1. Visuel d'arrière-plan officiel Celebration Night */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/badge_template_clean.png"
        alt="Affiche officielle Celebration Night"
        className="absolute inset-0 h-full w-full object-cover pointer-events-none"
      />

      {/* 2. Cadre propre et léger pour la photo du participant (aligné avec l'affiche) */}
      <div
        className="absolute rounded-xl sm:rounded-2xl overflow-hidden border border-white/25 sm:border-white/30 bg-black/20 shadow-lg flex flex-col items-center justify-end pointer-events-none"
        style={{
          left: "2.22%",
          top: "16.67%",
          width: "50.00%",
          height: "62.22%",
        }}
      >
        {photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoUrl}
            alt="Photo participant"
            className="h-full w-full object-cover object-center"
          />
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center p-4 text-center">
            <div className="h-16 w-16 sm:h-24 sm:w-24 rounded-full border border-dashed border-white/30 flex items-center justify-center text-white/50 backdrop-blur-sm bg-black/20">
              <span className="font-heading text-3xl sm:text-5xl text-white/40 leading-none">
                {initial}
              </span>
            </div>
            <span className="mt-3 font-body text-[9px] sm:text-xs font-semibold tracking-wider text-white/70 uppercase">
              Ajoute ta photo
            </span>
          </div>
        )}
      </div>

      {/* 3. Calque de premier plan : J'Y SERAI en 3D, bandeau date, logos et flyer au-dessus de la photo */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/badge_foreground.png"
        alt="Premier plan officiel Celebration Night"
        className="absolute inset-0 h-full w-full object-cover pointer-events-none z-10"
      />

      {/* 4. QR Code officiel dynamique positionné au millimètre sur la carte blanche */}
      <div
        className="absolute flex items-center justify-center pointer-events-none z-20"
        style={{
          left: "78.98%",
          top: "77.13%",
          width: "16.30%",
          height: "16.30%",
        }}
      >
        {qrDataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={qrDataUrl}
            alt={`QR code pour le billet ${ticketNumber}`}
            className="h-full w-full object-contain mix-blend-multiply"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-cn-dark">
            <QrIcon size={20} />
          </div>
        )}
      </div>
    </div>
  );
}
