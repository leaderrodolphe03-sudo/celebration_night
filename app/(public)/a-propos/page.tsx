import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal, SectionHeading } from "@/components/site/Reveal";
import { AUDIENCE, EVENT, GENERAL_OBJECTIVE, OBJECTIVES, PROGRAM, VISION } from "@/lib/content";

export const metadata: Metadata = {
  title: "À propos",
  description: VISION,
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="À propos"
        title="Qu'est-ce que CELEBRATION NIGHT ?"
        intro="Une soirée de louange, d'adoration et d'évangélisation, en plein air, de la nuit jusqu'à l'aube."
      />

      <section className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2">
        <Reveal>
          <SectionHeading eyebrow="Vision" title="Un réveil pour la jeunesse" />
          <p className="mt-6 text-lg leading-relaxed text-foreground/90">{VISION}</p>
        </Reveal>
        <Reveal delay={120}>
          <SectionHeading eyebrow="Objectif général" title="Adorer ensemble" />
          <p className="mt-6 text-lg leading-relaxed text-foreground/90">{GENERAL_OBJECTIVE}</p>
        </Reveal>
      </section>

      <section className="border-y border-border/60 bg-card/30">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <Reveal>
            <SectionHeading eyebrow="Objectifs spécifiques" title="Ce que nous recherchons" />
          </Reveal>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {OBJECTIVES.map((objective, i) => (
              <Reveal key={objective} delay={i * 60}>
                <li className="h-full rounded-2xl border border-border bg-card p-6">
                  <span className="font-heading text-4xl text-primary">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-3 leading-relaxed">{objective}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2">
        <Reveal>
          <SectionHeading eyebrow="La soirée" title="Au cœur de la nuit" />
          <ul className="mt-6 space-y-3">
            {PROGRAM.map((item) => (
              <li key={item.title} className="flex gap-3">
                <span aria-hidden className="mt-2 size-2 shrink-0 rounded-full bg-primary" />
                <span>{item.title}</span>
              </li>
            ))}
            <li className="flex gap-3">
              <span aria-hidden className="mt-2 size-2 shrink-0 rounded-full bg-primary" />
              <span>Couverture médiatique et digitale</span>
            </li>
          </ul>
        </Reveal>
        <Reveal delay={120}>
          <SectionHeading eyebrow="Pour qui ?" title="Tout le monde est invité" />
          <ul className="mt-6 flex flex-wrap gap-2">
            {AUDIENCE.map((a) => (
              <li
                key={a}
                className="rounded-full border border-primary/40 bg-primary/5 px-4 py-2 text-sm"
              >
                {a}
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <section className="border-t border-border/60 bg-card/30">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-24">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Édition {EVENT.edition}
            </p>
            <h2 className="mt-4 font-heading text-4xl uppercase leading-none tracking-wide sm:text-6xl">
              {EVENT.theme}
            </h2>
            <p className="mt-4 text-muted-foreground">{EVENT.verse.reference}</p>
            <Button asChild size="lg" className="mt-8">
              <Link href="/inscription">Je m&apos;inscris</Link>
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  );
}
