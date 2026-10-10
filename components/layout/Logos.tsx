import Image from "next/image";

/**
 * Logos utilises par le billet imprimable. Le logo CELEBRATION NIGHT est le
 * fichier officiel de /public/media/official/. Le groupe Haguiazo n'a pas
 * encore fourni de logo : on affiche son nom, sans jamais inventer de visuel.
 */

export function CelebrationNightLogo({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <LogoImageOrFallback
        src="/media/official/logo-celebration-night.webp"
        alt="CELEBRATION NIGHT"
        fallback="CÉLÉBRATION NIGHT"
      />
    </span>
  );
}

// Aucun logo officiel du groupe n'a encore ete fourni : affichage textuel.
export function HagiazoLogo({ className = "" }: { className?: string }) {
  return <span className={`font-heading text-2xl uppercase tracking-widest text-[#FFD84A] ${className}`}>Haguiazo</span>;
}

function LogoImageOrFallback({
  src,
  alt,
  fallback,
}: {
  src: string;
  alt: string;
  fallback: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={190}
      height={44}
      priority
      className="h-10 w-auto object-contain"
    />
  );
}
