"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, X, ChevronLeft, ChevronRight, Eye } from "lucide-react";

interface GalleryPhoto {
  id: number;
  src: string;
  title: string;
  tag: string;
}

const GALLERY_PHOTOS: GalleryPhoto[] = [
  { id: 1,  src: "/images/gallery/photo-1.jpg",  title: "Grand Chœur de Louange",           tag: "Chorale Live" },
  { id: 2,  src: "/images/gallery/photo-2.jpg",  title: "Section Claviers & Synthés",       tag: "Musiciens" },
  { id: 3,  src: "/images/gallery/photo-3.jpg",  title: "L'Assemblée les mains levées",     tag: "Adoration" },
  { id: 4,  src: "/images/gallery/photo-4.jpg",  title: "Chantre soliste en ferveur",       tag: "Louange" },
  { id: 5,  src: "/images/gallery/photo-5.jpg",  title: "Percussions & Batterie sacrée",    tag: "Rythmique" },
  { id: 6,  src: "/images/gallery/photo-6.jpg",  title: "Intercession & Humiliation",       tag: "Prière" },
  { id: 7,  src: "/images/gallery/photo-7.jpg",  title: "Prédication & Proclamation",       tag: "Parole" },
  { id: 8,  src: "/images/gallery/photo-8.jpg",  title: "Jeunesse consacrée & Recueillie",  tag: "Communion" },
  { id: 9,  src: "/images/gallery/photo-9.jpg",  title: "Célébration & Allégresse",         tag: "Joie Sainte" },
  { id: 10, src: "/images/gallery/photo-10.jpg", title: "Le Sanctuaire sous les lumières",  tag: "Scène" },
];

export default function HomeGallerySection() {
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedPhoto) return;
    const idx = GALLERY_PHOTOS.findIndex((p) => p.id === selectedPhoto.id);
    setSelectedPhoto(GALLERY_PHOTOS[(idx - 1 + GALLERY_PHOTOS.length) % GALLERY_PHOTOS.length]);
  };
  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedPhoto) return;
    const idx = GALLERY_PHOTOS.findIndex((p) => p.id === selectedPhoto.id);
    setSelectedPhoto(GALLERY_PHOTOS[(idx + 1) % GALLERY_PHOTOS.length]);
  };

  return (
    <section className="bg-cn-black px-5 py-24 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">

        {/* En-tête épuré */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="h-px w-6 bg-cn-gold" />
              <span className="font-body text-[11px] font-bold uppercase tracking-[0.2em] text-cn-gold">
                Toutes éditions confondues
              </span>
            </div>
            <h2 className="font-heading text-4xl sm:text-6xl uppercase leading-[0.92] tracking-wide text-white">
              ILS ÉTAIENT À LA<br />
              <span className="text-cn-gold">CÉLÉBRATION NIGHT</span>
            </h2>
          </div>
          <Link
            href="/medias"
            className="group shrink-0 inline-flex items-center gap-2 rounded-lg bg-cn-dark border border-white/10 px-5 py-3 font-body text-xs font-bold uppercase tracking-wider text-cn-gold-light hover:border-cn-gold/50 hover:bg-cn-deep hover:text-white transition-all shadow-sm"
          >
            <span>Voir toute la galerie</span>
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Grille 5×2 épurée (sans badges superposés) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {GALLERY_PHOTOS.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              className="group relative aspect-[3/4] cursor-pointer overflow-hidden rounded-xl bg-cn-dark border border-white/10 hover:border-cn-gold/40 transition-all duration-300 shadow-md hover:shadow-gold"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.src}
                alt={photo.title}
                className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              {/* Voile cinématographique */}
              <div className="absolute inset-0 bg-gradient-to-t from-cn-black/90 via-cn-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

              

              
            </div>
          ))}
        </div>
      </div>

      {/* LIGHTBOX */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-cn-black/95 p-4 sm:p-8 backdrop-blur-md"
        >
          <button
            type="button"
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-5 right-5 h-11 w-11 flex items-center justify-center rounded-lg border border-white/15 text-white hover:border-cn-gold hover:text-cn-gold transition-colors z-20"
          >
            <X size={20} />
          </button>
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 h-11 w-11 flex items-center justify-center rounded-lg border border-white/15 text-white hover:border-cn-gold hover:text-cn-gold transition-colors z-20"
          >
            <ChevronLeft size={22} />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[85vh] max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-cn-dark shadow-2xl"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedPhoto.src}
              alt={selectedPhoto.title}
              className="max-h-[75vh] w-auto object-contain mx-auto"
            />
            <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
              
              <Link
                href="/medias"
                className="text-xs font-bold uppercase tracking-wider text-cn-gold hover:text-cn-gold-light transition-colors"
              >
                Voir la médiathèque →
              </Link>
            </div>
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 h-11 w-11 flex items-center justify-center rounded-lg border border-white/15 text-white hover:border-cn-gold hover:text-cn-gold transition-colors z-20"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      )}
    </section>
  );
}
