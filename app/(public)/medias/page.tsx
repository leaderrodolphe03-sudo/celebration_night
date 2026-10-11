import { Metadata } from "next";
import Link from "next/link";
import { Play, Download, Image as ImageIcon, Video, FileText, ArrowRight } from "lucide-react";
import MediaDownloadButton from "@/components/media/MediaDownloadButton";

export const metadata: Metadata = {
  title: "Médias & Ressources — CÉLÉBRATION NIGHT 2026",
  description:
    "Galerie photos, vidéos de louange, teasers et kit média officiel pour Célébration Night et HAGIAZO Ministry.",
};

const VIDEOS = [
  {
    title: "Teaser Officiel — Célébration Night 2026",
    duration: "02:15",
    description: "La bande-annonce officielle dévoilant l'esprit, le lieu et les intervenants.",
    tag: "Teaser",
  },
  {
    title: "Session Live — « Brûle en moi » (HAGIAZO)",
    duration: "08:40",
    description: "Extrait de la veillée de louange et d'adoration spontanée en direct.",
    tag: "Live Worship",
  },
  {
    title: "Rétrospective — Édition Précédente",
    duration: "05:12",
    description: "Retour en images sur les temps forts, les baptêmes de l'Esprit et les témoignages.",
    tag: "Aftermovie",
  },
];

const PHOTO_GALLERY = [
  {
    title: "Grand Chœur de Louange HAGIAZO",
    category: "Scène Live",
    src: "/images/gallery/photo-1.jpg",
    aspect: "col-span-1 md:col-span-2",
  },
  {
    title: "Section Claviers & Synthés",
    category: "Musiciens",
    src: "/images/gallery/photo-2.jpg",
    aspect: "col-span-1",
  },
  {
    title: "L'Assemblée les mains levées vers le ciel",
    category: "Adoration",
    src: "/images/gallery/photo-3.jpg",
    aspect: "col-span-1",
  },
  {
    title: "Chantre soliste en ferveur spirituelle",
    category: "Louange",
    src: "/images/gallery/photo-4.jpg",
    aspect: "col-span-1 md:col-span-2",
  },
  {
    title: "Section Percussions & Batterie sacrée",
    category: "Rythmique",
    src: "/images/gallery/photo-5.jpg",
    aspect: "col-span-1",
  },
  {
    title: "Prière d'Intercession & Humiliation",
    category: "Intercession",
    src: "/images/gallery/photo-6.jpg",
    aspect: "col-span-1 md:col-span-2",
  },
];

const DOWNLOADS = [
  {
    title: "Affiche Officielle — Chantre MANNE (Format A3/A4)",
    format: "JPEG / 300 DPI",
    size: "Haute Résolution",
    type: "Affiche Officielle",
  },
  {
    title: "Affiche Officielle — Groupe Musical Jeunesse SIKECODJI",
    format: "JPEG / 300 DPI",
    size: "Haute Résolution",
    type: "Affiche Officielle",
  },
  {
    title: "Dossier de Presse & Présentation HAGIAZO Ministry",
    format: "PDF Professionnel",
    size: "6 Mo",
    type: "Presse & Partenaires",
  },
];

