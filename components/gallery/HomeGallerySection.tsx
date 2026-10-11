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
    <section className="bg-[#080808] border-t border-white/6 px-5 py-24 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">

        {/* En-tête inspiré Effuzion */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 mb-10 border-b border-white/6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="h-px w-6 bg-[#F59E0B]" />
              <span className="font-body text-[11px] font-bold uppercase tracking-[0.2em] text-[#F59E0B]">
                Toutes éditions confondues
              </span>
            </div>
            <h2 className="font-heading text-[clamp(2.2rem,5vw,4.5rem)] uppercase leading-[0.92] tracking-wide text-white">
              ILS ÉTAIENT À LA<br />
              <span className="text-[#F59E0B]">CÉLÉBRATION NIGHT</span>
            </h2>
          </div>
          <Link
            href="/medias"
            className="group shrink-0 inline-flex items-center gap-2 rounded-sm bg-[#120E0A] border border-[#F59E0B]/30 px-5 py-3 font-body text-xs font-bold uppercase tracking-wider text-[#FCD34D] hover:bg-[#F59E0B] hover:text-[#080808] hover:border-[#F59E0B] transition-all shadow-md"
          >
            <span>Voir toute la galerie</span>
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Grille 5×2 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {GALLERY_PHOTOS.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              className="group relative aspect-[3/4] cursor-pointer overflow-hidden rounded-md bg-[#120E0A] border border-white/8 hover:border-[#F59E0B]/50 transition-all duration-300 shadow-md hover:shadow-[0_8px_30px_rgba(245,158,11,0.2)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.src}
                alt={photo.title}
                className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              {/* Voile */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/95 via-[#080808]/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Texte bas */}
              <div className="absolute inset-x-0 bottom-0 p-3.5 transition-all duration-300">
                <span className="inline-block rounded-xs bg-[#F59E0B]/20 border border-[#F59E0B]/40 px-1.5 py-0.5 font-body text-[8.5px] font-bold uppercase tracking-wider text-[#FCD34D] mb-1">
                  {photo.tag}
                </span>
                <p className="font-heading text-sm sm:text-base uppercase tracking-wide text-white leading-tight line-clamp-1 group-hover:text-[#FCD34D] transition-colors">
                  {photo.title}
                </p>
              </div>

              {/* Icône loupe */}
              <div className="absolute top-2.5 right-2.5 h-7 w-7 rounded-full bg-[#080808]/80 border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Eye size={12} className="text-[#F59E0B]" />
              </div>
            </div>
          ))}
        </div>

        {/* Sous-note */}
        <p className="mt-8 text-center text-xs text-[#7D7560]">
          Photos réelles prises en direct lors des rassemblements. Plus de clichés sur la{" "}
          <Link href="/medias" className="text-[#F59E0B] hover:text-[#FCD34D] hover:underline font-semibold">
            page Médias &amp; Galerie
          </Link>.
        </p>
      </div>

      {/* LIGHTBOX */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#080808]/98 p-4 sm:p-8 backdrop-blur-sm"
        >
          <button
            type="button"
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-5 right-5 h-10 w-10 flex items-center justify-center border border-white/15 text-white hover:border-white/30 hover:text-[#F59E0B] transition-colors z-20"
          >
            <X size={20} />
          </button>
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 h-11 w-11 flex items-center justify-center border border-white/15 text-white hover:border-[#F59E0B] hover:text-[#F59E0B] transition-colors z-20"
          >
            <ChevronLeft size={22} />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[85vh] max-w-4xl overflow-hidden border border-white/10 bg-[#0F0B07]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedPhoto.src}
              alt={selectedPhoto.title}
              className="max-h-[75vh] w-auto object-contain mx-auto"
            />
            <div className="px-6 py-4 border-t border-white/8 flex items-center justify-between">
              <div>
                <span className="block font-body text-[10px] font-bold uppercase tracking-wider text-[#F59E0B] mb-0.5">
                  {selectedPhoto.tag}
                </span>
                <h3 className="font-heading text-xl uppercase tracking-wide text-white">
                  {selectedPhoto.title}
                </h3>
              </div>
              <Link
                href="/medias"
                className="text-xs font-bold uppercase tracking-wider text-[#F59E0B] hover:text-[#FCD34D] transition-colors"
              >
                Voir la médiathèque →
              </Link>
            </div>
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 h-11 w-11 flex items-center justify-center border border-white/15 text-white hover:border-[#F59E0B] hover:text-[#F59E0B] transition-colors z-20"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      )}
    </section>
  );
}
