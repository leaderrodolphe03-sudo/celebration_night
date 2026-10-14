import Image from "next/image";

/**
 * CelebrationNightLogo — Emblème officiel CELEBRATION Night
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
        src="/logos/celebration-night-logo-3d.png"
        alt="CELEBRATION Night"
        width={1402}
        height={1122}
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
        src="/logos/hagiazo-ministry.png"
        alt="HAGIAZO Ministry"
        width={300}
        height={260}
        priority
        className="h-10 w-auto object-contain opacity-95"
      />
    </span>
  );
}
