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
      // Replace the colors block in your tailwind.config.ts with this fully reactive version
colors: {
  // Reactive Core Layout Fundamentals
  background: {
    DEFAULT: "#f8fafc", // slate-50 (Crisp Light canvas)
    dark: "#0f172a",    // slate-900 (Deep Slate for Dark canvas)
  },
  foreground: {
    DEFAULT: "#0f172a", // slate-900 (Light mode typography)
    dark: "#f8fafc",    // slate-50 (Ultra-clean Dark mode typography)
  },
  card: {
    DEFAULT: "#ffffff", // Pure white for Light mode card surfaces
    dark: "#1e293b",    // slate-800 (Rich dark gray background for Dark mode cards)
    foreground: {
      DEFAULT: "#0f172a",
      dark: "#f8fafc",
    }
  },
  popover: {
    DEFAULT: "#ffffff",
    dark: "#1e293b",
    foreground: {
      DEFAULT: "#0f172a",
      dark: "#f8fafc",
    }
  },

  // Brand-Specific Theme Mapping (WCAG 4.5:1 Compliant)
  primary: {
    DEFAULT: "#145387", // Premium dark blue for Light mode buttons
    dark: "#38bdf8",    // sky-400 (Vibrant, accessible sky accent for Dark mode elements)
    foreground: {
      DEFAULT: "#ffffff",
      dark: "#0f172a",  // Inverts text to dark over bright sky elements for maximum legibility
    }
  },
  secondary: {
    DEFAULT: "#edf2f4", // frost
    dark: "#334155",    // slate-700
    foreground: {
      DEFAULT: "#0f172a",
      dark: "#f8fafc",
    }
  },
  muted: {
    DEFAULT: "#edf2f4", // frost
    dark: "#334155",    // slate-700
    foreground: {
      DEFAULT: "#475569", // slate-600
      dark: "#94a3b8",    // slate-400 (Passes contrast rules perfectly against dark cards)
    }
  },
  "text-muted": {
    DEFAULT: "#475569",
    dark: "#94a3b8",
  },
  accent: {
    DEFAULT: "#1f7bc6", // perfectsky
    dark: "#38bdf8",    // sky-400
    foreground: {
      DEFAULT: "#ffffff",
      dark: "#0f172a",
    }
  },

  // Functional Status Validation Tokens
  success: {
    DEFAULT: "#2d6a13",
    dark: "#4ade80", // green-400
    foreground: "#ffffff",
  },
  warning: {
    DEFAULT: "#b54111",
    dark: "#fb923c", // orange-400
    foreground: "#ffffff",
  },
  destructive: {
    DEFAULT: "#c83313", // inferno
    dark: "#ef4444",    // red-500
    foreground: "#ffffff",
  },
  
  border: {
    DEFAULT: "#cbd5e1", // slate-300
    dark: "#334155",    // slate-700 (Clear divider borders for dark backgrounds)
  },
  input: {
    DEFAULT: "#cbd5e1",
    dark: "#334155",
  },
  ring: {
    DEFAULT: "#1f7bc6",
    dark: "#38bdf8",
  },

  // Static Brand Palette Core Extensions
  frost: "#edf2f4",
  platinum: "#c5cbd3",
  tinfoil: "#a3a9b1",
  perfectsky: "#1f7bc6",
  tartorange: "#e65c23",
  laser: "#7cb625",
  inferno: "#c83313",
  celebration: "#f1d48c",

  sidebar: {
    DEFAULT: "#ffffff",
    dark: "#0f172a",
    foreground: { DEFAULT: "#334155", dark: "#94a3b8" },
    primary: { DEFAULT: "#145387", dark: "#38bdf8" },
    "primary-foreground": { DEFAULT: "#ffffff", dark: "#0f172a" },
    accent: { DEFAULT: "#edf2f4", dark: "#1e293b" },
    "accent-foreground": { DEFAULT: "#0f172a", dark: "#f8fafc" },
    border: { DEFAULT: "#edf2f4", dark: "#334155" },
    ring: { DEFAULT: "#1f7bc6", dark: "#38bdf8" },
  },
}

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
