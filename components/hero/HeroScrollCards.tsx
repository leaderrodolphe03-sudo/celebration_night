"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import {
  Sparkles,
  Flame,
  Heart,
  Music2,
  Users,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
} from "lucide-react";

interface HeroCardItem {
  id: string;
  image: string;
  tag: string;
  tagColor: string;
  icon: typeof Sparkles;
  title: string;
  subtitle: string;
  baseTilt: number; // Inclinaison de base en degrés (style poster)
}

const HERO_CARDS: HeroCardItem[] = [
  {
    id: "card-1",
    image: "/images/hero/card-1.jpg",
    tag: "ADORATION PROFONDE",
    tagColor: "bg-[#E5252A] text-white",
    icon: Heart,
    title: "En Esprit & Vérité",
    subtitle: "Une soif inextinguible de la Présence divine",
    baseTilt: -7,
  },
  {
    id: "card-2",
    image: "/images/hero/card-2.jpg",
    tag: "PAROLE & FEU",
    tagColor: "bg-[#F5B900] text-[#0A0304]",
    icon: Flame,
    title: "Impact & Réveil",
    subtitle: "Une exhortation vibrante pour notre génération",
    baseTilt: 6,
  },
  {
    id: "card-3",
    image: "/images/hero/card-3.jpg",
    tag: "LOUANGE SACRÉE",
    tagColor: "bg-[#B71C1C] text-white",
    icon: Music2,
    title: "Chœur & Orchestre",
    subtitle: "25+ voix unies dans un même cantique nouveau",
    baseTilt: -8,
  },
  {
    id: "card-4",
    image: "/images/hero/card-4.jpg",
    tag: "COMMUNION SACRÉE",
    tagColor: "bg-white text-[#B71C1C]",
    icon: Sparkles,
    title: "Génération Embrasée",
    subtitle: "Des milliers de cœurs battant à l'unisson",
    baseTilt: 5,
  },
  {
    id: "card-5",
    image: "/images/gallery/photo-3.jpg",
    tag: "FERVEUR & PRIÈRE",
    tagColor: "bg-[#E5252A] text-white",
    icon: Users,
    title: "Mains Levées",
    subtitle: "L'assemblée portée par une même consécration",
    baseTilt: -5,
  },
  {
    id: "card-6",
    image: "/images/gallery/photo-1.jpg",
    tag: "CHŒUR HAGIAZO",
    tagColor: "bg-[#F5B900] text-[#0A0304]",
    icon: Music2,
    title: "Symphonie Céleste",
    subtitle: "Une onde de gloire qui traverse le sanctuaire",
    baseTilt: 8,
  },
];

