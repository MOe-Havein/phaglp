"use client";

import { themeColorsToCssVars, type ThemeColors } from "@/lib/get-theme-colors";

type ThemeColorProviderProps = {
  initial: ThemeColors;
  children: React.ReactNode;
};

export function ThemeColorProvider({
  initial,
  children,
}: ThemeColorProviderProps) {
  const cssVars = themeColorsToCssVars(initial);

  return (
    <div style={cssVars} className="min-h-screen bg-background text-text">
      {children}
    </div>
  );
}
