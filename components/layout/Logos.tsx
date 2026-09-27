import Image from "next/image";

/**
 * Ces deux composants pointent vers des assets externes prevus dans
 * /public/logos/. Tant que les fichiers officiels ne sont pas fournis,
 * un repli textuel fidele a la charte (Bebas Neue) est affiche pour que
 * l'interface reste utilisable — voir section 6/7 du brief : ne jamais
 * inventer de logo officiel.
 */

export function CelebrationNightLogo({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <LogoImageOrFallback
        src="/logos/celebration-night.svg"
        alt="Célébration Night"
        fallback="CÉLÉBRATION NIGHT"
      />
    </span>
  );
}

export function HagiazoLogo({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <LogoImageOrFallback
        src="/logos/hagiazo-ministry.svg"
        alt="HAGIAZO Ministry"
        fallback="HAGIAZO Ministry"
      />
    </span>
  );
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
