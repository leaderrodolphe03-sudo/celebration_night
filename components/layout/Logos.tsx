import Image from "next/image";

/**
 * CelebrationNightLogo — Emblème officiel Célébration Night
 */
export function CelebrationNightLogo({
  className = "",
  imgClassName = "h-11 sm:h-12 w-auto object-contain",
  priority = true,
}: {
  className?: string;
  imgClassName?: string;
  priority?: boolean;
}) {
  return (
    <span className={`inline-flex items-center ${className}`}>
      <Image
        src="/logos/celebration-night-logo.png"
        alt="Célébration Night"
        width={1016}
        height={467}
        priority={priority}
        className={imgClassName}
      />
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
