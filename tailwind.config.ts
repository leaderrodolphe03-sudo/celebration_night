import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        /* Fonds chaleureux (style Effuzion sans noir froid) */
        "cn-black":       "#17110E",
        "cn-dark":        "#1E1611",
        "cn-deep":        "#241810",
        "cn-ground":      "#2B1D13",
        "cn-light-cream": "#F4E6DE",

        /* Or et feu — couleurs dominantes des vraies photos */
        "cn-amber":      "#D97706",
        "cn-gold":       "#F59E0B",
        "cn-gold-light": "#FCD34D",
        "cn-gold-pale":  "#FEF3C7",
        "cn-fire":       "#EA580C",
        "cn-ember":      "#B45309",

        /* Blancs et gris chauds */
        "cn-white":      "#FFFFFF",
        "cn-off-white":  "#FAF7F2",
        "cn-gray-100":   "#EDE8DC",
        "cn-gray-300":   "#BFB89E",
        "cn-gray-400":   "#9C9380",
        "cn-gray-500":   "#7D7560",
        "cn-gray-700":   "#403C32",

        /* Rétrocompat stricte */
        "cn-ember-dark":   "#080808",
        "cn-ember-ember":  "#0F0B07",
        "cn-burgundy":     "#261808",
        "cn-red-crimson":  "#B45309",
        "cn-red-flame":    "#D97706",
        "cn-gold-glow":    "#F59E0B",
        "cn-blue-night":   "#080808",
        "cn-purple-deep":  "#1A1108",
        "cn-purple":       "#261808",
        "cn-blue":         "#D97706",
        "cn-night-deep":   "#080808",
        "cn-night":        "#0F0B07",
        "cn-navy":         "#0F0B07",
      },
      fontFamily: {
        heading: ["var(--font-bebas)", "sans-serif"],
        body:    ["var(--font-montserrat)", "sans-serif"],
      },
      borderRadius: {
        sm: "6px",
        md: "12px",
        lg: "20px",
      },
      backgroundImage: {
        /* Dégradé de scène : brun-noir → ambre → or */
        "stage-gradient": "linear-gradient(135deg, #080808 0%, #1A1108 40%, #D97706 80%, #F59E0B 100%)",
        /* Dégradé bouton CTA or → feu */
        "gold-fire": "linear-gradient(90deg, #F59E0B 0%, #EA580C 100%)",
      },
      boxShadow: {
        "gold":        "0 0 20px rgba(245, 158, 11, 0.35)",
        "gold-strong": "0 0 40px rgba(245, 158, 11, 0.55)",
        "fire":        "0 0 30px rgba(234, 88, 12, 0.4)",
        "amber-sm":    "0 4px 20px rgba(217, 119, 6, 0.3)",
      },
    },
  },
  plugins: [],
};

export default config;
