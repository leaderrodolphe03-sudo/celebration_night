"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Maximize2,
  Camera,
} from "lucide-react";

export interface MediaPhotoItem {
  id: number;
  src: string;
}

const ALL_PHOTOS: MediaPhotoItem[] = [
  { id: 1,  src: "/images/gallery/celebration-01.jpg" },
  { id: 2,  src: "/images/gallery/celebration-02.jpg" },
  { id: 3,  src: "/images/gallery/celebration-03.jpg" },
  { id: 4,  src: "/images/gallery/celebration-04.jpg" },
  { id: 5,  src: "/images/gallery/celebration-05.jpg" },
  { id: 6,  src: "/images/gallery/celebration-06.jpg" },
  { id: 7,  src: "/images/gallery/celebration-07.jpg" },
  { id: 8,  src: "/images/gallery/celebration-08.jpg" },
  { id: 9,  src: "/images/gallery/celebration-09.jpg" },
  { id: 10, src: "/images/gallery/celebration-10.jpg" },
  { id: 11, src: "/images/gallery/celebration-11.jpg" },
  { id: 12, src: "/images/gallery/celebration-12.jpg" },
  { id: 13, src: "/images/gallery/celebration-13.jpg" },
  { id: 14, src: "/images/gallery/celebration-14.jpg" },
  { id: 15, src: "/images/gallery/celebration-15.jpg" },
  { id: 16, src: "/images/gallery/celebration-16.jpg" },
  { id: 17, src: "/images/gallery/celebration-17.jpg" },
  { id: 18, src: "/images/gallery/celebration-18.jpg" },
  { id: 19, src: "/images/gallery/celebration-19.jpg" },
  { id: 20, src: "/images/gallery/celebration-20.jpg" },
  { id: 21, src: "/images/gallery/celebration-21.jpg" },
  { id: 22, src: "/images/gallery/celebration-22.jpg" },
  { id: 23, src: "/images/gallery/celebration-23.jpg" },
  { id: 24, src: "/images/gallery/celebration-24.jpg" },
  { id: 25, src: "/images/gallery/celebration-25.jpg" },
  { id: 26, src: "/images/gallery/celebration-26.jpg" },
  { id: 27, src: "/images/gallery/celebration-27.jpg" },
  { id: 28, src: "/images/gallery/celebration-28.jpg" },
  { id: 29, src: "/images/gallery/celebration-29.jpg" },
  { id: 30, src: "/images/gallery/celebration-30.jpg" },
  { id: 31, src: "/images/gallery/celebration-31.jpg" },
  { id: 32, src: "/images/gallery/celebration-32.jpg" },
  { id: 33, src: "/images/gallery/celebration-33.jpg" },
  { id: 34, src: "/images/gallery/celebration-34.jpg" },
  { id: 35, src: "/images/gallery/celebration-35.jpg" },
  { id: 36, src: "/images/gallery/celebration-36.jpg" },
  { id: 37, src: "/images/gallery/celebration-37.jpg" },
  { id: 38, src: "/images/gallery/celebration-38.jpg" },
  { id: 39, src: "/images/gallery/celebration-39.jpg" },
  { id: 40, src: "/images/gallery/celebration-40.jpg" },
  { id: 41, src: "/images/gallery/celebration-41.jpg" },
  { id: 42, src: "/images/gallery/celebration-42.jpg" },
  { id: 43, src: "/images/gallery/celebration-43.jpg" },
  { id: 44, src: "/images/gallery/celebration-44.jpg" },
  { id: 45, src: "/images/gallery/celebration-45.jpg" },
  { id: 46, src: "/images/gallery/celebration-46.jpg" },
  { id: 47, src: "/images/gallery/celebration-47.jpg" },
  { id: 48, src: "/images/gallery/celebration-48.jpg" },
  { id: 49, src: "/images/gallery/celebration-49.jpg" },
  { id: 50, src: "/images/gallery/celebration-50.jpg" },
  { id: 51, src: "/images/gallery/celebration-51.jpg" },
];

const BATCH_SIZE = 12;

