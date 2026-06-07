"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only rendering icons on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  const cycleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  if (!mounted) {
    return <div className="w-9 h-9 rounded-lg bg-secondary/50 animate-pulse" />;
  }

  return (
    <button
      onClick={cycleTheme}
      className="p-2 rounded-lg hover:bg-secondary border border-border/50 text-foreground transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring flex items-center justify-center relative overflow-hidden"
      aria-label={`Current theme is ${theme}. Click to change theme.`}
      title={`Theme: ${theme}`}
    >
      {theme === "light" && (
        <Sun className="w-5 h-5 text-amber-500 animate-spin-slow" />
      )}
      {theme === "dark" && (
        <Moon className="w-5 h-5 text-indigo-400 animate-bounce-subtle" />
      )}
      {theme === "system" && (
        <Monitor className="w-5 h-5 text-muted-foreground" />
      )}
    </button>
  );
}
