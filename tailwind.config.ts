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
        ink: "#0A0E16",
        panel: "#131A26",
        hairline: "#232C3D",
        paper: "#E7EAF2",
        slate: "#808A9E",
        seal: "#C99A46",
        risk: {
          low: "#4F9868",
          medium: "#C98A3B",
          high: "#B84C42",
        },
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "sans-serif"],
        sans: ["var(--font-ibm-plex-sans)", "sans-serif"],
        mono: ["var(--font-ibm-plex-mono)", "monospace"],
      },
      boxShadow: {
        seal: "0 0 0 1px rgba(201, 154, 70, 0.35)",
        "seal-hover": "0 0 12px rgba(201, 154, 70, 0.25)",
      },
      keyframes: {
        "console-enter": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scan: {
          "0%": { top: "0%", opacity: "0.6" },
          "50%": { opacity: "1" },
          "100%": { top: "100%", opacity: "0.6" },
        },
      },
      animation: {
        "console-enter": "console-enter 0.45s ease-out both",
        scan: "scan 1.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
