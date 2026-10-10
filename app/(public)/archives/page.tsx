import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Clock, MapPin, Users } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { PhotoGrid } from "@/components/site/PhotoGrid";
import { PAST_EDITIONS } from "@/lib/content";
import { getEditionPhotos } from "@/lib/gallery";

export const metadata: Metadata = {
  title: "Archives",
  description: "Les éditions précédentes de CELEBRATION NIGHT.",
};

export default function ArchivesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Archives"
        title="Les éditions précédentes"
        intro="Chaque édition a laissé une empreinte. Retour sur les nuits de louange passées."
      />

      <div className="mx-auto max-w-6xl space-y-20 px-4 py-16 sm:px-6 sm:py-24">
        {PAST_EDITIONS.map((edition) => (
          <article key={edition.year} id={`edition-${edition.year}`} className="space-y-12">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
              <Reveal>
                <p className="font-heading text-7xl leading-none text-primary sm:text-8xl">
                  {edition.year}
                </p>
                <h2 className="mt-4 font-heading text-4xl uppercase leading-none tracking-wide sm:text-5xl">
                  {edition.theme}
                </h2>
                <p className="mt-2 text-muted-foreground">{edition.verse}</p>

                <dl className="mt-8 space-y-4 text-sm">
                  <div className="flex gap-3">
                    <dt>
                      <CalendarDays className="size-5 text-primary" aria-label="Date" />
                    </dt>
                    <dd>{edition.dateLabel}</dd>
                  </div>
                  <div className="flex gap-3">
                    <dt>
                      <Clock className="size-5 text-primary" aria-label="Heure" />
                    </dt>
                    <dd>{edition.timeLabel}</dd>
                  </div>
                  <div className="flex gap-3">
                    <dt>
                      <MapPin className="size-5 shrink-0 text-primary" aria-label="Lieu" />
                    </dt>
                    <dd>{edition.place}</dd>
                  </div>
                  <div className="flex gap-3">
                    <dt>
                      <Users className="size-5 shrink-0 text-primary" aria-label="Organisation" />
                    </dt>
                    <dd>{edition.organizer}</dd>
                  </div>
                </dl>

                <h3 className="mt-8 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                  Chantres invités
                </h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {edition.guests.map((g) => (
                    <li
                      key={g}
                      className="rounded-full border border-border bg-card px-4 py-2 text-sm"
                    >
                      {g}
                    </li>
                  ))}
                  <li className="rounded-full border border-border bg-card px-4 py-2 text-sm">
                    Groupe hôte
                  </li>
                </ul>
              </Reveal>

              <Reveal delay={120} className="grid grid-cols-2 gap-3 self-start">
                {edition.posters.map((p) => (
                  <a
                    key={p.src}
                    href={p.src}
                    target="_blank"
                    rel="noopener"
                    className="block overflow-hidden rounded-2xl border border-border"
                  >
                    <Image
                      src={p.src}
                      alt={p.alt}
                      width={1080}
                      height={1350}
                      sizes="(min-width: 1024px) 28vw, 48vw"
                      className="h-auto w-full"
                    />
                    <span className="sr-only">(ouvrir en grand dans un nouvel onglet)</span>
                  </a>
                ))}
              </Reveal>
            </div>
            <PhotoGrid
              photos={getEditionPhotos(edition.year)}
              credit={edition.photoCredit}
              limit={6}
            />
            <Link
              href="/galerie"
              className="inline-block text-sm font-semibold text-primary hover:underline"
            >
              Toutes les photos dans la galerie →
            </Link>
          </article>
        ))}
      </div>
    </>
  );
}
