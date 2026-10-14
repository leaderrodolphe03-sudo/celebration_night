"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

type Direction = "left" | "right";

interface PhotoItem {
  id: number;
  order: number;
  desktopX: number;
  desktopY: number;
  mobileX: number;
  mobileY: number;
  defaultRotate: number;
  zIndex: number;
  direction: Direction;
  src: string;
}

const PHOTOS: PhotoItem[] = [
  {
    id: 1,
    order: 0,
    desktopX: -300,
    desktopY: 16,
    mobileX: -76,
    mobileY: 10,
    defaultRotate: -4,
    zIndex: 50,
    direction: "left",
    src: "/images/hero/card-1.jpg",
  },
  {
    id: 2,
    order: 1,
    desktopX: -150,
    desktopY: 30,
    mobileX: -38,
    mobileY: 20,
    defaultRotate: -2,
    zIndex: 40,
    direction: "left",
    src: "/images/hero/card-2.jpg",
  },
  {
    id: 3,
    order: 2,
    desktopX: 0,
    desktopY: 6,
    mobileX: 0,
    mobileY: 4,
    defaultRotate: 1,
    zIndex: 30,
    direction: "right",
    src: "/images/hero/card-3.jpg",
  },
  {
    id: 4,
    order: 3,
    desktopX: 150,
    desktopY: 22,
    mobileX: 38,
    mobileY: 16,
    defaultRotate: 3,
    zIndex: 20,
    direction: "right",
    src: "/images/hero/card-4.jpg",
  },
  {
    id: 5,
    order: 4,
    desktopX: 300,
    desktopY: 40,
    mobileX: 76,
    mobileY: 26,
    defaultRotate: -2,
    zIndex: 10,
    direction: "left",
    src: "/images/hero/card-5.jpg",
  },
];

export default function HeroPhotoGallery({
  animationDelay = 0.3,
}: {
  animationDelay?: number;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activePhotoId, setActivePhotoId] = useState<number | null>(null);

  useEffect(() => {
    setIsMounted(true);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Dimensions adaptatives des cartes
  const cardWidth = isMobile ? 148 : 220;
  const cardHeight = isMobile ? 186 : 260;

  // Variantes du conteneur
  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  // Variantes de chaque photo (ouverture en éventail)
  const photoVariants: Variants = {
    hidden: {
      x: 0,
      y: 0,
      rotate: 0,
      scale: 0.85,
      opacity: 0,
    },
    visible: (custom: { x: number; y: number; rotate: number; order: number }) => ({
      x: custom.x,
      y: custom.y,
      rotate: custom.rotate,
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 75,
        damping: 14,
        mass: 0.9,
        delay: custom.order * 0.12,
      },
    }),
  };

  return (
    <div className="relative w-full select-none">
      {/* Halo lumineux d'ambiance doré subtil centré */}
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[500px] h-[200px] bg-[#F59E0B]/10 blur-[80px] pointer-events-none rounded-full"
      />

      {/* Zone d'affichage de la galerie */}
      <div className="relative h-[220px] sm:h-[280px] md:h-[300px] w-full flex items-center justify-center">
        <motion.div
          className="relative mx-auto flex w-full max-w-5xl justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isMounted ? 1 : 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <motion.div
            className="relative flex w-full justify-center items-center"
            variants={containerVariants}
            initial="hidden"
            animate={isMounted ? "visible" : "hidden"}
          >
            {/* Boîte pivot centrale aux dimensions d'une carte */}
            <div
              className="relative"
              style={{ width: `${cardWidth}px`, height: `${cardHeight}px` }}
            >
              {[...PHOTOS].reverse().map((photo) => {
                const targetX = isMobile ? photo.mobileX : photo.desktopX;
                const targetY = isMobile ? photo.mobileY : photo.desktopY;
                const isCardActive = activePhotoId === photo.id;
                const currentZIndex = isCardActive ? 999 : photo.zIndex;

                return (
                  <motion.div
                    key={photo.id}
                    className="absolute left-0 top-0 cursor-pointer"
                    style={{ zIndex: currentZIndex }}
                    variants={photoVariants}
                    custom={{
                      x: targetX,
                      y: targetY,
                      rotate: photo.defaultRotate,
                      order: photo.order,
                    }}
                    onClick={() => setActivePhotoId(photo.id === activePhotoId ? null : photo.id)}
                  >
                    <motion.div
                      drag={!isMobile}
                      dragConstraints={{ left: -50, right: 50, top: -30, bottom: 30 }}
                      dragElastic={0.15}
                      whileHover={
                        !isMobile
                          ? {
                              scale: 1.08,
                              rotate: 0,
                              y: targetY - 12,
                              transition: { duration: 0.2 },
                            }
                          : undefined
                      }
                      whileTap={{
                        scale: 1.04,
                        rotate: 0,
                        transition: { duration: 0.15 },
                      }}
                      style={{
                        width: `${cardWidth}px`,
                        height: `${cardHeight}px`,
                        touchAction: "pan-y", // Permet le scroll vertical natif fluide sur mobile
                      }}
                      className={cn(
                        "relative rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl transition-all duration-300",
                        "border border-white/10 bg-[#0D0D0D]"
                      )}
                    >
                      {/* Image photographique épurée */}
                      <Image
                        src={photo.src}
                        alt="Moment de CELEBRATION Night"
                        fill
                        sizes="(max-width: 768px) 150px, 220px"
                        className="object-cover object-center transition-transform duration-500"
                        draggable={false}
                      />
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