export default function HeroScrollCards() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [angle, setAngle] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [dimensions, setDimensions] = useState({
    rx: 205,
    ry: 60,
    rz: 175,
    tiltY: 32,
    cardWidth: 230,
    cardHeight: 306,
  });

  // Références d'animation pour garantir 60/120 FPS sans saccade React
  const angleRef = useRef(0);
  const velocityRef = useRef(0);
  const isDraggingRef = useRef(false);
  const isHoveredRef = useRef(false);
  const isPausedRef = useRef(false);
  const lastPointerXRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);
  const targetAngleRef = useRef<number | null>(null);

  // Synchronisation des refs
  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  // Détection responsive de la taille de l'écran pour calibrer l'orbite 3D
  const updateDimensions = useCallback(() => {
    if (typeof window === "undefined") return;
    const w = window.innerWidth;
    if (w < 640) {
      // Écrans mobiles
      setDimensions({
        rx: 115,
        ry: 38,
        rz: 95,
        tiltY: 18,
        cardWidth: 165,
        cardHeight: 220,
      });
    } else if (w < 1024) {
      // Tablettes
      setDimensions({
        rx: 160,
        ry: 50,
        rz: 135,
        tiltY: 26,
        cardWidth: 200,
        cardHeight: 266,
      });
    } else {
      // Desktop
      setDimensions({
        rx: 210,
        ry: 65,
        rz: 180,
        tiltY: 35,
        cardWidth: 235,
        cardHeight: 312,
      });
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [updateDimensions]);

  // Boucle d'animation fluide 60 FPS
  useEffect(() => {
    if (!mounted) return;

    let animId: number;
    const baseSpeed = 0.0024; // Vitesse de rotation cinématique constante

    const loop = (time: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = time;
      }
      const dt = Math.min((time - lastTimeRef.current) / 16.667, 2.5); // Normalisé ~1 à 60fps
      lastTimeRef.current = time;

      if (!isDraggingRef.current) {
        // Si une cible d'angle est définie (ex: clic carte ou flèches)
        if (targetAngleRef.current !== null) {
          const diff = targetAngleRef.current - angleRef.current;
          if (Math.abs(diff) > 0.005) {
            angleRef.current += diff * 0.08 * dt;
          } else {
            angleRef.current = targetAngleRef.current;
            targetAngleRef.current = null;
          }
        } else {
          // Gestion de l'inertie après un lancer/glisser
          if (Math.abs(velocityRef.current) > 0.0001) {
            angleRef.current += velocityRef.current * dt;
            velocityRef.current *= Math.pow(0.92, dt);
          } else {
            velocityRef.current = 0;
            // Vitesse normale si pas en pause ni survol
            if (!isPausedRef.current && !isHoveredRef.current) {
              angleRef.current += baseSpeed * dt;
            }
          }
        }
      }

      // Normaliser l'angle pour éviter tout débordement numérique
      if (angleRef.current > Math.PI * 2) {
        angleRef.current -= Math.PI * 2;
        if (targetAngleRef.current !== null) {
          targetAngleRef.current -= Math.PI * 2;
        }
      } else if (angleRef.current < -Math.PI * 2) {
        angleRef.current += Math.PI * 2;
        if (targetAngleRef.current !== null) {
          targetAngleRef.current += Math.PI * 2;
        }
      }

      setAngle(angleRef.current);
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [mounted]);

  // Gestion du glissé / Drag tactile et souris
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    setIsDragging(true);
    targetAngleRef.current = null;
    lastPointerXRef.current = e.clientX;
    velocityRef.current = 0;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - lastPointerXRef.current;
    lastPointerXRef.current = e.clientX;
    // Déplacement angulaire proportionnel
    const sensitivity = 0.0045;
    const moveAngle = deltaX * sensitivity;
    angleRef.current += moveAngle;
    velocityRef.current = moveAngle;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setIsDragging(false);
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Ignorer si déjà relâché
      }
    }
  };

  // Naviguer vers la carte précédente ou suivante
  const rotateTo = (step: number) => {
    const cardStep = (Math.PI * 2) / HERO_CARDS.length;
    const current = angleRef.current;
    const target = Math.round(current / cardStep + step) * cardStep;
    targetAngleRef.current = target;
  };

  // Trouver l'index de la carte actuellement au premier plan
  const cardCount = HERO_CARDS.length;
  const cardStep = (Math.PI * 2) / cardCount;
  const normalizedAngle = ((-angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
  const activeIndex = Math.round(normalizedAngle / cardStep) % cardCount;

  return (
    <div
      ref={containerRef}
      className="relative w-full select-none flex flex-col items-center justify-center py-2 sm:py-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="region"
      aria-label="Carrousel 3D d'ambiance et moments sacrés"
    >
      {/* 1. Halo lumineux d'arrière-plan (lumière de scène & braise sacrée) */}
      <div
        aria-hidden
        className="pointer-events-none absolute h-[360px] w-[360px] sm:h-[480px] sm:w-[480px] rounded-full bg-gradient-to-tr from-[#E5252A]/25 via-[#F5B900]/15 to-transparent blur-[110px] -z-10"
      />

      {/* 2. Espace 3D avec perspective prononcée */}
      <div
        className={`relative w-full h-[380px] sm:h-[460px] lg:h-[520px] flex items-center justify-center touch-pan-y ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        style={{
          perspective: "1100px",
          perspectiveOrigin: "50% 48%",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Conteneur 3D centré préservant les coordonnées Z */}
        <div
          className="relative w-0 h-0"
          style={{ transformStyle: "preserve-3d" }}
        >
          {HERO_CARDS.map((card, i) => {
            const phi = angle + i * cardStep;

            // Coordonnées sur l'ellipse 3D inclinée
            const x = Math.sin(phi) * dimensions.rx;
            const z = Math.cos(phi) * dimensions.rz;
            // Inclinaison de l'axe orbital (style vortex/spiral de l'affiche CU Chapel)
            const y = -Math.cos(phi) * dimensions.ry + Math.sin(phi) * dimensions.tiltY;

            // Facteur de profondeur normalisé : 0 (tout au fond) à 1 (tout devant)
            const depthFactor = (z + dimensions.rz) / (2 * dimensions.rz);

            // Échelle dynamique : les cartes au fond sont petites (0.70x), au premier plan géantes (1.18x)
            const scale = 0.7 + depthFactor * 0.48;

            // Opacité progressive pour fondre l'arrière-plan
            const opacity = 0.52 + depthFactor * 0.48;

            // Angles de rotation 3D de la carte sur elle-même
            const rotY = -Math.sin(phi) * 16; // Regarde légèrement vers le centre
            const rotX = Math.cos(phi) * 8; // Incline selon sa hauteur
            const rotZ = card.baseTilt + Math.sin(phi) * 3; // Inclinaison de style affiche

            // Ordre d'empilement (les cartes devant passent au-dessus)
            const zIndex = Math.round(depthFactor * 50) + 1;

            const isFrontCard = depthFactor > 0.85;
            const IconComponent = card.icon;

            return (
              <div
                key={card.id}
                onClick={(e) => {
                  // Clic sur une carte en arrière-plan pour la faire pivoter au premier plan
                  if (!isDragging && !isFrontCard) {
                    e.stopPropagation();
                    const target = -i * cardStep;
                    let diff = (target - (angleRef.current % (Math.PI * 2))) % (Math.PI * 2);
                    if (diff > Math.PI) diff -= Math.PI * 2;
                    if (diff < -Math.PI) diff += Math.PI * 2;
                    targetAngleRef.current = angleRef.current + diff;
                  }
                }}
                className={`absolute left-0 top-0 transition-shadow duration-300 ${
                  isFrontCard ? "ring-2 ring-[#FFD84A]/60" : "cursor-pointer"
                }`}
                style={{
                  width: `${dimensions.cardWidth}px`,
                  height: `${dimensions.cardHeight}px`,
                  transform: `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${z}px) rotateY(${rotY}deg) rotateX(${rotX}deg) rotateZ(${rotZ}deg) scale(${scale})`,
                  opacity,
                  zIndex,
                  transformStyle: "preserve-3d",
                  willChange: "transform, opacity",
                  borderRadius: "1.25rem",
                  boxShadow: isFrontCard
                    ? "0 25px 60px rgba(0, 0, 0, 0.9), 0 0 35px rgba(229, 37, 42, 0.45)"
                    : "0 15px 35px rgba(0, 0, 0, 0.8)",
                }}
              >
                {/* Carte au format CU Chapel : Bordure blanche franche & coins arrondis */}
                <div className="relative w-full h-full overflow-hidden rounded-2xl border-[3.5px] border-white/95 bg-[#140507]">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    sizes="(max-width: 640px) 180px, (max-width: 1024px) 240px, 280px"
                    priority={i < 3}
                    className="object-cover object-center"
                  />

                  {/* Voile sombre en dégradé pour garantir la netteté du texte */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0304] via-[#0A0304]/35 to-transparent" />

                  {/* Lueur rougeoyante au bas de la carte */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(229,37,42,0.35)_0%,transparent_70%)]" />

                  {/* Badge de catégorie supérieur */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 shadow-md">
                    <span
                      className={`inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full shadow-lg ${card.tagColor}`}
                    >
                      <IconComponent size={10} />
                      {card.tag}
                    </span>
                  </div>

                  {/* Titre & Sous-titre en bas de la carte */}
                  <div className="absolute bottom-2.5 left-3 right-3 text-left">
                    <h4 className="font-heading text-lg sm:text-xl uppercase tracking-wide text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] leading-tight">
                      {card.title}
                    </h4>
                    <p className="mt-0.5 font-body text-[11px] text-[#F5ECEC] line-clamp-2 drop-shadow-[0_1px_4px_rgba(0,0,0,0.95)]">
                      {card.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Barre de Contrôles & Indicateurs de Position (Élégance & Accessibilité) */}
      <div className="mt-3 flex items-center justify-between w-full max-w-xs sm:max-w-sm px-4 py-1.5 rounded-full border border-white/15 bg-[#140507]/85 backdrop-blur-md shadow-xl text-white">
        {/* Bouton Précédent */}
        <button
          onClick={() => rotateTo(1)}
          aria-label="Moment précédent"
          className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Indicateurs de points (Dots) */}
        <div className="flex items-center gap-1.5">
          {HERO_CARDS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                const target = -idx * cardStep;
                let diff = (target - (angleRef.current % (Math.PI * 2))) % (Math.PI * 2);
                if (diff > Math.PI) diff -= Math.PI * 2;
                if (diff < -Math.PI) diff += Math.PI * 2;
                targetAngleRef.current = angleRef.current + diff;
              }}
              aria-label={`Aller au moment ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeIndex === idx
                  ? "w-6 bg-gradient-to-r from-[#F5B900] to-[#E5252A]"
                  : "w-1.5 bg-white/30 hover:bg-white/60"
              }`}
            />
          ))}
        </div>

        {/* Bouton Pause / Reprise */}
        <button
          onClick={() => setIsPaused((prev) => !prev)}
          aria-label={isPaused ? "Reprendre l'orbite 3D" : "Mettre en pause l'orbite 3D"}
          className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
        >
          {isPaused ? <Play size={14} className="text-[#F5B900]" /> : <Pause size={14} />}
        </button>

        {/* Bouton Suivant */}
        <button
          onClick={() => rotateTo(-1)}
          aria-label="Moment suivant"
          className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Petit texte d'astuce tactile / souris */}
      <p className="mt-1.5 font-body text-[10px] text-cn-gray-500 uppercase tracking-widest text-center">
        Glissez pour faire pivoter en 3D • Cliquez sur une carte pour la rapprocher
      </p>
    </div>
  );
}
