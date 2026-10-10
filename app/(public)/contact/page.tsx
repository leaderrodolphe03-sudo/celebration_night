import type { Metadata } from "next";
import { CalendarDays, MapPin, MessageCircle } from "lucide-react";
import { ContactForm } from "@/components/forms/ContactForm";
import { PageHeader } from "@/components/site/PageHeader";
import { EVENT } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Écrire à l'équipe d'organisation de CELEBRATION NIGHT : renseignements, partenariats, bénévolat.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ sujet?: string }>;
}) {
  const { sujet } = await searchParams;

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Écrivez-nous"
        intro="Une question, une envie de servir comme bénévole ou de devenir partenaire ? L'équipe d'organisation vous répond."
      />

      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.4fr_1fr]">
        <section
          aria-label="Formulaire de contact"
          className="rounded-2xl border border-border bg-card p-5 sm:p-8"
        >
          <ContactForm defaultSubject={sujet === "partenariat" ? "Partenariat" : undefined} />
        </section>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-border bg-card/60 p-6">
            <h2 className="font-heading text-2xl uppercase tracking-wide">L&apos;événement</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex gap-3">
                <CalendarDays className="size-5 shrink-0 text-primary" aria-hidden />
                <span>
                  {EVENT.dateLabel}
                  <br />
                  <span className="text-muted-foreground">{EVENT.timeLabel}</span>
                </span>
              </li>
              <li className="flex gap-3">
                <MapPin className="size-5 shrink-0 text-primary" aria-hidden />
                <span>
                  {EVENT.venue}, {EVENT.city}
                  {!EVENT.venueConfirmed && (
                    <span className="block text-muted-foreground">
                      Lieu en cours de confirmation
                    </span>
                  )}
                </span>
              </li>
            </ul>
          </div>
          <div className="rounded-2xl border border-dashed border-border p-6">
            <h2 className="flex items-center gap-2 font-heading text-2xl uppercase tracking-wide">
              <MessageCircle className="size-6 text-primary" aria-hidden /> Réseaux sociaux
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Retrouvez bientôt CELEBRATION NIGHT sur Facebook, Instagram, TikTok, WhatsApp et
              YouTube. Les liens officiels seront publiés ici.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