export default function MediaPhotoGallery() {
  const [visibleCount, setVisibleCount] = useState<number>(BATCH_SIZE);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const displayedPhotos = useMemo(() => {
    return ALL_PHOTOS.slice(0, visibleCount);
  }, [visibleCount]);

  const hasMore = visibleCount < ALL_PHOTOS.length;

  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, ALL_PHOTOS.length));
  };

  // Gestion Lightbox
  const openLightbox = (photo: MediaPhotoItem) => {
    const idx = ALL_PHOTOS.findIndex((p) => p.id === photo.id);
    setLightboxIndex(idx !== -1 ? idx : 0);
  };

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const handlePrev = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) =>
      prev !== null ? (prev - 1 + ALL_PHOTOS.length) % ALL_PHOTOS.length : 0
    );
  }, [lightboxIndex]);

  const handleNext = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) =>
      prev !== null ? (prev + 1) % ALL_PHOTOS.length : 0
    );
  }, [lightboxIndex]);

  // Raccourcis clavier (Flèches gauche/droite et Echap)
  useEffect(() => {
    if (lightboxIndex === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxIndex, closeLightbox, handlePrev, handleNext]);

  // Bloquer le défilement de fond quand la lightbox est active
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxIndex]);

  const activeLightboxPhoto =
    lightboxIndex !== null ? ALL_PHOTOS[lightboxIndex] : null;

  return (
    <div>
      {/* Barre d'état épurée */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2 text-xs text-cn-gray-400">
          <Camera size={15} className="text-cn-gold" />
          <span>
            Affichage de{" "}
            <strong className="text-white">
              {Math.min(visibleCount, ALL_PHOTOS.length)}
            </strong>{" "}
            sur <strong className="text-cn-gold">{ALL_PHOTOS.length}</strong> photographies
          </span>
        </div>
      </div>

      {/* Grille de photos */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {displayedPhotos.map((photo, idx) => (
          <div
            key={photo.id}
            onClick={() => openLightbox(photo)}
            onContextMenu={(e) => e.preventDefault()}
            className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-cn-deep shadow-md hover:border-cn-gold/50 transition-all duration-300 hover:shadow-gold select-none"
            style={{ WebkitTouchCallout: "none" }}
          >
            {/* Calque protecteur contre l'enregistrement direct d'image */}
            <div
              className="absolute inset-0 z-10 select-none"
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
            />

            {/* Image avec zoom doux */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.src}
              alt="CELEBRATION NIGHT — Photographie officielle"
              loading="lazy"
              decoding="async"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
              className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105 pointer-events-none select-none"
            />

            {/* Voile cinématographique au survol */}
            <div className="absolute inset-0 bg-gradient-to-t from-cn-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            {/* Badge icône agrandir au survol */}
            <div className="absolute top-3 right-3 h-8 w-8 rounded-full bg-cn-black/70 border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100 backdrop-blur-sm z-20">
              <Maximize2 size={13} className="text-cn-gold" />
            </div>

            {/* Numérotation discrète en coin */}
            <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-cn-black/60 text-[10px] font-mono text-cn-gray-400 opacity-60 group-hover:opacity-0 transition-opacity z-20">
              #{idx + 1}
            </div>
          </div>
        ))}
      </div>

      {/* Action Afficher plus : texte blanc précédé d'une flèche vers le bas */}
      {hasMore && (
        <div className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={handleShowMore}
            className="inline-flex items-center gap-2 text-white hover:text-cn-gold text-sm font-medium uppercase tracking-wider transition-colors py-2 px-4 group cursor-pointer"
          >
            <ChevronDown size={18} className="transition-transform group-hover:translate-y-0.5" />
            <span>Afficher plus</span>
          </button>
        </div>
      )}

      {/* LIGHTBOX PLEIN ÉCRAN */}
      {activeLightboxPhoto && (
        <div
          onClick={closeLightbox}
          onContextMenu={(e) => e.preventDefault()}
          className="fixed inset-0 z-50 flex items-center justify-center bg-cn-black/95 p-3 sm:p-6 backdrop-blur-md transition-opacity select-none"
          role="dialog"
          aria-modal="true"
          aria-label="Visionneuse de photo"
          style={{ WebkitTouchCallout: "none" }}
        >
          {/* Compteur discret en haut à gauche */}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cn-dark/80 border border-white/15 backdrop-blur-sm">
            <span className="text-xs font-mono text-cn-gray-300">
              {(lightboxIndex ?? 0) + 1} / {ALL_PHOTOS.length}
            </span>
          </div>

          {/* Bouton Fermer */}
          <button
            type="button"
            onClick={closeLightbox}
            aria-label="Fermer la photo"
            className="absolute top-4 right-4 sm:top-6 sm:right-6 h-11 w-11 flex items-center justify-center rounded-xl border border-white/20 bg-cn-dark/80 text-white hover:border-cn-gold hover:text-cn-gold transition-colors z-20 backdrop-blur-sm"
          >
            <X size={20} />
          </button>

          {/* Bouton Précédent */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            aria-label="Photo précédente"
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 h-11 w-11 flex items-center justify-center rounded-xl border border-white/20 bg-cn-dark/80 text-white hover:border-cn-gold hover:text-cn-gold transition-colors z-20 backdrop-blur-sm"
          >
            <ChevronLeft size={22} />
          </button>

          {/* Conteneur Image Principale (anti-téléchargement & plein écran) */}
          <div
            onClick={(e) => e.stopPropagation()}
            onContextMenu={(e) => e.preventDefault()}
            className="relative max-h-[90vh] max-w-5xl w-full overflow-hidden rounded-2xl border border-white/15 bg-black/60 shadow-2xl flex items-center justify-center select-none"
            style={{ WebkitTouchCallout: "none", userSelect: "none" }}
          >
            {/* Calque transparent protecteur contre le clic droit et l'enregistrement */}
            <div
              className="absolute inset-0 z-10 select-none"
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
            />

            {/* Image HD */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeLightboxPhoto.src}
              alt="CELEBRATION NIGHT — Photographie officielle"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
              className="max-h-[85vh] w-auto max-w-full object-contain mx-auto pointer-events-none select-none"
            />
          </div>

          {/* Bouton Suivant */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            aria-label="Photo suivante"
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 h-11 w-11 flex items-center justify-center rounded-xl border border-white/20 bg-cn-dark/80 text-white hover:border-cn-gold hover:text-cn-gold transition-colors z-20 backdrop-blur-sm"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      )}
    </div>
  );
}
