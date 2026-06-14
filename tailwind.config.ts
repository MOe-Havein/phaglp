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
        // High-Contrast Base Semantic Color Layout Rules
        background: "#f8fafc",      // slate-50 (Premium clean light canvas)
        foreground: "#0f172a",      // slate-900 (Crisp dark text)
        card: "#ffffff",            // Pure white light sheets
        popover: "#ffffff",
        
        // Brand & Theme Core Token Mapping (Stable Flat Strings)
        primary: "#145387",         // Deep premium brand blue (Passes 4.5:1 against white text)
        secondary: "#edf2f4",       // Your 'frost' color for light mode structural backgrounds
        muted: "#f1f5f9",           // slate-100
        "text-muted": "#475569",    // slate-600 (Accessible secondary text over white/frost)
        accent: "#1f7bc6",          // Your 'perfectsky' blue highlight token
        
        // System Feedback Status Tokens
        success: "#2d6a13",
        warning: "#b54111",
        destructive: "#c83313",     // Inferno red
        
        // High-Contrast Borders & Inputs
        border: "#cbd5e1",          // slate-300 for visible item boundaries
        input: "#cbd5e1",
        ring: "#1f7bc6",

        // Your Custom Brand Palette Extensions
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
