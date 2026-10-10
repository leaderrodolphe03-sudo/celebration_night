import Image from "next/image";
import Link from "next/link";
import { EVENT, MEDIA, NAV_LINKS } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-card/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Image
            src={MEDIA.logo}
            alt="CELEBRATION NIGHT"
            width={180}
            height={110}
            className="h-20 w-auto"
          />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            {EVENT.slogan}.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Un événement organisé autour du groupe musical{" "}
            <span className="text-foreground">{EVENT.group}</span>.
          </p>
        </div>

        <nav aria-label="Pied de page">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Le site</p>
          <ul className="mt-4 space-y-2 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-muted-foreground hover:text-foreground">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            Édition {EVENT.edition}
          </p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>{EVENT.dateLabel}</li>
            <li>{EVENT.timeLabel}</li>
            <li>
              {EVENT.venue}
              {!EVENT.venueConfirmed && (
                <span className="block text-xs">(lieu en cours de confirmation)</span>
              )}
            </li>
          </ul>
          <Link
            href="/inscription"
            className="mt-5 inline-block text-sm font-semibold text-primary hover:underline"
          >
            Réserver ma place →
          </Link>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {EVENT.edition} CELEBRATION NIGHT. Tous droits réservés.</p>
          <div className="flex gap-4">
            <Link href="/mentions-legales" className="hover:text-foreground">
              Mentions légales
            </Link>
            <Link href="/confidentialite" className="hover:text-foreground">
              Confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
