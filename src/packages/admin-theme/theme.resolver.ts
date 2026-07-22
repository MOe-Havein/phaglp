import { adminThemeRegistry } from "./theme.registry";
import type { AdminTheme } from "./theme.config";

export function resolveAdminTheme(
  themeId: string | null | undefined,
): AdminTheme {
  return (
    adminThemeRegistry.get(themeId ?? "default") ??
    adminThemeRegistry.get("default")!
  );
}
