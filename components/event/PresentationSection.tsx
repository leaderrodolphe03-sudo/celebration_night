import Image from "next/image";
import { Play } from "lucide-react";
import Button from "@/components/ui/Button";

export default function PresentationSection() {
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
              <strong className="text-cn-black font-semibold">CÉLÉBRATION NIGHT</strong> est un rendez-vous annuel
              d&apos;impact spirituel, de proclamation de la Parole, d&apos;excellence musicale
              et de communion fraternelle porté par HAGIAZO Ministry.
            </p>
          </div>
        </div>

        {/* Image principale — pleine largeur épurée */}
        <div className="group relative overflow-hidden rounded-2xl border border-[#E5DACF] shadow-[0_20px_50px_rgba(28,22,19,0.10)] hover:border-cn-gold/70 transition-all duration-300">
          <div className="relative aspect-[16/8] w-full">
            <Image
              src="/images/worship-bg.jpg"
              alt="Collectif de louange Célébration Night sur scène avec l'assemblée"
              fill
              className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.01]"
              priority
            />
            {/* Voile sombre cinématographique doux en bas pour le texte */}
            <div className="absolute inset-0 bg-gradient-to-t from-cn-black/95 via-cn-black/40 to-transparent" />

            {/* Bouton Play au survol */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="h-16 w-16 rounded-full bg-cn-gold flex items-center justify-center shadow-gold group-hover:scale-110 transition-transform">
                <Play size={22} className="text-cn-black ml-1" fill="#1C1613" />
              </div>
            </div>
          </div>

          {/* Légende en bas de l'image (sans badge superposé) */}
          <div className="absolute bottom-0 inset-x-0 px-6 sm:px-10 py-7 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
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
