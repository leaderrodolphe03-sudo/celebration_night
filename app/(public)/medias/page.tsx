import type { Metadata } from "next";
import { Play, Download, Image as ImageIcon, Video, FileText } from "lucide-react";
import MediaDownloadButton from "@/components/media/MediaDownloadButton";
import Button from "@/components/ui/Button";

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
    <div className="min-h-screen bg-cn-black text-white">
      {/* Hero Header */}
      <section className="relative overflow-hidden px-4 pt-24 pb-16 sm:px-6 lg:px-8 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-cn-gold/10 blur-[130px]"
        />
        <div className="relative mx-auto max-w-4xl">
          <p className="font-body text-xs font-bold uppercase tracking-[0.3em] text-cn-gold">
            Images &amp; Extraits
          </p>
          <h1 className="mt-4 font-heading text-5xl sm:text-7xl uppercase tracking-wider text-white">
            Médias &amp; Galerie
          </h1>
          <p className="mt-4 font-body text-base sm:text-lg text-cn-gray-300 max-w-2xl mx-auto">
            Revivez les moments forts en images réelles, découvrez les vidéos de louange et téléchargez
            les affiches officielles pour votre communauté.
          </p>
        </div>
      </section>

      {/* Section Vidéos */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-4">
          <div className="flex items-center gap-2">
            <Video className="text-cn-gold" size={22} />
            <h2 className="font-heading text-2xl sm:text-3xl uppercase tracking-wide">
              Extraits &amp; Teasers
            </h2>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {VIDEOS.map((vid, idx) => (
            <div
              key={idx}
              className="group rounded-2xl border border-white/10 bg-cn-dark overflow-hidden transition-all hover:border-cn-gold/40 hover:-translate-y-1 shadow-lg"
            >
              {/* Vignette vidéo épurée (sans badge de catégorie superposé) */}
              <div className="relative h-48 bg-gradient-to-br from-cn-deep to-cn-black flex items-center justify-center">
                <div className="h-16 w-16 rounded-full bg-cn-gold text-cn-black flex items-center justify-center shadow-gold transition-transform group-hover:scale-110">
                  <Play size={24} className="fill-[#1C1613] ml-1 text-cn-black" />
                </div>
                <span className="absolute bottom-3 right-3 rounded-md bg-black/80 px-2 py-0.5 text-[11px] font-semibold text-white">
                  {vid.duration}
                </span>
              </div>

              <div className="p-6">
                <h3 className="font-heading text-xl uppercase tracking-wide text-white group-hover:text-cn-gold-light transition-colors">
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

      {/* Galerie Photos Réelles (sans badges superposés) */}
      <section className="bg-cn-dark px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-2 pb-4">
            <ImageIcon className="text-cn-gold" size={22} />
            <h2 className="font-heading text-2xl sm:text-3xl uppercase tracking-wide">
              Instantanés de Ferveur &amp; d&apos;Adoration
            </h2>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {PHOTO_GALLERY.map((photo, idx) => (
              <div
                key={idx}
                className={`${photo.aspect} relative h-72 rounded-2xl border border-white/10 overflow-hidden bg-cn-deep p-6 flex flex-col justify-end group shadow-xl hover:border-cn-gold/40 transition-all`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.src}
                  alt={photo.title}
                  className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cn-black/90 via-cn-black/30 to-transparent" />
                <div className="relative z-10">
                  <h3 className="font-heading text-2xl uppercase tracking-wide text-white group-hover:text-cn-gold-light transition-colors">
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
        <div className="flex items-center gap-2 pb-4">
          <Download className="text-cn-gold" size={22} />
          <h2 className="font-heading text-2xl sm:text-3xl uppercase tracking-wide">
            Affiches &amp; Kit Média Officiel
          </h2>
        </div>

        <p className="mt-4 text-sm text-cn-gray-300">
          Responsables de jeunesse, pasteurs et médias : téléchargez gratuitement les visuels officiels
          pour relayer l&apos;événement au sein de vos assemblées.
        </p>

        <div className="mt-8 space-y-4">
          {DOWNLOADS.map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-white/10 bg-cn-dark p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-cn-gold/40 transition-colors shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-cn-deep border border-cn-gold/30 flex items-center justify-center text-cn-gold shrink-0 mt-0.5">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="font-heading text-lg sm:text-xl uppercase tracking-wide text-white">
                    {item.title}
                  </h3>
                  <div className="mt-1 flex items-center gap-3 text-xs text-cn-gray-400">
                    <span>{item.type}</span>
                    <span>•</span>
                    <span>{item.format}</span>
                    <span>•</span>
                    <span className="text-cn-gold font-semibold">{item.size}</span>
                  </div>
                </div>
              </div>

              <MediaDownloadButton title={item.title} />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Button
            href="/inscription"
            variant="primary"
            size="lg"
          >
            Réserver mon billet d&apos;entrée
          </Button>
        </div>
      </section>
    </div>
  );
}

