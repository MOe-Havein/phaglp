import type { AdminTheme } from "./theme.config";

type ThemeHook = (registry: Map<string, AdminTheme>) => void;

const hooks: ThemeHook[] = [];

export function registerAdminThemeHook(hook: ThemeHook) {
  hooks.push(hook);
}

export function applyAdminThemeHooks(registry: Map<string, AdminTheme>) {
  for (const hook of hooks) {
    hook(registry);
  }
}
