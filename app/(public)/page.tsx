import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Countdown } from "@/components/site/Countdown";
import { Reveal, SectionHeading } from "@/components/site/Reveal";
import { SpeakerCard } from "@/components/site/SpeakerCard";
import { PhotoGrid } from "@/components/site/PhotoGrid";
import { StageLights } from "@/components/site/StageLights";
import {
  EVENT,
  MEDIA,
  OBJECTIVES,
  PAST_EDITIONS,
  PROGRAM,
  SINGERS_2026,
  SPEAKER_2026,
  VISION,
} from "@/lib/content";
import { getEditionPhotos } from "@/lib/gallery";

const eventJsonLd = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: `${EVENT.name} ${EVENT.edition}`,
  description: `${EVENT.slogan}. Thème : ${EVENT.theme} (${EVENT.verse.reference}).`,
  startDate: EVENT.startsAt,
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  location: {
    "@type": "Place",
    name: EVENT.venue,
    address: { "@type": "PostalAddress", addressLocality: EVENT.city, addressCountry: "BJ" },
  },
  performer: { "@type": "MusicGroup", name: EVENT.group },
  image: [MEDIA.logo],
};

export default function HomePage() {
  const edition2025 = PAST_EDITIONS[0];
  const photos2025 = edition2025 ? getEditionPhotos(edition2025.year) : [];

  return (
    <>
      <script
        type="application/ld+json"
        // Donnees statiques issues de lib/content.ts, pas d'entree utilisateur.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd).replace(/</g, "\\u003c") }}
      />

      {/* ------------------------------------------------ Introduction */}
      <section className="relative isolate flex min-h-[calc(100svh-4rem)] items-center overflow-hidden sm:min-h-[calc(100svh-5rem)]">
        <StageLights />
        <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center px-4 py-14 text-center sm:px-6">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.4em] text-primary sm:text-sm">
            Édition {EVENT.edition}
          </p>

          <h1 className="mt-4 w-full max-w-3xl">
            <span className="sr-only">
              {EVENT.name} {EVENT.edition}
            </span>
            <Image
              src={MEDIA.logo}
              alt=""
              width={1053}
              height={641}
              priority
              sizes="(min-width: 768px) 720px, 92vw"
              className="animate-logo-rise mx-auto h-auto w-full drop-shadow-[0_0_40px_rgba(245,185,0,0.35)]"
            />
          </h1>

          <p className="animate-fade-up mt-4 max-w-xl text-lg text-foreground/90 [animation-delay:500ms] sm:text-xl">
            {EVENT.slogan}
          </p>

          <ul className="animate-fade-up mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm [animation-delay:700ms] sm:text-base">
            <li className="flex items-center gap-2">
              <CalendarDays className="size-5 text-primary" aria-hidden />
              {EVENT.dateLabel}
            </li>
            <li className="flex items-center gap-2">
              <Clock className="size-5 text-primary" aria-hidden />
              {EVENT.timeLabel}
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="size-5 shrink-0 text-primary" aria-hidden />
              <span>
                {EVENT.venue}, {EVENT.city}
                {!EVENT.venueConfirmed && (
                  <span className="text-muted-foreground"> (à confirmer)</span>
                )}
              </span>
            </li>
          </ul>

          <div className="animate-fade-up mt-8 flex w-full flex-col gap-3 [animation-delay:850ms] sm:w-auto sm:flex-row">
            <Button asChild size="lg">
              <Link href="/inscription">
                Je m&apos;inscris <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/a-propos">Découvrir la vision</Link>
            </Button>
          </div>

          <div className="animate-fade-up mt-12 w-full max-w-lg [animation-delay:1000ms]">
            <Countdown target={EVENT.startsAt} />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ Theme */}
      <section className="relative overflow-hidden border-y border-border/60 bg-card/40">
        <div className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 sm:py-28">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Thème de l&apos;édition
            </p>
            <h2 className="mt-5 font-heading text-4xl uppercase leading-[0.95] tracking-wide sm:text-6xl md:text-7xl">
              La délivrance des vrais adorateurs
              <span className="text-gold-gradient animate-gold-sweep mt-1 block pt-[0.12em] leading-tight">
                Génération Asaph
              </span>
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <blockquote className="mx-auto mt-10 max-w-2xl">
              <p className="text-lg italic leading-relaxed text-foreground/90 sm:text-xl">
                « {EVENT.verse.text} »
              </p>
              <footer className="mt-3 text-sm text-muted-foreground">
                {EVENT.verse.reference} · {EVENT.verse.translation}
              </footer>
            </blockquote>
            <p className="mt-10 text-sm uppercase tracking-[0.25em] text-muted-foreground">
              Orateur annoncé · <span className="text-foreground">{SPEAKER_2026.name}</span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------ Vision */}
      <section className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-2">
        <Reveal>
          <SectionHeading eyebrow="Notre vision" title="Une nuit pour unir les adorateurs" />
          <p className="mt-6 text-lg leading-relaxed text-foreground/90">{VISION}</p>
          <Link
            href="/a-propos"
            className="mt-6 inline-flex items-center gap-2 font-semibold text-primary hover:underline"
          >
            En savoir plus <ArrowRight className="size-4" />
          </Link>
        </Reveal>
        <ol className="grid gap-3 sm:grid-cols-2">
          {OBJECTIVES.map((objective, i) => (
            <Reveal key={objective} delay={i * 60}>
              <li className="h-full rounded-2xl border border-border bg-card p-5">
                <span className="font-heading text-3xl text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="mt-2 text-sm leading-relaxed text-foreground/90">{objective}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* ------------------------------------------------ Intervenants */}
      <section className="border-t border-border/60 bg-card/30">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <Reveal>
              <SectionHeading
                eyebrow="Intervenants"
                title="Ils serviront avec nous"
                intro={`Autour du groupe ${EVENT.group}, des chantres et serviteurs de Dieu annoncés par le comité d'organisation.`}
              />
            </Reveal>
            <Button asChild variant="outline">
              <Link href="/intervenants">Tous les intervenants</Link>
            </Button>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {[SPEAKER_2026, ...SINGERS_2026].map((speaker, i) => (
              <Reveal key={speaker.name} delay={i * 80}>
                <SpeakerCard speaker={speaker} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ Programme */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr]">
          <Reveal>
            <SectionHeading
              eyebrow="Programme"
              title="Le déroulé de la nuit"
              intro={`${EVENT.dateLabel}, ${EVENT.timeLabel.toLowerCase()}. Les horaires détaillés seront publiés prochainement.`}
            />
            <Button asChild variant="outline" className="mt-8">
              <Link href="/programme">Voir le programme</Link>
            </Button>
          </Reveal>
          <ol className="relative space-y-4 border-l border-primary/30 pl-6">
            {PROGRAM.map((item, i) => (
              <Reveal key={item.title} delay={i * 70}>
                <li className="relative">
                  <span
                    aria-hidden
                    className="absolute -left-[31px] top-1.5 size-3 rounded-full bg-primary shadow-[0_0_12px_hsl(var(--primary))]"
                  />
                  <h3 className="font-heading text-2xl uppercase tracking-wide">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.text}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ------------------------------------------------ Archives */}
      {edition2025 && (
        <section className="border-y border-border/60 bg-card/30">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-2">
            {photos2025.length > 0 ? (
              <PhotoGrid
                className="order-2 lg:order-1"
                photos={photos2025}
                credit={edition2025.photoCredit}
                limit={3}
              />
            ) : (
              <Reveal className="order-2 grid grid-cols-2 gap-3 lg:order-1">
                {edition2025.posters.map((poster, i) => (
                  <Image
                    key={poster.src}
                    src={poster.src}
                    alt={poster.alt}
                    width={1080}
                    height={1350}
                    sizes="(min-width: 1024px) 25vw, 45vw"
                    className={`h-auto w-full rounded-2xl border border-border shadow-2xl ${i === 1 ? "translate-y-8" : ""}`}
                  />
                ))}
              </Reveal>
            )}
            <Reveal className="order-1 lg:order-2">
              <SectionHeading
                eyebrow={`Archives · ${edition2025.year}`}
                title={edition2025.theme}
                intro={`${edition2025.verse}. ${edition2025.dateLabel}, avec ${edition2025.guests.join(", ")} et le groupe hôte.`}
              />
              <Button asChild variant="outline" className="mt-8">
                <Link href="/archives">Revivre les éditions</Link>
              </Button>
            </Reveal>
          </div>
        </section>
      )}

      {/* ------------------------------------------------ Appel final */}
      <section className="relative isolate overflow-hidden">
        <StageLights sparks={false} className="opacity-80" />
        <div className="relative mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 sm:py-32">
          <Reveal>
            <h2 className="font-heading text-5xl uppercase leading-none tracking-wide sm:text-7xl">
              Réserve ta place
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-foreground/90">
              Inscris-toi, reçois ton billet avec QR code et invite ceux qui t&apos;entourent à
              vivre cette nuit d&apos;adoration.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/inscription">
                  Je m&apos;inscris <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/partenaires">Devenir partenaire</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
