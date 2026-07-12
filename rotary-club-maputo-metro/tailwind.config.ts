import type { Config } from "tailwindcss";

/**
 * Paleta oficial Rotary International + neutros do protótipo aprovado.
 * Estes tokens ficam disponíveis como classes Tailwind (ex.: bg-rotary-blue,
 * text-rotary-gold) e também como variáveis CSS em globals.css.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        rotary: {
          blue: "#0050A2",
          "blue-dark": "#00246C",
          sky: "#01B4E7",
          gold: "#F7A81B",
          cranberry: "#C10042",
          turquoise: "#018D8D",
          violet: "#872175",
          orange: "#FF7600",
        },
        neutral2: {
          charcoal: "#54565A",
          pewter: "#898A8D",
          smoke: "#B1B1B1",
          silver: "#D0CFCD",
          cloud: "#D6D1CA",
          stone: "#9BA4B4",
          slate: "#657F99",
          storm: "#7A6E66",
          ash: "#968B83",
          platinum: "#BFB7B0",
          soft: "#F6F5F3",
        },
      },
      fontFamily: {
        serif: ["var(--font-lora)", "Lora", "serif"],
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
