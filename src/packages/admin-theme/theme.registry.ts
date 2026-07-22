import type { AdminTheme } from "./theme.config";

export const adminThemeRegistry = new Map<string, AdminTheme>([
  ["default", { id: "default", name: "Default", viewsRoot: "default" }],
  ["custom", { id: "custom", name: "Custom", viewsRoot: "custom" }],
]);
