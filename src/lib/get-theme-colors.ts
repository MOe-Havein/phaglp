export type ThemeColors = {
  primary: string;
  secondary: string;
  background: string;
  text: string;
};

const DEFAULTS: ThemeColors = {
  primary: "#0040a1",
  secondary: "#565e71",
  background: "#f8f9ff",
  text: "#181c22",
};

function clampHex(hex?: string | null): string {
  if (!hex) return "";
  const normalized = hex.trim();
  if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(normalized)) return normalized;
  return "";
}

export function normalizeThemeColors(raw: {
  primaryColor?: string | null | undefined;
  secondaryColor?: string | null | undefined;
  backgroundColor?: string | null | undefined;
  textColor?: string | null | undefined;
}): ThemeColors {
  return {
    primary: clampHex(raw.primaryColor) || DEFAULTS.primary,
    secondary: clampHex(raw.secondaryColor) || DEFAULTS.secondary,
    background: clampHex(raw.backgroundColor) || DEFAULTS.background,
    text: clampHex(raw.textColor) || DEFAULTS.text,
  };
}

export function themeColorsToCssVars(colors: ThemeColors) {
  return {
    "--color-primary": colors.primary,
    "--color-secondary": colors.secondary,
    "--color-background": colors.background,
    "--color-text": colors.text,
  } as Record<string, string>;
}
