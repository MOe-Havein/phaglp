import type { SiteSettings } from "@/lib/shared/types";

type ThemeInjectorProps = {
  settings?: SiteSettings;
};

const EXTRA_FIELDS = [
  "fontHeading",
  "fontBody",
  "fontScale",
  "borderRadius",
  "navbarStyle",
  "footerStyle",
  "colorScheme",
] as const;

function extractStringVar(value: string | null | undefined): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function sanitizeCssVarValue(value: string | null | undefined): string | null {
  if (typeof value !== "string") return null;
  // Strip characters that can break out of the declaration.
  if (/[\n\r}]/.test(value)) return null;
  return value;
}

function readExtra(settings: SiteSettings): Record<string, string | null> {
  const result: Record<string, string | null> = {};

  for (const key of EXTRA_FIELDS) {
    const raw = (settings as unknown as Record<string, unknown>)[key];
    result[key] = extractStringVar(typeof raw === "string" ? raw : null);
  }

  return result;
}

export function ThemeInjector({ settings }: ThemeInjectorProps = {}) {
  const safeSettings = settings ?? ({} as SiteSettings);
  const vars: Record<string, string | null> = {
    ...readExtra(safeSettings),
    primaryColor: sanitizeCssVarValue(safeSettings.primaryColor),
    secondaryColor: sanitizeCssVarValue(safeSettings.secondaryColor),
    backgroundColor: sanitizeCssVarValue(safeSettings.backgroundColor),
    textColor: sanitizeCssVarValue(safeSettings.textColor),
  };

  const bodyStyleVars: Record<string, string> = {};

  for (const [key, value] of Object.entries(vars)) {
    if (typeof value === "string" && value.length > 0) {
      bodyStyleVars[key] = value;
    }
  }

  const entries = Object.entries(bodyStyleVars);

  if (entries.length === 0) {
    return null;
  }

  const css = entries.map(([key, value]) => `  --${key}: ${value};`).join("\n");

  return <style id="theme-vars">{`:root {\n${css}\n}`}</style>;
}