export default function MediasPage() {
  return (
    <div className="min-h-screen bg-[#080808] text-white">
      {/* Hero Header */}
      <section className="relative overflow-hidden px-4 pt-24 pb-16 sm:px-6 lg:px-8 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[#F59E0B]/10 blur-[130px]"
        />
        <div className="relative mx-auto max-w-4xl">
          <p className="font-body text-xs font-bold uppercase tracking-[0.3em] text-[#F59E0B]">
            Images &amp; Extraits
          </p>
          <h1 className="mt-4 font-heading text-5xl sm:text-7xl uppercase tracking-wider text-white">
            Médias &amp; Galerie
          </h1>
          <p className="mt-4 font-body text-base sm:text-lg text-[#BFB89E] max-w-2xl mx-auto">
            Revivez les moments forts en images réelles, découvrez les vidéos de louange et téléchargez
            les affiches officielles pour votre communauté.
          </p>
        </div>
      </section>

      {/* Section Vidéos */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between border-b border-white/8 pb-4">
          <div className="flex items-center gap-2">
            <Video className="text-[#F59E0B]" size={22} />
            <h2 className="font-heading text-2xl sm:text-3xl uppercase tracking-wide">
              Extraits &amp; Teasers
            </h2>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {VIDEOS.map((vid, idx) => (
            <div
              key={idx}
              className="group rounded-xl border border-white/8 bg-[#120E0A] overflow-hidden backdrop-blur-sm transition-all hover:border-[#F59E0B]/50 hover:-translate-y-1 shadow-lg"
            >
              {/* Vignette vidéo élégante */}
              <div className="relative h-48 bg-gradient-to-br from-[#1A1410] to-[#0A0806] flex items-center justify-center">
                <div className="h-16 w-16 rounded-full bg-[#F59E0B] text-[#080808] flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-transform group-hover:scale-110">
                  <Play size={24} className="fill-[#080808] ml-1 text-[#080808]" />
                </div>
                <span className="absolute bottom-3 right-3 rounded bg-black/80 px-2 py-0.5 text-[11px] font-semibold text-white">
                  {vid.duration}
                </span>
                <span className="absolute top-3 left-3 rounded-full bg-[#1A1410] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#FCD34D] border border-[#F59E0B]/40">
                  {vid.tag}
                </span>
              </div>

              <div className="p-6">
                <h3 className="font-heading text-xl uppercase tracking-wide text-white group-hover:text-[#FCD34D] transition-colors">
                  {vid.title}
                </h3>
                <p className="mt-2 text-xs text-[#BFB89E] leading-relaxed">
                  {vid.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Galerie Photos Réelles */}
      <section className="bg-[#0D0A08] border-y border-white/8 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-2 border-b border-white/8 pb-4">
            <ImageIcon className="text-[#F59E0B]" size={22} />
            <h2 className="font-heading text-2xl sm:text-3xl uppercase tracking-wide">
              Instantanés de Ferveur &amp; d&apos;Adoration
            </h2>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {PHOTO_GALLERY.map((photo, idx) => (
              <div
                key={idx}
                className={`${photo.aspect} relative h-72 rounded-xl border border-white/10 overflow-hidden bg-[#120E0A] p-6 flex flex-col justify-end group shadow-xl hover:border-[#F59E0B]/50 transition-all`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.src}
                  alt={photo.title}
                  className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="relative z-10">
                  <span className="inline-block rounded-xs bg-[#F59E0B]/20 border border-[#F59E0B]/40 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-[#FCD34D] mb-1.5">
                    {photo.category}
                  </span>
                  <h3 className="font-heading text-2xl uppercase tracking-wide text-white group-hover:text-[#FCD34D] transition-colors">
                    {photo.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kit Média Téléchargeable */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 border-b border-white/8 pb-4">
          <Download className="text-[#F59E0B]" size={22} />
          <h2 className="font-heading text-2xl sm:text-3xl uppercase tracking-wide">
            Affiches &amp; Kit Média Officiel
          </h2>
        </div>

        <p className="mt-4 text-sm text-[#BFB89E]">
          Responsables de jeunesse, pasteurs et médias : téléchargez gratuitement les visuels officiels
          pour relayer l&apos;événement au sein de vos assemblées.
        </p>

        <div className="mt-8 space-y-4">
          {DOWNLOADS.map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-white/8 bg-[#120E0A] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#F59E0B]/40 transition-colors shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-[#1A1410] border border-[#F59E0B]/30 flex items-center justify-center text-[#F59E0B] shrink-0 mt-0.5">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="font-heading text-lg sm:text-xl uppercase tracking-wide text-white">
                    {item.title}
                  </h3>
                  <div className="mt-1 flex items-center gap-3 text-xs text-[#7D7560]">
                    <span>{item.type}</span>
                    <span>•</span>
                    <span>{item.format}</span>
                    <span>•</span>
                    <span className="text-[#F59E0B] font-semibold">{item.size}</span>
                  </div>
                </div>
              </div>

              <MediaDownloadButton title={item.title} />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/inscription"
            className="inline-flex items-center gap-2 rounded-sm bg-[#F59E0B] px-8 py-4 font-body text-xs font-bold uppercase tracking-widest text-[#080808] shadow-xl hover:bg-[#FCD34D] hover:shadow-[0_4px_25px_rgba(245,158,11,0.5)] transition-all hover:scale-105"
          >
            Réserver mon billet d&apos;entrée <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}

