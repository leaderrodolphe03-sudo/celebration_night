"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Flame,
  Music2,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import {
  Autoplay,
  EffectCoverflow,
  Navigation,
  Pagination,
} from "swiper/modules";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { cn } from "@/lib/utils";

export interface HeroCardSlide {
  id: string;
  image: string;
  tag: string;
  tagColor: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
}

export const HERO_SLIDES: HeroCardSlide[] = [
  {
    id: "card-1",
    image: "/images/hero/card-1.jpg",
    tag: "PAROLE & EXHORTATION",
    tagColor: "bg-[#F59E0B] text-[#080808]",
    icon: Flame,
    title: "Parole Vivante",
    subtitle: "L'exhortation qui réveille et fortifie la foi",
  },
  {
    id: "card-2",
    image: "/images/hero/card-2.jpg",
    tag: "PRIÈRE & HUMILITÉ",
    tagColor: "bg-white/90 text-[#080808]",
    icon: Heart,
    title: "Prière Profonde",
    subtitle: "À genoux devant le Trône de grâce",
  },
  {
    id: "card-3",
    image: "/images/hero/card-3.jpg",
    tag: "LOUANGE SACRÉE",
    tagColor: "bg-[#EA580C] text-white",
    icon: Music2,
    title: "Adoration en Esprit",
    subtitle: "Une voix qui s'élève vers le sanctuaire céleste",
  },
  {
    id: "card-4",
    image: "/images/hero/card-4.jpg",
    tag: "FERVEUR & ABANDON",
    tagColor: "bg-[#F59E0B] text-[#080808]",
    icon: Users,
    title: "Mains Levées",
    subtitle: "L'assemblée tout entière portée par une même flamme",
  },
  {
    id: "card-5",
    image: "/images/hero/card-5.jpg",
    tag: "ACTION DE GRÂCE",
    tagColor: "bg-white/90 text-[#080808]",
    icon: Sparkles,
    title: "Chant d'Allégresse",
    subtitle: "Célébrer la grandeur et les hauts faits de Dieu",
  },
  {
    id: "card-6",
    image: "/images/hero/card-6.jpg",
    tag: "COMMUNION & CHŒUR",
    tagColor: "bg-[#EA580C] text-white",
    icon: Music2,
    title: "Chœur & Assemblée",
    subtitle: "Des voix unies pour illuminer la nuit",
  },
];

/**
 * Boutons de navigation interactive intégrés au contexte Swiper
 */
function NavigationButtons() {
  const swiper = useSwiper();

  return (
    <>
      <button
        type="button"
        onClick={() => swiper.slidePrev()}
        aria-label="Image précédente"
        className="hero-swiper-btn-prev absolute left-1 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/65 text-white backdrop-blur-md transition-all duration-300 hover:border-[#F59E0B] hover:bg-[#F59E0B] hover:text-[#080808] hover:scale-110 shadow-[0_4px_20px_rgba(0,0,0,0.6)] cursor-pointer"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={() => swiper.slideNext()}
        aria-label="Image suivante"
        className="hero-swiper-btn-next absolute right-1 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/65 text-white backdrop-blur-md transition-all duration-300 hover:border-[#F59E0B] hover:bg-[#F59E0B] hover:text-[#080808] hover:scale-110 shadow-[0_4px_20px_rgba(0,0,0,0.6)] cursor-pointer"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </>
  );
}

interface HeroCoverflowProps {
  slides?: HeroCardSlide[];
  className?: string;
  showPagination?: boolean;
  showNavigation?: boolean;
  loop?: boolean;
  autoplay?: boolean;
}

