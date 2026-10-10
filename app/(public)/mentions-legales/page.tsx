import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";

export const metadata: Metadata = { title: "Mentions légales", robots: { index: false } };

// Les informations marquees « a completer » doivent etre fournies par
// l'organisation avant la mise en ligne (voir REQUIREMENTS.md § 12).
export default function LegalPage() {
  return (
    <>
      <PageHeader eyebrow="Informations" title="Mentions légales" />
      <div className="mx-auto max-w-3xl space-y-8 px-4 py-16 leading-relaxed text-foreground/90 sm:px-6">
        <section>
          <h2 className="font-heading text-3xl uppercase tracking-wide">Éditeur du site</h2>
          <p className="mt-3">
            Comité d&apos;organisation de CELEBRATION NIGHT, Cotonou, Bénin.
            <br />
            <span className="text-muted-foreground">
              Responsable de la publication et coordonnées officielles : à compléter par
              l&apos;organisation.
            </span>
          </p>
        </section>
        <section>
          <h2 className="font-heading text-3xl uppercase tracking-wide">Hébergement</h2>
          <p className="mt-3 text-muted-foreground">À compléter lors de la mise en ligne.</p>
        </section>
        <section>
          <h2 className="font-heading text-3xl uppercase tracking-wide">
            Propriété intellectuelle
          </h2>
          <p className="mt-3">
            Les logos, affiches, photographies et vidéos présentés sur ce site appartiennent à
            l&apos;organisation de CELEBRATION NIGHT ou à leurs auteurs respectifs. Toute
            reproduction nécessite une autorisation préalable.
          </p>
        </section>
      </div>
    </>
  );
}
