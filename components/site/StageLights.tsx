import { cn } from "@/lib/utils/cn";

// Faisceaux de projecteurs et halos colores repris des affiches officielles.
// Purement decoratif : aria-hidden, aucun texte, desactive si mouvement reduit.
const SPARKS = [
  { left: "8%", delay: "0s", duration: "11s" },
  { left: "19%", delay: "3s", duration: "14s" },
  { left: "31%", delay: "6s", duration: "12s" },
  { left: "46%", delay: "1.5s", duration: "15s" },
  { left: "58%", delay: "7s", duration: "13s" },
  { left: "69%", delay: "4s", duration: "11s" },
  { left: "81%", delay: "2s", duration: "16s" },
  { left: "92%", delay: "5s", duration: "12s" },
];

export function StageLights({
  className,
  sparks = true,
}: {
  className?: string;
  sparks?: boolean;
}) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <div className="animate-glow-breathe absolute -left-1/4 top-1/4 h-[60vh] w-[60vw] rounded-full bg-stage/30 blur-[120px]" />
      <div className="animate-glow-breathe absolute -right-1/4 top-0 h-[55vh] w-[55vw] rounded-full bg-violet/30 blur-[120px] [animation-delay:-3s]" />
      <div className="absolute -bottom-1/4 left-1/2 h-[45vh] w-[90vw] -translate-x-1/2 rounded-full bg-flame/25 blur-[140px]" />

      <div className="stage-beam left-[12%] bg-gradient-to-b from-stage/70 via-stage/10 to-transparent [--beam-from:14deg] [--beam-to:4deg]" />
      <div className="stage-beam left-[42%] bg-gradient-to-b from-primary/50 via-primary/5 to-transparent [--beam-from:-6deg] [--beam-to:6deg] [animation-delay:-4s]" />
      <div className="stage-beam right-[10%] bg-gradient-to-b from-violet/70 via-violet/10 to-transparent [--beam-from:-14deg] [--beam-to:-4deg] [animation-delay:-2s]" />

      {sparks &&
        SPARKS.map((s) => (
          <span
            key={s.left}
            className="spark"
            style={{ left: s.left, animationDelay: s.delay, animationDuration: s.duration }}
          />
        ))}

      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
