import Image from "next/image";

/**
 * CelebrationNightLogo — texte de marque stylisé en CSS pur.
 * Pas d'image générée. Le nom de la marque EST le logo.
 */
export function CelebrationNightLogo({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-0 ${className}`}>
      <span className="font-heading text-xl leading-none tracking-widest">
        <span className="text-cn-gold-light">CÉLÉBRATION</span>
        <br />
        <span className="text-white text-2xl tracking-[0.15em]">NIGHT</span>
      </span>
    </span>
  );
}

export function HagiazoLogo({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center ${className}`}>
      <Image
        src="/logos/hagiazo-ministry.svg"
        alt="HAGIAZO Ministry"
        width={190}
        height={44}
        priority
        className="h-9 w-auto object-contain opacity-90"
      />
    </span>
  );
}
