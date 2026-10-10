import type { Metadata } from "next";
import Link from "next/link";
import { Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal, SectionHeading } from "@/components/site/Reveal";
import { PARTNER_CATEGORIES } from "@/lib/content";

export const metadata: Metadata = {
  title: "Partenaires",
  description:
    "Églises, médias, sponsors et personnes de bonne volonté qui portent CELEBRATION NIGHT.",
};

export default function PartnersPage() {
  return (
    <>
      <PageHeader
        eyebrow="Partenaires & sponsors"
        title="Bâtir ensemble une édition d'excellence"
        intro="CELEBRATION NIGHT souhaite bâtir des partenariats durables afin d'assurer l'excellence de l'événement et d'accroître son impact spirituel et médiatique."
      />

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <Reveal>
          <SectionHeading eyebrow="Ils portent la vision" title="Nos partenaires" />
        </Reveal>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PARTNER_CATEGORIES.map((c, i) => (
            <Reveal key={c.title} delay={i * 60}>
              <li className="h-full rounded-2xl border border-border bg-card p-6">
                <Handshake className="size-7 text-primary" aria-hidden />
                <h3 className="mt-4 font-heading text-2xl uppercase tracking-wide">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.text}</p>
              </li>
            </Reveal>
          ))}
        </ul>
        <p className="mt-6 text-sm text-muted-foreground">
          Les logos des partenaires seront affichés ici avec leur accord.
        </p>
      </div>

      <section className="border-t border-border/60 bg-card/30">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-24">
          <Reveal>
            <h2 className="font-heading text-4xl uppercase leading-none tracking-wide sm:text-6xl">
              Devenir partenaire
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-foreground/90">
              Église, entreprise, média, prestataire ou personne de bonne volonté : en soutenant
              CELEBRATION NIGHT, vous contribuez à l&apos;édification de nombreuses vies, à
              l&apos;unité du Corps de Christ et à la proclamation de l&apos;Évangile. Chaque
              contribution fait l&apos;objet d&apos;un suivi rigoureux et transparent.
            </p>
            <Button asChild size="lg" className="mt-8">
              <Link href="/contact?sujet=partenariat">Nous contacter</Link>
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  );
}
