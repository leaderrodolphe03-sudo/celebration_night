"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, X, ChevronLeft, ChevronRight, Eye } from "lucide-react";

interface GalleryPhoto {
  id: number;
  src: string;
  title: string;
  tag: string;
}

const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: 1,
    src: "/images/gallery/photo-1.jpg",
    title: "Grand Chœur HAGIAZO",
    tag: "Chorale Live",
  },
  {
    id: 2,
    src: "/images/gallery/photo-2.jpg",
    title: "Section Rythmique & Claviers",
    tag: "Musiciens",
  },
  {
    id: 3,
    src: "/images/gallery/photo-3.jpg",
    title: "L'Assemblée les mains levées",
    tag: "Adoration",
  },
  {
    id: 4,
    src: "/images/gallery/photo-4.jpg",
    title: "Chantre soliste en intimité",
    tag: "Louange",
  },
  {
    id: 5,
    src: "/images/gallery/photo-5.jpg",
    title: "Percussions & Batterie sacrée",
    tag: "Énergie",
  },
  {
    id: 6,
    src: "/images/gallery/photo-6.jpg",
    title: "Temps d'Intercession communautaire",
    tag: "Prière",
  },
  {
    id: 7,
    src: "/images/gallery/photo-7.jpg",
    title: "Fervente adoratrice en prière",
    tag: "Consécration",
  },
  {
    id: 8,
    src: "/images/gallery/photo-8.jpg",
    title: "Prédication & Proclamation",
    tag: "Exhortation",
  },
  {
    id: 9,
    src: "/images/gallery/photo-9.jpg",
    title: "Harmonies & Direction vocale",
    tag: "Soliste",
  },
  {
    id: 10,
    src: "/images/gallery/photo-10.jpg",
    title: "Peuple de Dieu rassemblé",
    tag: "Communion",
  },
];

export default function HomeGallerySection() {
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedPhoto) return;
    const currentIndex = GALLERY_PHOTOS.findIndex((p) => p.id === selectedPhoto.id);
    const prevIndex = (currentIndex - 1 + GALLERY_PHOTOS.length) % GALLERY_PHOTOS.length;
    setSelectedPhoto(GALLERY_PHOTOS[prevIndex]);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedPhoto) return;
    const currentIndex = GALLERY_PHOTOS.findIndex((p) => p.id === selectedPhoto.id);
    const nextIndex = (currentIndex + 1) % GALLERY_PHOTOS.length;
    setSelectedPhoto(GALLERY_PHOTOS[nextIndex]);
  };

  return (
    <section className="relative bg-[#0A0304] px-4 py-20 sm:px-6 lg:px-8 border-t border-white/10 overflow-hidden">
      {/* Halo d'ambiance */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-1/4 h-96 w-96 rounded-full bg-[#E5252A]/15 blur-[120px]"
      />

      <div className="relative mx-auto max-w-7xl">
        {/* EN-TÊTE : Titre à gauche, Bouton à droite */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8 mb-12">
          {/* Titre aligné à gauche */}
          <div className="text-left">
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#E5252A] block mb-2">
              Moments de Grâce & d&apos;Adoration
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl lg:text-6xl uppercase tracking-wide text-white leading-none">
              ILS ÉTAIENT À LA CÉLÉBRATION NIGHT
            </h2>
          </div>

          {/* Bouton Voir la galerie aligné à droite */}
          <div className="shrink-0">
            <Link
              href="/medias"
              className="inline-flex items-center gap-2.5 rounded-md border border-[#F5B900]/40 bg-[#F5B900]/10 hover:bg-[#F5B900] px-6 py-3 font-body text-xs font-bold uppercase tracking-wider text-[#FFD84A] hover:text-[#0A0304] transition-all hover:scale-105 shadow-lg group"
            >
              <span>Voir la galerie</span>
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* GRILLE DES 10 PHOTOS (2 lignes de 5 photos sur grand écran) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
          {GALLERY_PHOTOS.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-2xl border-2 border-white/15 bg-[#140507] shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#F5B900] hover:shadow-[0_10px_30px_rgba(229,37,42,0.3)]"
            >
              {/* Image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.src}
                alt={photo.title}
                className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />

              {/* Voile dégradé sombre en bas */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0304]/90 via-[#0A0304]/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

              {/* Badge & Titre de la photo */}
              <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 flex flex-col justify-end text-left">
                <span className="inline-block text-[9px] font-bold uppercase tracking-wider text-[#FFD84A] mb-0.5">
                  {photo.tag}
                </span>
                <p className="font-heading text-sm sm:text-base uppercase tracking-wide text-white group-hover:text-[#FFD84A] transition-colors leading-tight line-clamp-1">
                  {photo.title}
                </p>
              </div>

              {/* Icône d'ouverture au survol */}
              <div className="absolute top-2.5 right-2.5 h-7 w-7 rounded-full bg-[#0A0304]/80 border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Eye size={13} className="text-[#FFD84A]" />
              </div>
            </div>
          ))}
        </div>

        {/* Sous-titre informatif */}
        <div className="mt-8 text-center text-xs text-cn-gray-400">
          <p>
            Plus de 50 clichés haute résolution, vidéos intégrales et teasers officiels sont disponibles sur la{" "}
            <Link href="/medias" className="text-[#FFD84A] hover:underline font-semibold">
              page Médias & Galerie
            </Link>.
          </p>
        </div>
      </div>

      {/* LIGHTBOX MODALE AU CLIC */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 sm:p-8 backdrop-blur-xl animate-in fade-in duration-200"
        >
          {/* Bouton Fermer */}
          <button
            type="button"
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-6 right-6 h-11 w-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-[#E5252A] transition-colors z-20"
          >
            <X size={22} />
          </button>

          {/* Navigation Précédent */}
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-20"
          >
            <ChevronLeft size={26} />
          </button>

          {/* Image Agrandie */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[85vh] max-w-5xl overflow-hidden rounded-3xl border-2 border-white/30 bg-[#0A0304] shadow-[0_25px_60px_rgba(0,0,0,0.9)]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedPhoto.src}
              alt={selectedPhoto.title}
              className="max-h-[75vh] w-auto object-contain mx-auto"
            />
            <div className="p-4 sm:p-6 bg-[#140507] border-t border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFD84A]">
                  {selectedPhoto.tag}
                </span>
                <h3 className="font-heading text-xl sm:text-2xl uppercase tracking-wide text-white">
                  {selectedPhoto.title}
                </h3>
              </div>
              <Link
                href="/medias"
                className="text-xs font-bold uppercase tracking-wider text-[#FFD84A] hover:underline"
              >
                Voir toute la médiathèque →
              </Link>
            </div>
          </div>

          {/* Navigation Suivant */}
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-20"
          >
            <ChevronRight size={26} />
          </button>
        </div>
      )}
    </section>
  );
}
