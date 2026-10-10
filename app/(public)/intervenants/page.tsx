import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal, SectionHeading } from "@/components/site/Reveal";
import { SpeakerCard, StatusBadge } from "@/components/site/SpeakerCard";
import { EVENT, MINISTERS_2026, SINGERS_2026, SPEAKER_2026 } from "@/lib/content";

export const metadata: Metadata = {
  title: "Intervenants",
  description: `Le groupe ${EVENT.group}, les chantres, serviteurs de Dieu et l'orateur de CELEBRATION NIGHT ${EVENT.edition}.`,
};

export default function SpeakersPage() {
  return (
    <>
      <PageHeader
        eyebrow={`Édition ${EVENT.edition}`}
        title="Intervenants"
        intro="La liste ci-dessous est communiquée par le comité d'organisation et peut encore évoluer. Chaque nom porte son statut."
      />

      <div className="mx-auto max-w-6xl space-y-20 px-4 py-16 sm:px-6 sm:py-24">
        <section
          aria-labelledby="statuts"
          className="rounded-2xl border border-border bg-card/60 p-5 sm:p-6"
        >
          <h2
            id="statuts"
            className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground"
          >
            Lire les statuts
          </h2>
          <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-3">
            <div className="space-y-2">
              <dt>
                <StatusBadge status="confirme" />
              </dt>
              <dd className="text-muted-foreground">
                Participation confirmée par l&apos;intervenant.
              </dd>
            </div>
            <div className="space-y-2">
              <dt>
                <StatusBadge status="annonce" />
              </dt>
              <dd className="text-muted-foreground">
                Invité annoncé par le comité d&apos;organisation.
              </dd>
            </div>
            <div className="space-y-2">
              <dt>
                <StatusBadge status="proposition" />
              </dt>
              <dd className="text-muted-foreground">
                Invitation proposée, participation non encore acquise.
              </dd>
            </div>
          </dl>
        </section>

        <section>
          <Reveal>
            <SectionHeading
              eyebrow="Groupe musical"
              title={EVENT.group}
              intro={`CELEBRATION NIGHT est organisé autour du groupe musical ${EVENT.group}. Sa présentation détaillée et ses photos officielles seront publiées prochainement.`}
            />
          </Reveal>
        </section>

        <section>
          <Reveal>
            <SectionHeading eyebrow="La Parole" title="Orateur" />
          </Reveal>
          <div className="mt-8 max-w-md">
            <Reveal>
              <SpeakerCard speaker={SPEAKER_2026} featured />
            </Reveal>
          </div>
        </section>

        <section>
          <Reveal>
            <SectionHeading eyebrow="La louange" title="Chantres invités" />
          </Reveal>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {SINGERS_2026.map((s, i) => (
              <Reveal key={s.name} delay={i * 80}>
                <SpeakerCard speaker={s} />
              </Reveal>
            ))}
          </div>
        </section>

        <section>
          <Reveal>
            <SectionHeading eyebrow="Le ministère" title="Serviteurs de Dieu" />
          </Reveal>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {MINISTERS_2026.map((s, i) => (
              <Reveal key={s.name} delay={i * 80}>
                <SpeakerCard speaker={s} />
              </Reveal>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
