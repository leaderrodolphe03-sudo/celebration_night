"use client";

export interface SquareBadgeProps {
  fullName: string;
  ticketNumber: string;
  qrToken?: string;
  photoUrl?: string | null;
  className?: string;
}

export default function SquareBadge({
  fullName,
  ticketNumber: _ticketNumber,
  qrToken: _qrToken,
  photoUrl,
  className = "",
}: SquareBadgeProps) {
  const initial = (fullName.trim()[0] || "C").toUpperCase();

  return (
    <div
      className={`relative aspect-[4/5] w-full max-w-[390px] sm:max-w-[420px] rounded-3xl overflow-hidden shadow-2xl select-none bg-[#120520] ${className}`}
      style={{
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
      }}
    >
      {/* 1. Cadre pour la photo du participant placé sous la découpe transparente */}
      <div
        className="absolute rounded-[1.2rem] sm:rounded-[1.6rem] overflow-hidden bg-gradient-to-br from-[#2D0A4E] via-[#1A0630] to-[#0D0218] flex flex-col items-center justify-center pointer-events-none"
        style={{
          left: "5.65%",
          top: "17.07%",
          width: "44.54%",
          height: "43.26%",
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
            <div className="h-14 w-14 sm:h-20 sm:w-20 rounded-full border border-dashed border-white/30 flex items-center justify-center text-white/50 backdrop-blur-sm bg-black/20">
              <span className="font-heading text-2xl sm:text-4xl text-white/40 leading-none">
                {initial}
              </span>
            </div>
            <span className="mt-3 font-body text-[9px] sm:text-xs font-semibold tracking-wider text-white/70 uppercase">
              Ajoute ta photo
            </span>
          </div>
        )}
      </div>

      {/* 2. Nouveau visuel officiel complet avec découpe transparente pour la photo */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/badge_template_2026.png"
        alt="Affiche officielle Celebration Night — J'y serai"
        className="absolute inset-0 h-full w-full object-cover pointer-events-none z-10"
      />
    </div>
  );
}
