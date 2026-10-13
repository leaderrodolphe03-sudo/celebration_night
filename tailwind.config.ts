import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        /* Fonds chaleureux, non étouffants et aérés */
        "cn-black":       "#1C1613", // Fond principal chaleureux (espresso doux, non noir froid)
        "cn-dark":        "#231C17", // Surface intermédiaire
        "cn-deep":        "#29201B", // Cartes et blocs légèrement surélevés
        "cn-ground":      "#322721", // Éléments interactifs ou contrastés
        "cn-light-cream": "#F4E6DE", // Accent crème doux

        /* Or et feu — couleurs identitaires du Hero */
        "cn-gold":       "#F59E0B",
        "cn-gold-light": "#FCD34D",
        "cn-gold-pale":  "#FEF3C7",
        "cn-amber":      "#D97706",
        "cn-fire":       "#EA580C",
        "cn-ember":      "#B45309",

        /* Textes et gris chauds haute lisibilité (WCAG compliant) */
        "cn-white":      "#FFFFFF",
        "cn-off-white":  "#FAF7F2",
        "cn-gray-100":   "#EDE8DC", // Texte secondaire clair
        "cn-gray-300":   "#D1C9B6", // Texte courant adouci
        "cn-gray-400":   "#B3A996", // Métadonnées lisibles
        "cn-gray-500":   "#948A77", // Textes atténués mais contrastés
        "cn-gray-700":   "#615747",

        /* Rétrocompatibilité souple */
        "cn-ember-dark":   "#1C1613",
        "cn-ember-ember":  "#231C17",
        "cn-burgundy":     "#29201B",
        "cn-red-crimson":  "#B45309",
        "cn-red-flame":    "#D97706",
        "cn-gold-glow":    "#F59E0B",
        "cn-blue-night":   "#1C1613",
        "cn-purple-deep":  "#231C17",
        "cn-purple":       "#29201B",
        "cn-blue":         "#D97706",
        "cn-night-deep":   "#1C1613",
        "cn-night":        "#231C17",
        "cn-navy":         "#231C17",
      },
      fontFamily: {
        heading: ["var(--font-bebas)", "sans-serif"],
        body:    ["var(--font-montserrat)", "sans-serif"],
      },
      borderRadius: {
        sm: "6px",
        md: "12px",
        lg: "20px",
        xl: "28px",
      },
      backgroundImage: {
        /* Dégradés chauds et aérés basés sur le hero */
        "hero-warm":     "linear-gradient(135deg, #241A14 0%, #1C1613 60%, #17110E 100%)",
        "stage-gradient":"linear-gradient(135deg, #1C1613 0%, #29201B 45%, #D97706 85%, #F59E0B 100%)",
        "gold-warm":     "linear-gradient(90deg, #F59E0B 0%, #EA580C 100%)",
        "gold-fire":     "linear-gradient(90deg, #F59E0B 0%, #EA580C 100%)",
        "card-soft":     "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)",
      },
      boxShadow: {
        "gold":        "0 0 20px rgba(245, 158, 11, 0.25)",
        "gold-strong": "0 8px 30px rgba(245, 158, 11, 0.4)",
        "fire":        "0 8px 25px rgba(234, 88, 12, 0.3)",
        "amber-sm":    "0 4px 15px rgba(217, 119, 6, 0.2)",
      },
    },
  },
  plugins: [],
};

export default config;
