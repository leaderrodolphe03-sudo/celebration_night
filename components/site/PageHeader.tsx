import { StageLights } from "./StageLights";

export function PageHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <header className="relative isolate overflow-hidden border-b border-border/60">
      <StageLights sparks={false} className="opacity-70" />
      <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-16 sm:px-6 sm:pb-20 sm:pt-24">
        <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.3em] text-primary">
          {eyebrow}
        </p>
        <h1 className="animate-fade-up mt-3 font-heading text-5xl uppercase leading-none tracking-wide [animation-delay:80ms] sm:text-7xl">
          {title}
        </h1>
        {intro && (
          <p className="animate-fade-up mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground [animation-delay:160ms] sm:text-lg">
            {intro}
          </p>
        )}
      </div>
    </header>
  );
}
