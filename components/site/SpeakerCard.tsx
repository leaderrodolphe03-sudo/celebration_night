import Image from "next/image";
import { SPEAKER_STATUS_LABEL, type Speaker } from "@/lib/content";
import { cn } from "@/lib/utils/cn";

function initials(name: string) {
  const words = name.replace(/^(Pasteur|Évangéliste|Pst\.|Evg\.)\s+/i, "").split(/\s+/);
  return (words[0][0] + (words[1]?.[0] ?? "")).toUpperCase();
}

export function StatusBadge({ status }: { status: Speaker["status"] }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider",
        status === "confirme" && "border-success/50 bg-success/10 text-success",
        status === "annonce" && "border-primary/50 bg-primary/10 text-primary",
        status === "proposition" && "border-dashed border-muted-foreground/60 text-muted-foreground"
      )}
    >
      {SPEAKER_STATUS_LABEL[status]}
    </span>
  );
}

export function SpeakerCard({
  speaker,
  featured = false,
}: {
  speaker: Speaker;
  featured?: boolean;
}) {
  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-primary/50",
        speaker.status === "proposition" && "border-dashed"
      )}
    >
      <div className={cn("relative overflow-hidden", featured ? "aspect-[4/3]" : "aspect-[4/5]")}>
        {speaker.photo ? (
          <Image
            src={speaker.photo}
            alt={speaker.name}
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          // Emplacement en attendant la photo officielle.
          <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_50%_30%,hsl(var(--violet)/0.35),transparent_60%),radial-gradient(circle_at_50%_100%,hsl(var(--flame)/0.25),transparent_60%)]">
            <span className="text-gold-gradient font-heading text-7xl tracking-wider sm:text-8xl">
              {initials(speaker.name)}
            </span>
            <span className="sr-only">Photo à venir</span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {speaker.role}
        </p>
        <h3 className="font-heading text-2xl uppercase leading-tight tracking-wide sm:text-3xl">
          {speaker.name}
        </h3>
        <div className="mt-auto pt-1">
          <StatusBadge status={speaker.status} />
        </div>
      </div>
    </article>
  );
}
