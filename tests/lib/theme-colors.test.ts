import { describe, it, expect } from "vitest";
import {
  normalizeThemeColors,
  themeColorsToCssVars,
} from "@/lib/get-theme-colors";

describe("get-theme-colors", () => {
  describe("normalizeThemeColors", () => {
    it("returns defaults when inputs are empty", () => {
      const result = normalizeThemeColors({});

      expect(result.primary).toBe("#0040a1");
      expect(result.secondary).toBe("#565e71");
      expect(result.background).toBe("#f8f9ff");
      expect(result.text).toBe("#181c22");
    });

    it("normalizes valid hex values", () => {
      const result = normalizeThemeColors({
        primaryColor: "#fab",
        secondaryColor: "#aabbcc",
        backgroundColor: "#123456",
        textColor: "#654321",
      });

      expect(result.primary).toBe("#fab");
      expect(result.secondary).toBe("#aabbcc");
      expect(result.background).toBe("#123456");
      expect(result.text).toBe("#654321");
    });

    it("drops invalid hex values", () => {
      const result = normalizeThemeColors({
        primaryColor: "badcolor",
        secondaryColor: "#12345",
        backgroundColor: "#gggggg",
        textColor: "#12",
      });

      expect(result.primary).toBe("#0040a1");
      expect(result.secondary).toBe("#565e71");
      expect(result.background).toBe("#f8f9ff");
      expect(result.text).toBe("#181c22");
    });

    it("uses db values when available", () => {
      const result = normalizeThemeColors({
        primaryColor: "#123456",
      });

      expect(result.primary).toBe("#123456");
      expect(result.secondary).toBe("#565e71");
      expect(result.background).toBe("#f8f9ff");
      expect(result.text).toBe("#181c22");
    });
  });

  describe("themeColorsToCssVars", () => {
    it("produces CSS variable map", () => {
      const cssVars = themeColorsToCssVars({
        primary: "#0040a1",
        secondary: "#565e71",
        background: "#f8f9ff",
        text: "#181c22",
      });

      expect(cssVars["--color-primary"]).toBe("#0040a1");
      expect(cssVars["--color-secondary"]).toBe("#565e71");
      expect(cssVars["--color-background"]).toBe("#f8f9ff");
      expect(cssVars["--color-text"]).toBe("#181c22");
    });

    it("does not include extra keys", () => {
      const cssVars = themeColorsToCssVars({
        primary: "#000",
        secondary: "#111",
        background: "#222",
        text: "#333",
      });

      expect(Object.keys(cssVars)).toHaveLength(4);
    });
  });
});
