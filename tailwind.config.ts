import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#1D2A3F",
        "navy-light": "#2A3A52",
        "off-white": "#F4F1EC",
        blue: "#2D5BE3",
        "blue-light": "#EEF2FF",
        "text-dark": "#1D2A3F",
        "text-gray": "#64748B",
        border: "#E2E0DB",
      },
      fontFamily: {
        inter: ["var(--font-inter)", "Inter", "sans-serif"],
        playfair: ["var(--font-playfair)", "Playfair Display", "serif"],
        serif: ["var(--font-playfair)", "Playfair Display", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
