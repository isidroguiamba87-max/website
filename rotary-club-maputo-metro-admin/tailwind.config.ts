import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        rotary: {
          blue: "#0050A2",
          "blue-dark": "#00246C",
          gold: "#F7A81B",
        },
      },
    },
  },
  plugins: [],
};
export default config;