export function HeroCoverflow({
  slides = HERO_SLIDES,
  className,
  showPagination = true,
  showNavigation = true,
  loop = true,
  autoplay = true,
}: HeroCoverflowProps) {
  const coverflowStyles = `
    .hero-coverflow-slider {
      width: 100%;
      height: 350px;
      padding-top: 10px !important;
      padding-bottom: 45px !important;
      overflow: visible !important;
    }

    /* Par défaut, toutes les cartes hors du trio (active, prev, next) sont invisibles */
    .hero-coverflow-slider .swiper-slide {
      background-position: center;
      background-size: cover;
      width: 205px;
      height: 285px;
      border-radius: 1rem;
      opacity: 0 !important;
      visibility: hidden;
      pointer-events: none !important;
      transition: opacity 0.45s ease, transform 0.45s ease, filter 0.3s ease, visibility 0.45s ease;
    }

    @media (min-width: 640px) {
      .hero-coverflow-slider {
        height: 380px;
      }
      .hero-coverflow-slider .swiper-slide {
        width: 230px;
        height: 320px;
      }
    }

    /* Carte active (centre) : mise en avant, nette et 100% visible */
    .hero-coverflow-slider .swiper-slide.swiper-slide-active {
      opacity: 1 !important;
      visibility: visible !important;
      pointer-events: auto !important;
      z-index: 10 !important;
    }

    /* Cartes adjacentes (gauche et droite) : visibles en retrait */
    .hero-coverflow-slider .swiper-slide.swiper-slide-prev,
    .hero-coverflow-slider .swiper-slide.swiper-slide-next {
      opacity: 0.75 !important;
      visibility: visible !important;
      pointer-events: auto !important;
      z-index: 5 !important;
    }

    .hero-coverflow-slider .swiper-slide-shadow-left,
    .hero-coverflow-slider .swiper-slide-shadow-right {
      border-radius: 1rem !important;
      background-image: linear-gradient(to right, rgba(8, 8, 8, 0.75), rgba(0, 0, 0, 0.4)) !important;
    }

    .hero-coverflow-slider .swiper-pagination {
      bottom: 6px !important;
    }

    .hero-coverflow-slider .swiper-pagination-bullet {
      background-color: rgba(255, 255, 255, 0.25) !important;
      opacity: 1 !important;
      width: 8px !important;
      height: 8px !important;
      margin: 0 4px !important;
      transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1) !important;
    }

    .hero-coverflow-slider .swiper-pagination-bullet-active {
      background-color: #F59E0B !important;
      width: 28px !important;
      border-radius: 9999px !important;
      box-shadow: 0 0 12px rgba(245, 158, 11, 0.8) !important;
    }
  `;

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        duration: 0.6,
        delay: 0.2,
        ease: "easeOut",
      }}
      className={cn("relative w-full max-w-md mx-auto px-2 sm:px-4", className)}
    >
      <style>{coverflowStyles}</style>

      {/* Lueur d'or ambré décorative en arrière-plan */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-4 rounded-full bg-gradient-to-r from-[#F59E0B]/20 via-[#EA580C]/15 to-[#FCD34D]/20 blur-3xl -z-10"
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full relative"
      >
        <Swiper
          effect="coverflow"
          grabCursor={true}
          slidesPerView="auto"
          centeredSlides={true}
          loop={loop}
          slideToClickedSlide={true}
          autoplay={
            autoplay
              ? {
                  delay: 2800,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }
              : false
          }
          coverflowEffect={{
            rotate: 20,
            stretch: 0,
            depth: 80,
            modifier: 1,
            slideShadows: true,
          }}
          pagination={
            showPagination
              ? {
                  clickable: true,
                }
              : false
          }
          className="hero-coverflow-slider"
          modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
        >
          {slides.map((slide) => {
            return (
              <SwiperSlide key={slide.id}>
                <div className="group relative h-full w-full overflow-hidden rounded-2xl bg-[#140507] shadow-[0_16px_40px_rgba(0,0,0,0.85)] select-none">
                  <img
                    src={slide.image}
                    alt="Célébration Night"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="eager"
                    draggable={false}
                  />
                </div>
              </SwiperSlide>
            );
          })}

          {showNavigation && <NavigationButtons />}
        </Swiper>
      </motion.div>
    </motion.div>
  );
}

// Alias et rétrocompatibilité
export const Carousel_003 = HeroCoverflow;
export const Skiper49 = HeroCoverflow;
export default HeroCoverflow;
