import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "cn-blue-night": "#17165A",
        "cn-purple-deep": "#38217F",
        "cn-purple": "#5A35A8",
        "cn-blue": "#3159C8",
        "cn-gold": "#F5B900",
        "cn-gold-light": "#FFD84A",
        "cn-white": "#FFFFFF",
        "cn-black": "#111111",
        "cn-gray-100": "#F5F5F7",
        "cn-gray-300": "#E5E5EA",
        "cn-gray-500": "#77777F",
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
