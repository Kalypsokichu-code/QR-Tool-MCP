import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        // Consolidated 3-Tier Radius System
        // TIER 1 - SUBTLE: Interactive elements (6px)
        md: "0.375rem", // 6px - Form controls, buttons, badges
        // TIER 2 - MODERATE: Cards & containers (16px)
        xl: "1rem", // 16px - Cards, images, content areas
        // TIER 3 - PROMINENT: Major containers (20px)
        "2xl": "1.25rem", // 20px - Dialogs, modals, overlays

        // Special cases
        xs: "0.125rem", // 2px - Micro-elements only
        sm: "0.25rem", // 4px - Checkboxes, tooltip arrows
        lg: "0.75rem", // 12px - Deprecated, maps to xl
        "3xl": "1.5rem", // 24px - Future expansion if needed
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
      animation: {
        blink: "blink 1s step-end infinite",
      },
    },
  },
  plugins: [],
};
export default config;
