import type { Config } from "tailwindcss";
import tailwindAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#f8fafc",
        },
        foreground: {
          DEFAULT: "#0f172a",
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#0f172a",
        },
        popover: {
          DEFAULT: "#ffffff",
          foreground: "#0f172a",
        },
        primary: {
          DEFAULT: "#145387",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#edf2f4",
          foreground: "#0f172a",
        },
        muted: {
          DEFAULT: "#edf2f4",
          foreground: "#475569",
        },
        "text-muted": "#475569",
        accent: {
          DEFAULT: "#1f7bc6",
          foreground: "#ffffff",
        },
        success: {
          DEFAULT: "#2d6a13",
          foreground: "#ffffff",
        },
        warning: {
          DEFAULT: "#b54111",
          foreground: "#ffffff",
        },
        destructive: {
          DEFAULT: "#c83313",
          foreground: "#ffffff",
        },
        border: "#cbd5e1",
        input: "#cbd5e1",
        ring: "#1f7bc6",

        frost: "#edf2f4",
        platinum: "#c5cbd3",
        tinfoil: "#a3a9b1",
        perfectsky: "#1f7bc6",
        tartorange: "#e65c23",
        laser: "#7cb625",
        inferno: "#c83313",
        celebration: "#f1d48c",

        chart: {
          "1": "#1d4ed8",
          "2": "#10b981",
          "3": "#f59e0b",
          "4": "#6366f1",
          "5": "#ec4899",
        },
        sidebar: {
          DEFAULT: "#ffffff",
          foreground: "#334155",
          primary: "#145387",
          "primary-foreground": "#ffffff",
          accent: "#edf2f4",
          "accent-foreground": "#0f172a",
          border: "#edf2f4",
          ring: "#1f7bc6",
        },
      },
      borderRadius: {
        xl: "0.75rem",
        lg: "0.75rem",
        md: "calc(0.75rem - 2px)",
        sm: "calc(0.75rem - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [tailwindAnimate],
};

export default config;
