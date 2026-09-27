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
    description: "Extrait de la veillée de louange et d'adoration spontanée en studio.",
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
    title: "Chœur en adoration",
    category: "Scène Live",
    aspect: "col-span-1 md:col-span-2",
  },
  {
    title: "Jeunesse fervente",
    category: "Public",
    aspect: "col-span-1",
  },
  {
    title: "Section rythmique & cuivres",
    category: "Musiciens",
    aspect: "col-span-1",
  },
  {
    title: "Temps d'intercession communautaire",
    category: "Prière",
    aspect: "col-span-1 md:col-span-2",
  },
  {
    title: "Explosion de joie & drapeaux",
    category: "Célébration",
    aspect: "col-span-1",
  },
];

const DOWNLOADS = [
  {
    title: "Affiche Officielle A3 & A4 (Haute Résolution)",
    format: "PDF / 300 DPI",
    size: "18 Mo",
    type: "Impression",
  },
  {
    title: "Pack Réseaux Sociaux (Story, Post Carré, Bannière Facebook)",
    format: "ZIP / PNG",
    size: "42 Mo",
    type: "Digital",
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
    <div className="min-h-screen bg-[#17165A] text-white">
      {/* Hero Header */}
      <section className="relative overflow-hidden px-4 pt-20 pb-16 sm:px-6 lg:px-8 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[#38217F]/60 blur-[130px]"
        />
        <div className="relative mx-auto max-w-4xl">
          <p className="font-body text-xs font-bold uppercase tracking-[0.3em] text-[#F5B900]">
            Images & Extraits
          </p>
          <h1 className="mt-4 font-heading text-5xl sm:text-7xl uppercase tracking-wider text-white">
            Médias & Galerie
          </h1>
          <p className="mt-4 font-body text-base sm:text-lg text-cn-gray-300 max-w-2xl mx-auto">
            Revivez les moments forts en images, découvrez les vidéos de louange et téléchargez
            les supports de communication pour votre communauté.
          </p>
        </div>
      </section>

      {/* Section Vidéos */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Video className="text-[#F5B900]" size={22} />
            <h2 className="font-heading text-2xl sm:text-3xl uppercase tracking-wide">
              Extraits & Teasers
            </h2>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {VIDEOS.map((vid, idx) => (
            <div
              key={idx}
              className="group rounded-2xl border border-white/10 bg-[#111111]/60 overflow-hidden backdrop-blur-sm transition-all hover:border-[#F5B900]/60 hover:-translate-y-1"
            >
              {/* Vignette vidéo élégante */}
              <div className="relative h-48 bg-gradient-to-br from-[#38217F] to-[#17165A] flex items-center justify-center">
                <div className="h-16 w-16 rounded-full bg-[#F5B900] text-[#111111] flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110">
                  <Play size={26} className="fill-[#111111] ml-1" />
                </div>
                <span className="absolute bottom-3 right-3 rounded bg-black/70 px-2 py-0.5 text-[11px] font-semibold text-white">
                  {vid.duration}
                </span>
                <span className="absolute top-3 left-3 rounded-full bg-[#38217F] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#FFD84A] border border-white/10">
                  {vid.tag}
                </span>
              </div>

              <div className="p-6">
                <h3 className="font-heading text-xl uppercase tracking-wide text-white group-hover:text-[#F5B900] transition-colors">
                  {vid.title}
                </h3>
                <p className="mt-2 text-xs text-cn-gray-300 leading-relaxed">
                  {vid.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Galerie Photos */}
      <section className="bg-[#111111]/50 border-y border-white/10 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-2 border-b border-white/10 pb-4">
            <ImageIcon className="text-[#F5B900]" size={22} />
            <h2 className="font-heading text-2xl sm:text-3xl uppercase tracking-wide">
              Instantanés de Ferveur
            </h2>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {PHOTO_GALLERY.map((photo, idx) => (
              <div
                key={idx}
                className={`${photo.aspect} relative h-64 rounded-2xl border border-white/10 overflow-hidden bg-gradient-to-tr from-[#38217F]/80 via-[#17165A] to-[#5A35A8]/50 p-6 flex flex-col justify-end group`}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="relative z-10">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#F5B900]">
                    {photo.category}
                  </span>
                  <h3 className="font-heading text-2xl uppercase tracking-wide text-white">
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
        <div className="flex items-center gap-2 border-b border-white/10 pb-4">
          <Download className="text-[#F5B900]" size={22} />
          <h2 className="font-heading text-2xl sm:text-3xl uppercase tracking-wide">
            Kit Média & Téléchargements
          </h2>
        </div>

        <p className="mt-4 text-sm text-cn-gray-300">
          Responsables de jeunesse, pasteurs et médias : téléchargez gratuitement nos ressources
          officielles pour relayer l&apos;événement au sein de vos assemblées.
        </p>

        <div className="mt-8 space-y-4">
          {DOWNLOADS.map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-white/10 bg-[#111111]/40 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#F5B900]/40 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-[#38217F] border border-[#5A35A8] flex items-center justify-center text-[#F5B900] shrink-0 mt-0.5">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="font-heading text-lg sm:text-xl uppercase tracking-wide text-white">
                    {item.title}
                  </h3>
                  <div className="mt-1 flex items-center gap-3 text-xs text-cn-gray-500">
                    <span>{item.type}</span>
                    <span>•</span>
                    <span>{item.format}</span>
                    <span>•</span>
                    <span className="text-[#F5B900]">{item.size}</span>
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
            className="inline-flex items-center gap-2 rounded-md bg-[#F5B900] px-8 py-4 font-body text-xs font-bold uppercase tracking-widest text-[#111111] shadow-xl hover:bg-[#FFD84A] transition-all hover:scale-105"
          >
            Réserver mon billet d&apos;entrée <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
