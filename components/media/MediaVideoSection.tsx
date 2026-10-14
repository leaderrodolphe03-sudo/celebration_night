"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Play, X, Video as VideoIcon, Sparkles } from "lucide-react";

export interface MediaVideoItem {
  id: string;
  title: string;
  tag: string;
  duration: string;
  description: string;
  videoSrc: string;
  poster: string;
}

const MEDIA_VIDEOS: MediaVideoItem[] = [
  {
    id: "worship-session",
    title: "Session Live — Worship & Adoration",
    tag: "Worship Session Live",
    duration: "08:38",
    description:
      "Temps fort de louange et d'adoration en direct, porté par la ferveur, l'onction et l'esprit de CELEBRATION NIGHT.",
    videoSrc: "/video/worship-session.mp4",
    poster: "/video/thumbnails/worship-session.jpg",
  },
  {
    id: "podcast-story-times",
    title: "Story Times — Témoignages & Coulisses",
    tag: "Podcast & Échanges",
    duration: "12:32",
    description:
      "Plongez dans les coulisses de la préparation, les partages spontanés et les témoignages de foi avec l'équipe HAGÏAZO Ministry.",
    videoSrc: "/video/podcast-story-times.mp4",
    poster: "/video/thumbnails/podcast-story-times.jpg",
  },
];

export default function MediaVideoSection() {
  const [selectedVideo, setSelectedVideo] = useState<MediaVideoItem | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Verrouiller le scroll de la page lorsque la modale est active
  useEffect(() => {
    if (selectedVideo) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedVideo]);

  // Écoute de la touche Échap pour fermer la modale
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };
    if (selectedVideo) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedVideo]);

  const closeModal = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setSelectedVideo(null);
  };

  return (
    <>
      {/* Grille des vidéos parfaitement centrée */}
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 justify-center">
          {MEDIA_VIDEOS.map((vid) => (
            <article
              key={vid.id}
              onClick={() => setSelectedVideo(vid)}
              className="group cursor-pointer rounded-2xl border border-white/10 bg-cn-dark overflow-hidden transition-all duration-300 hover:border-cn-gold/50 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-cn-gold/10 flex flex-col"
            >
              {/* Conteneur Miniature 16:9 avec Poster HD */}
              <div className="relative aspect-video w-full overflow-hidden bg-cn-black">
                <Image
                  src={vid.poster}
                  alt={vid.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  priority
                />

                {/* Voile dégradé cinéma */}
                <div className="absolute inset-0 bg-gradient-to-t from-cn-black via-transparent to-black/30 opacity-70 group-hover:opacity-50 transition-opacity" />

                {/* Badge de catégorie */}
                <span className="absolute top-3 left-3 rounded-full bg-black/70 backdrop-blur-md px-3 py-1 text-[11px] font-semibold text-cn-gold border border-cn-gold/30">
                  {vid.tag}
                </span>

                {/* Badge de durée */}
                <span className="absolute bottom-3 right-3 rounded-md bg-black/85 backdrop-blur-sm px-2.5 py-0.5 text-[11px] font-medium text-white border border-white/10">
                  {vid.duration}
                </span>

                {/* Bouton Play animé au centre */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-16 w-16 rounded-full bg-cn-gold text-cn-black flex items-center justify-center shadow-lg shadow-black/50 transition-all duration-300 group-hover:scale-115 group-hover:bg-cn-gold-light">
                    <Play size={26} className="fill-[#1C1613] ml-1 text-cn-black" />
                  </div>
                </div>
              </div>

              {/* Contenu textuel */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-heading text-2xl uppercase tracking-wide text-white group-hover:text-cn-gold-light transition-colors">
                    {vid.title}
                  </h3>
                  <p className="mt-3 text-sm text-cn-gray-300 leading-relaxed font-body">
                    {vid.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-cn-gold group-hover:text-cn-gold-light transition-colors">
                  <span className="flex items-center gap-1.5">
                    <Play size={14} className="fill-current" />
                    Lancer la vidéo
                  </span>
                  <span className="text-cn-gray-400 font-normal">HD 720p</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        
      </div>

      {/* Lecteur Vidéo Modal Cinématique */}
      {selectedVideo && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selectedVideo.title}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-4xl rounded-2xl bg-cn-dark border border-white/15 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Barre d'en-tête de la modale */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-cn-deep border-b border-white/10">
              <div className="flex items-center gap-2 overflow-hidden">
                <VideoIcon size={18} className="text-cn-gold shrink-0" />
                <span className="font-heading text-lg sm:text-xl uppercase tracking-wide text-white truncate">
                  {selectedVideo.title}
                </span>
                <span className="hidden sm:inline-block rounded-md bg-white/10 px-2 py-0.5 text-[11px] text-cn-gray-300">
                  {selectedVideo.tag}
                </span>
              </div>
              <button
                type="button"
                onClick={closeModal}
                aria-label="Fermer la vidéo"
                className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors shrink-0 ml-2"
              >
                <X size={20} />
              </button>
            </div>

            {/* Lecteur Vidéo HTML5 natif optimisé */}
            <div className="relative aspect-video w-full bg-black">
              <video
                ref={videoRef}
                src={selectedVideo.videoSrc}
                poster={selectedVideo.poster}
                controls
                autoPlay
                playsInline
                preload="metadata"
                className="w-full h-full object-contain bg-black outline-none"
              >
                Votre navigateur ne prend pas en charge la lecture vidéo HTML5.
              </video>
            </div>

            {/* Pied d'information de la modale */}
            <div className="p-4 sm:p-5 bg-cn-dark flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-white/10 text-xs text-cn-gray-300">
              <p className="max-w-2xl font-body leading-relaxed text-cn-gray-300">
                {selectedVideo.description}
              </p>
              <div className="flex items-center gap-3 shrink-0 text-cn-gray-400">
                <span className="font-semibold text-cn-gold">Durée : {selectedVideo.duration}</span>
                <span>•</span>
                <span>Qualité HD Web</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
