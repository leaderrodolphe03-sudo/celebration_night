import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Nouvelle palette Sacrée : Braise, Flamme, Or, Noir profond (remplace l'ancien bleu)
        "cn-ember-dark": "#0A0304",
        "cn-ember": "#140507",
        "cn-burgundy": "#24080C",
        "cn-red-crimson": "#B71C1C",
        "cn-red-flame": "#E5252A",
        "cn-gold": "#F5B900",
        "cn-gold-light": "#FFD84A",
        "cn-white": "#FFFFFF",
        "cn-black": "#0A0304",
        "cn-gray-100": "#F5F5F7",
        "cn-gray-300": "#E5E5EA",
        "cn-gray-500": "#77777F",
        // Aliases de compatibilité rétroactive remappés vers la charte braise/feu (aucun bleu)
        "cn-blue-night": "#0A0304",
        "cn-purple-deep": "#1E070B",
        "cn-purple": "#3B0E14",
        "cn-blue": "#D32F2F",
      },
      fontFamily: {
        heading: ["var(--font-bebas)", "sans-serif"],
        body: ["var(--font-montserrat)", "sans-serif"],
      },
      borderRadius: {
        sm: "8px",
        md: "16px",
        lg: "24px",
      },
    },
  },
  plugins: [],
};

export default config;
