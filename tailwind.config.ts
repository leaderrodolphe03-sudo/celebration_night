import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Jetons semantiques (shadcn/ui) definis dans app/globals.css
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        success: "hsl(var(--success))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        stage: "hsl(var(--stage))",
        violet: "hsl(var(--violet))",
        flame: "hsl(var(--flame))",
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
  plugins: [animate],
};

export default config;
