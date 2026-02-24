import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        imperial: {
          bg: "#0A1628",
          "bg-secondary": "#121E32",
          gold: "#C9A84C",
          red: "#8B2232",
          cream: "#F5F0E8",
          muted: "#A09882",
          success: "#2D6A4F",
          error: "#C1292E",
          warning: "#D4A037",
        },
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        subtitle: ["Cormorant Garamond", "serif"],
        body: ["Source Sans 3", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        badge: ["Cinzel", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
