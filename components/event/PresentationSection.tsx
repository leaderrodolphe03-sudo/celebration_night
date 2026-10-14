"use client";

import { useState, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";
import Button from "@/components/ui/Button";

export default function PresentationSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleSound = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
    }
  };

  return (
    <section className="relative bg-gradient-to-b from-[#FAF7F2] via-[#F6F1EA] to-[#FAF7F2] px-5 py-24 sm:px-8 lg:px-10 overflow-hidden">
      {/* Halo lumineux chaud d'arrière-plan */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-1/4 h-96 w-96 rounded-full bg-amber-200/30 blur-[130px]"
      />

      <div className="relative mx-auto max-w-7xl">
        {/* En-tête éditorial épuré */}
        <div className="mb-14 grid grid-cols-1 lg:grid-cols-2 gap-8 items-end">
          <div>
            <h2 className="font-heading text-4xl sm:text-6xl lg:text-7xl uppercase tracking-wider text-cn-black leading-[0.95]">
              Une Rencontre<br />d&apos;Adoration <span className="text-cn-amber">Vivante</span>
            </h2>
          </div>
          <div className="lg:pt-8">
            <p className="font-body text-base sm:text-lg leading-relaxed text-[#5A4D41] max-w-lg">
              <strong className="text-cn-black font-semibold">CELEBRATION NIGHT</strong> est un rendez-vous annuel
              d&apos;impact spirituel, de proclamation de la Parole, d&apos;excellence musicale
              et de communion fraternelle porté par HAGIAZO Ministry.
            </p>
          </div>
        </div>

        {/* Vidéo principale — pleine largeur épurée avec autoplay et contrôle son */}
        <div className="group relative overflow-hidden rounded-2xl border border-[#E5DACF] shadow-[0_20px_50px_rgba(28,22,19,0.10)] hover:border-cn-gold/70 transition-all duration-300 bg-cn-black">
          <div className="relative aspect-[16/9] md:aspect-[16/8] w-full overflow-hidden">
            <video
              ref={videoRef}
              src="/images/XKOZ4098.MP4"
              poster="/images/worship-bg.jpg"
              autoPlay
              loop
              muted={isMuted}
              playsInline
              preload="metadata"
              className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.01]"
            />

            {/* Voile sombre cinématographique doux en bas pour le texte */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-cn-black/95 via-cn-black/40 to-transparent" />

            {/* Bouton d'activation/désactivation du son */}
            <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-20">
              <button
                type="button"
                onClick={toggleSound}
                className="group/sound flex items-center gap-2.5 rounded-full bg-cn-black/80 backdrop-blur-md px-4 py-2.5 text-xs font-semibold tracking-wider text-white border border-white/20 shadow-[0_8px_20px_rgba(0,0,0,0.4)] hover:bg-cn-black hover:border-cn-gold hover:text-cn-gold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cn-gold"
                aria-label={isMuted ? "Activer le son" : "Couper le son"}
              >
                {isMuted ? (
                  <>
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 group-hover/sound:bg-cn-gold group-hover/sound:text-cn-black transition-colors">
                      <VolumeX size={14} />
                    </span>
                    <span className="font-medium">Activer le son</span>
                  </>
                ) : (
                  <>
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cn-gold text-cn-black transition-colors">
                      <Volume2 size={14} className="animate-pulse" />
                    </span>
                    <span className="font-medium text-cn-gold">Son activé</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Légende en bas de la vidéo */}
          <div className="absolute bottom-0 inset-x-0 px-6 sm:px-10 py-7 flex flex-col sm:flex-row sm:items-end justify-between gap-4 z-10 pointer-events-auto">
            <div>
              <h3 className="font-heading text-2xl sm:text-3xl uppercase tracking-wide text-white">
                Une Louange Passionnée &amp; Sans Compromis
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-cn-gray-300">
                Chantres, musiciens et peuple réunis sous l&apos;onction pour élever le Roi des rois.
              </p>
            </div>
            <Button
              href="/medias"
              variant="outline"
              size="sm"
              className="shrink-0 rounded-md"
            >
              Découvrir les médias
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
