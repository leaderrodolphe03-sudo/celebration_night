import type { Metadata } from "next";
import Image from "next/image";
import { Camera } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { PhotoGrid } from "@/components/site/PhotoGrid";
import { GALLERY, PAST_EDITIONS } from "@/lib/content";
import { getEditionPhotos } from "@/lib/gallery";

export const metadata: Metadata = {
  title: "Galerie",
  description: "Photos, affiches et vidéos officielles de CELEBRATION NIGHT.",
};

export default function GalleryPage() {
  const years = [...new Set(GALLERY.map((g) => g.year))].sort((a, b) => b - a);

  return (
    <>
      <PageHeader
        eyebrow="Galerie"
        title="Photos & vidéos"
        intro="Les visuels officiels des éditions de CELEBRATION NIGHT. Les photos et vidéos de chaque soirée seront ajoutées ici."
      />

      <div className="mx-auto max-w-6xl space-y-16 px-4 py-16 sm:px-6 sm:py-24">
        {years.map((year) => (
          <section key={year} aria-labelledby={`annee-${year}`}>
            <h2 id={`annee-${year}`} className="font-heading text-4xl uppercase tracking-wide">
              Édition <span className="text-primary">{year}</span>
            </h2>
            <PhotoGrid
              className="mt-8"
              photos={getEditionPhotos(year)}
              credit={PAST_EDITIONS.find((e) => e.year === year)?.photoCredit}
            />
            <h3 className="mt-12 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              Visuels officiels
            </h3>
            <ul className="mt-4 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>li]:mb-4">
              {GALLERY.filter((g) => g.year === year).map((item, i) => (
                <li key={item.src} className="break-inside-avoid">
                  <Reveal delay={i * 80}>
                    <a
                      href={item.src}
                      target="_blank"
                      rel="noopener"
                      className="group block overflow-hidden rounded-2xl border border-border focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                    >
                      <Image
                        src={item.src}
                        alt={item.alt}
                        width={item.width}
                        height={item.height}
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="h-auto w-full transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                      <span className="sr-only">(ouvrir en grand dans un nouvel onglet)</span>
                    </a>
                  </Reveal>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <p className="flex items-center gap-3 rounded-2xl border border-dashed border-border p-6 text-muted-foreground">
          <Camera className="size-6 shrink-0 text-primary" aria-hidden />
          Les photos et vidéos de la soirée 2026 seront publiées après l&apos;événement.
        </p>
      </div>
    </>
  );
}
