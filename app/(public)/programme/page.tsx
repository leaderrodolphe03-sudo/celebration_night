import type { Metadata } from "next";
import Link from "next/link";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { EVENT, PROGRAM } from "@/lib/content";

export const metadata: Metadata = {
  title: "Programme",
  description: `${EVENT.dateLabel}, ${EVENT.timeLabel.toLowerCase()} : louange, adoration, prière, exhortation et témoignages.`,
};

export default function ProgramPage() {
  return (
    <>
      <PageHeader
        eyebrow={EVENT.dateLabel}
        title="Programme"
        intro={`${EVENT.timeLabel}. ${EVENT.venue}, ${EVENT.city}.`}
      />

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
        <p className="flex gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-4 text-sm leading-relaxed">
          <Info className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
          <span>
            Voici les temps forts prévus par le comité d&apos;organisation. Les horaires détaillés
            seront publiés ici dès leur validation.
            {!EVENT.venueConfirmed && " Le lieu est en cours de confirmation administrative."}
          </span>
        </p>

        <ol className="relative mt-12 space-y-6 border-l border-primary/30 pl-8">
          <li className="relative">
            <span
              aria-hidden
              className="absolute -left-[39px] top-1 size-4 rounded-full bg-primary shadow-[0_0_16px_hsl(var(--primary))]"
            />
            <p className="font-heading text-xl uppercase tracking-wider text-primary">20h</p>
            <h2 className="font-heading text-3xl uppercase tracking-wide">
              Ouverture de la soirée
            </h2>
          </li>
          {PROGRAM.map((item, i) => (
            <Reveal key={item.title} delay={i * 70}>
              <li className="relative rounded-2xl border border-border bg-card p-5 sm:p-6">
                <span
                  aria-hidden
                  className="absolute -left-[39px] top-7 size-4 rounded-full border-2 border-primary bg-background"
                />
                <h2 className="font-heading text-3xl uppercase tracking-wide">{item.title}</h2>
                <p className="mt-1 text-muted-foreground">{item.text}</p>
              </li>
            </Reveal>
          ))}
          <li className="relative">
            <span
              aria-hidden
              className="absolute -left-[39px] top-1 size-4 rounded-full bg-flame shadow-[0_0_16px_hsl(var(--flame))]"
            />
            <p className="font-heading text-xl uppercase tracking-wider text-flame">
              Jusqu&apos;à l&apos;aube, si possible
            </p>
            <h2 className="font-heading text-3xl uppercase tracking-wide">Fin de la soirée</h2>
          </li>
        </ol>

        <div className="mt-14 text-center">
          <Button asChild size="lg">
            <Link href="/inscription">Réserver ma place</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
