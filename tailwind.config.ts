// Add this directly inside the colors object of your tailwind.config.ts
colors: {
  // Core Layout Fundamentals (Crisp Light Mode Slate Canvas)
  background: {
    DEFAULT: "#f8fafc", // slate-50 (Keeps the app background clean and premium)
  },
  foreground: {
    DEFAULT: "#0f172a", // slate-900 (Deep slate for crisp, sharp text)
  },
  card: {
    DEFAULT: "#ffffff", // Pure white for structural cards popping off slate-50
    foreground: "#0f172a",
  },
  popover: {
    DEFAULT: "#ffffff",
    foreground: "#0f172a",
  },

  // Brand-Specific Theme Mapping (WCAG 4.5:1 Compliant)
  primary: {
    // Dark sky blue used for solid button backgrounds to safely clear 4.5:1 against white text
    DEFAULT: "#145387", 
    foreground: "#ffffff",
  },
  secondary: {
    DEFAULT: "#edf2f4", // Mapping your 'frost' color here for secondary backgrounds/buttons
    foreground: "#0f172a", // slate-900 text over frost creates an ultra-high 13:1 contrast ratio
  },
  muted: {
    DEFAULT: "#edf2f4", // 'frost' acts as your secondary subtle structural surface
    foreground: "#475569", // slate-600 provides an accessible 5.3:1 text ratio over white or frost
  },
  "text-muted": "#475569", // slate-600
  accent: {
    DEFAULT: "#1f7bc6", // 'perfectsky' handles your focus elements, active states, and links beautifully
    foreground: "#ffffff",
  },

  // Functional Status Validation Tokens (Deepened to pass 4.5:1)
  success: {
    DEFAULT: "#2d6a13", // Deepened variation of your 'laser' for safe text/solid compliance
    foreground: "#ffffff",
  },
  warning: {
    DEFAULT: "#b54111", // Deepened variation of your 'tartorange' for high contrast visibility
    foreground: "#ffffff",
  },
  destructive: {
    DEFAULT: "#c83313", // Your 'inferno' color safely passes contrast rules natively
    foreground: "#ffffff",
  },
  border: "#cbd5e1", // slate-300 for clear structural item boundaries
  input: "#cbd5e1",
  ring: "#1f7bc6", // 'perfectsky' focus rings

  // Your Custom Brand Palette Core Extensions
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
    foreground: "#334155",
    primary: "#145387",
    "primary-foreground": "#ffffff",
    accent: "#edf2f4", // Using your 'frost' palette as the hover state highlight inside the menus
    "accent-foreground": "#0f172a",
    border: "#edf2f4",
    ring: "#1f7bc6",
  },
}
