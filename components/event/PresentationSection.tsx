import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Music2, Heart, Play } from "lucide-react";

export default function PresentationSection() {
  return (
    <section className="bg-[#080808] px-5 py-24 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">

        {/* En-tête éditorial */}
        <div className="mb-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-end">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-6 bg-[#F59E0B]" />
              <span className="font-body text-[11px] font-bold uppercase tracking-[0.2em] text-[#F59E0B]">
                L&apos;Esprit de la Veillée
              </span>
            </div>
            <h2 className="font-heading text-[clamp(2.5rem,6vw,5rem)] uppercase leading-[0.9] tracking-wide text-white">
              Une Rencontre<br />d&apos;Adoration<br />
              <span className="text-[#F59E0B]">Vivante</span>
            </h2>
          </div>
          <div className="lg:pt-8">
            <p className="font-body text-base sm:text-lg leading-relaxed text-[#BFB89E] max-w-lg">
              <strong className="text-white font-semibold">CÉLÉBRATION NIGHT</strong> est un rendez-vous annuel
              d&apos;impact spirituel, de proclamation de la Parole, d&apos;excellence musicale
              et de communion fraternelle porté par HAGIAZO Ministry.
            </p>
          </div>
        </div>

        {/* Image principale — pleine largeur */}
        <div className="group relative overflow-hidden rounded-lg border border-white/10 hover:border-[#F59E0B]/40 transition-colors shadow-2xl">
          <div className="relative aspect-[16/8] w-full">
            <Image
              src="/images/worship-bg.jpg"
              alt="Collectif de louange Célébration Night sur scène avec l'assemblée"
              fill
              className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
              priority
            />
            {/* Voile sombre cinématographique en bas */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/40 to-transparent" />

            {/* Overlay de survol avec Play */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="h-16 w-16 rounded-full bg-[#F59E0B] flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.7)] group-hover:scale-110 transition-transform">
                <Play size={22} className="text-[#080808] ml-1" fill="#080808" />
              </div>
            </div>
          </div>

          {/* Légende en bas de l'image */}
          <div className="absolute bottom-0 inset-x-0 px-6 sm:px-10 py-7 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-sm bg-[#F59E0B] px-3 py-1 font-body text-[10px] font-bold uppercase tracking-wider text-[#080808] mb-2 shadow-sm">
                <Music2 size={11} />
                Live Worship &amp; Scène
              </span>
              <h3 className="font-heading text-xl sm:text-3xl uppercase tracking-wide text-white">
                Une Louange Passionnée &amp; Sans Compromis
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-[#BFB89E]">
                Chantres, musiciens et peuple réunis sous l&apos;onction pour élever le Roi des rois.
              </p>
            </div>
            <Link
              href="/medias"
              className="shrink-0 flex items-center gap-2 rounded-sm bg-[#120E0A]/90 border border-[#F59E0B]/30 px-5 py-2.5 font-body text-xs font-bold uppercase tracking-wider text-[#FCD34D] backdrop-blur-md hover:bg-[#F59E0B] hover:text-[#080808] hover:border-[#F59E0B] transition-all shadow-lg"
            >
              <span>Découvrir les médias</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* Deux images secondaires */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="group relative overflow-hidden rounded-lg aspect-[16/10] border border-white/8 hover:border-[#F59E0B]/40 transition-colors">
            <Image
              src="/images/gallery/photo-4.jpg"
              alt="Chantre soliste féminine en ferveur"
              fill
              className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/90 via-[#080808]/30 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
              <div>
                <span className="block font-body text-[10px] font-bold uppercase tracking-wider text-[#F59E0B] mb-1">
                  Chantre Soliste
                </span>
                <span className="font-heading text-base sm:text-lg uppercase tracking-wider text-white">
                  Voix de Louange &amp; Ferveur
                </span>
              </div>
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-lg aspect-[16/10] border border-white/8 hover:border-[#F59E0B]/40 transition-colors">
            <Image
              src="/images/gallery/photo-3.jpg"
              alt="Assemblée les mains levées en prière"
              fill
              className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/90 via-[#080808]/30 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
              <div>
                <span className="block font-body text-[10px] font-bold uppercase tracking-wider text-[#F59E0B] mb-1">
                  Adoration Vivante
                </span>
                <span className="font-heading text-base sm:text-lg uppercase tracking-wider text-white">
                  L&apos;Assemblée les Mains Levées
                </span>
              </div>
            </div>
          </div>
        </div>


      </div>
    </section>
  );
}
