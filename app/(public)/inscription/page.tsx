import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, Clock, MapPin, QrCode } from "lucide-react";
import { RegistrationForm } from "@/components/forms/RegistrationForm";
import { PageHeader } from "@/components/site/PageHeader";
import { EVENT } from "@/lib/content";

export const metadata: Metadata = {
  title: "Inscription",
  description: `Réservez votre place pour CELEBRATION NIGHT ${EVENT.edition} et recevez votre billet avec QR code.`,
};

export default function RegistrationPage() {
  return (
    <>
      <PageHeader
        eyebrow={`Édition ${EVENT.edition}`}
        title="Je m'inscris"
        intro="Quelques informations suffisent. Vous recevrez aussitôt votre billet avec un QR code à présenter à l'entrée."
      />

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.6fr_1fr]">
        <section
          aria-label="Formulaire d'inscription"
          className="rounded-2xl border border-border bg-card p-5 sm:p-8"
        >
          <RegistrationForm />
        </section>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-border bg-card/60 p-6">
            <h2 className="font-heading text-2xl uppercase tracking-wide">La soirée</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex gap-3">
                <CalendarDays className="size-5 shrink-0 text-primary" aria-hidden />{" "}
                {EVENT.dateLabel}
              </li>
              <li className="flex gap-3">
                <Clock className="size-5 shrink-0 text-primary" aria-hidden /> {EVENT.timeLabel}
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
          <div className="rounded-2xl border border-border bg-card/60 p-6">
            <QrCode className="size-7 text-primary" aria-hidden />
            <h2 className="mt-3 font-heading text-2xl uppercase tracking-wide">Votre billet</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Chaque place reçoit un billet unique. Son QR code ne contient aucune donnée
              personnelle et ne peut être validé qu&apos;une seule fois à l&apos;entrée.
            </p>
            <Link
              href="/mon-billet"
              className="mt-4 inline-block text-sm font-semibold text-primary hover:underline"
            >
              Retrouver un billet existant →
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
