import type { Metadata } from "next";
import { Download, Image as ImageIcon, Video, FileText } from "lucide-react";
import MediaDownloadButton from "@/components/media/MediaDownloadButton";
import Button from "@/components/ui/Button";
import MediaPhotoGallery from "@/components/media/MediaPhotoGallery";
import MediaVideoSection from "@/components/media/MediaVideoSection";

export const metadata: Metadata = {
  title: "Médias & Ressources — CELEBRATION NIGHT 2026",
  description:
    "Galerie photos, vidéos de louange, teasers et kit média officiel pour CELEBRATION Night et HAGIAZO Ministry.",
};

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
        <div className="flex flex-col items-center text-center pb-8">
          <div className="flex items-center justify-center gap-2">
            <Video className="text-cn-gold" size={24} />
            <h2 className="font-heading text-2xl sm:text-4xl uppercase tracking-wide">
              Extraits &amp; Teasers
            </h2>
          </div>
          <p className="mt-2 text-sm text-cn-gray-300 max-w-xl">
            Vivez l&apos;expérience CELEBRATION NIGHT à travers nos sessions live et podcasts exclusifs.
          </p>
        </div>

        <MediaVideoSection />
      </section>

      {/* Galerie Photos Réelles */}
      <section className="bg-cn-dark px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/10 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ImageIcon className="text-cn-gold" size={22} />
                <span className="font-body text-xs font-bold uppercase tracking-[0.2em] text-cn-gold">
                  Archives officielles
                </span>
              </div>
              <h2 className="font-heading text-3xl sm:text-5xl uppercase tracking-wide text-white">
                Instantanés de Ferveur &amp; d&apos;Adoration
              </h2>
            </div>
            <p className="font-body text-sm text-cn-gray-300 max-w-md">
              Revivez la puissance spirituelle, la louange spontanée et les visages illuminés par la gloire de Dieu lors des rassemblements CELEBRATION NIGHT.
            </p>
          </div>

          <MediaPhotoGallery />
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

