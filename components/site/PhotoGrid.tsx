import Image from "next/image";
import type { EditionPhoto } from "@/lib/gallery";
import { cn } from "@/lib/utils/cn";
import { Reveal } from "./Reveal";

/** Grille de photos d'une edition, avec credit du photographe. */
export function PhotoGrid({
  photos,
  credit,
  limit,
  className,
}: {
  photos: EditionPhoto[];
  credit?: string;
  limit?: number;
  className?: string;
}) {
  const shown = limit ? photos.slice(0, limit) : photos;
  if (shown.length === 0) return null;

  return (
    <figure className={className}>
      <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {shown.map((photo, i) => (
          <li
            key={photo.src}
            className={cn(i === 0 && shown.length > 2 && "col-span-2 row-span-2")}
          >
            <Reveal delay={Math.min(i, 6) * 60} className="h-full">
              <a
                href={photo.src}
                target="_blank"
                rel="noopener"
                className="group relative block aspect-[4/3] h-full overflow-hidden rounded-2xl border border-border focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes={
                    i === 0 ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 1024px) 33vw, 50vw"
                  }
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="sr-only">(ouvrir en grand dans un nouvel onglet)</span>
              </a>
            </Reveal>
          </li>
        ))}
      </ul>
      {credit && (
        <figcaption className="mt-3 text-xs text-muted-foreground">Photos : {credit}</figcaption>
      )}
    </figure>
  );
}
