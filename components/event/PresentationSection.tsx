import Image from "next/image";
import Link from "next/link";
import { Sparkles, Music, Shield, ArrowRight } from "lucide-react";

export default function PresentationSection() {
  return (
    <section className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 md:px-8">
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#F5B900]">
          L&apos;Esprit de la Veillée
        </span>
        <h2 className="mt-2 font-heading text-4xl sm:text-5xl uppercase tracking-wide text-white">
          Une Rencontre d&apos;Adoration Vivante
        </h2>
        <p className="mx-auto mt-4 max-w-2xl font-body text-base sm:text-lg leading-relaxed text-cn-gray-300">
          <strong className="text-white">CÉLÉBRATION NIGHT</strong> est un rendez-vous annuel
          d&apos;impact spirituel, de proclamation de la Parole, d&apos;excellence musicale et de
          communion fraternelle porté par HAGIAZO Ministry.
        </p>
      </div>

      {/* Photographie officielle du Chœur et de l'Adoration Live */}
      <div className="relative mx-auto mt-12 overflow-hidden rounded-3xl border-2 border-[#F5B900]/40 shadow-[0_20px_60px_rgba(0,0,0,0.7)] group">
        <div className="relative aspect-[16/9] w-full">
          <Image
            src="/images/worship-bg.jpg"
            alt="Collectif de louange HAGIAZO Ministry en adoration en direct"
            fill
            className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />
          {/* Dégradé de fusion textuel en bas */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/30 to-transparent" />
        </div>

        {/* Légende intégrée sur la photo */}
        <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#38217F]/80 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#FFD84A] border border-[#5A35A8]">
              <Sparkles size={12} /> HAGIAZO Live Worship
            </span>
            <h3 className="font-heading text-2xl sm:text-3xl uppercase tracking-wider text-white">
              Une Louange Passionnée & Sans Compromis
            </h3>
            <p className="text-xs text-cn-gray-300 max-w-xl">
              Les voix et instruments se fondent pour élever le Créateur dans la sainteté et l&apos;unité.
            </p>
          </div>

          <Link
            href="/worship-session"
            className="self-start sm:self-auto inline-flex items-center gap-2 rounded-md bg-[#F5B900] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#111111] hover:bg-[#FFD84A] shadow-lg transition-transform hover:scale-105"
          >
            <span>Découvrir les chants</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
