import type { Config } from "tailwindcss";
import tailwindAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Source Sans 3", "sans-serif"],
      },
      colors: {
        background: "#f8f9ff",
        foreground: "#181c22",
        card: "#ffffff",
        popover: "#ffffff",
        primary: {
          DEFAULT: "#0040a1",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#565e71",
          foreground: "#ffffff",
        },
        muted: "#ebeef6",
        "text-muted": "#424654",
        accent: "#0056d2",
        success: "#2d6a13",
        warning: "#b54111",
        destructive: "#ba1a1a",
        border: "#c3c6d6",
        input: "#31394a",
        ring: "#0056d2",
        surface: {
          DEFAULT: "#f8f9ff",
          dim: "#d7dae2",
          bright: "#f8f9ff",
          container: "#ebeef6",
          "container-lowest": "#ffffff",
          "container-low": "#f1f3fc",
          "container-high": "#e5e8f0",
          "container-highest": "#dfe2eb",
        },
        chart: {
          "1": "#1d4ed8",
          "2": "#10b981",
          "3": "#f59e0b",
          "4": "#6366f1",
          "5": "#ec4899",
        },
        sidebar: {
          DEFAULT: "#ffffff",
          foreground: "#181c22",
          primary: "#0040a1",
          "primary-foreground": "#ffffff",
          accent: "#ebeef6",
          "accent-foreground": "#181c22",
          border: "#c3c6d6",
          ring: "#0056d2",
        },
      },
      borderRadius: {
        xl: "1.5rem",
        lg: "1rem",
        md: "0.75rem",
        DEFAULT: "0.5rem",
        sm: "0.25rem",
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
