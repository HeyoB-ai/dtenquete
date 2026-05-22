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
        // Paper / ink palette — matches the original intake HTML
        ink: { DEFAULT: "#0f0f0f", 2: "#3a3a3a", 3: "#7a7a7a" },
        paper: { DEFAULT: "#faf9f6", 2: "#f2f0eb", 3: "#e8e4dc" },
        accent: { DEFAULT: "#1a4d8f", dark: "#153d72", light: "#e8f0fb" },
        success: { DEFAULT: "#1a6b3a", light: "#e8f5ed" },
        warn: { DEFAULT: "#8f4e1a", light: "#fdf0e8" },
        line: "#d8d4cc",
        // Dashboard dark sidebar
        nightside: "#15171c",
        nightside2: "#1d2026",
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-dm-serif)", "Georgia", "serif"],
      },
      borderRadius: {
        DEFAULT: "4px",
        lg: "8px",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        spin: { to: { transform: "rotate(360deg)" } },
      },
      animation: {
        fadeIn: "fadeIn 0.4s ease",
        spin: "spin 0.8s linear infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
