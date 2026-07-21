import { describe, it, expect } from "vitest";
import { z } from "zod";
import {
  normalizeThemeColors,
  themeColorsToCssVars,
} from "@/lib/get-theme-colors";

const adminThemeSchema = z.object({
  enableAdminTheme: z.boolean(),
  primaryColor: z
    .string()
    .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)
    .optional(),
  secondaryColor: z
    .string()
    .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)
    .optional(),
  backgroundColor: z
    .string()
    .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)
    .optional(),
  textColor: z
    .string()
    .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)
    .optional(),
  adminPrimaryColor: z
    .string()
    .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)
    .optional(),
  adminSecondaryColor: z
    .string()
    .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)
    .optional(),
  adminBackgroundColor: z
    .string()
    .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)
    .optional(),
  adminTextColor: z
    .string()
    .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)
    .optional(),
});

const resolveAdminColors = (siteConfig: {
  enableAdminTheme?: boolean;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  backgroundColor?: string | null;
  textColor?: string | null;
  adminPrimaryColor?: string | null;
  adminSecondaryColor?: string | null;
  adminBackgroundColor?: string | null;
  adminTextColor?: string | null;
}) => {
  const colors = normalizeThemeColors({
    primaryColor:
      siteConfig.enableAdminTheme && siteConfig.adminPrimaryColor
        ? siteConfig.adminPrimaryColor
        : siteConfig.primaryColor,
    secondaryColor:
      siteConfig.enableAdminTheme && siteConfig.adminSecondaryColor
        ? siteConfig.adminSecondaryColor
        : siteConfig.secondaryColor,
    backgroundColor:
      siteConfig.enableAdminTheme && siteConfig.adminBackgroundColor
        ? siteConfig.adminBackgroundColor
        : siteConfig.backgroundColor,
    textColor:
      siteConfig.enableAdminTheme && siteConfig.adminTextColor
        ? siteConfig.adminTextColor
        : siteConfig.textColor,
  });

  return { colors, cssVars: themeColorsToCssVars(colors) };
};

describe("admin-theme-toggle", () => {
  it("accepts valid toggle and color values", () => {
    const result = adminThemeSchema.parse({
      enableAdminTheme: true,
      primaryColor: "#0040a1",
      adminBackgroundColor: "#112233",
    });

    expect(result.enableAdminTheme).toBe(true);
    expect(result.adminBackgroundColor).toBe("#112233");
  });

  it("rejects invalid admin color values", () => {
    expect(() =>
      adminThemeSchema.parse({
        enableAdminTheme: true,
        adminPrimaryColor: "not-a-color",
      }),
    ).toThrow();
  });

  it("prefers admin colors when independent admin theme is enabled", () => {
    const { colors, cssVars } = resolveAdminColors({
      enableAdminTheme: true,
      primaryColor: "#111111",
      secondaryColor: "#222222",
      backgroundColor: "#333333",
      textColor: "#444444",
      adminPrimaryColor: "#aaaaaa",
      adminSecondaryColor: "#bbbbbb",
      adminBackgroundColor: "#cccccc",
      adminTextColor: "#dddddd",
    });

    expect(colors.primary).toBe("#aaaaaa");
    expect(colors.secondary).toBe("#bbbbbb");
    expect(colors.background).toBe("#cccccc");
    expect(colors.text).toBe("#dddddd");
    expect(cssVars["--color-primary"]).toBe("#aaaaaa");
    expect(cssVars["--color-background"]).toBe("#cccccc");
  });

  it("falls back to public colors when admin theme is disabled", () => {
    const { colors, cssVars } = resolveAdminColors({
      enableAdminTheme: false,
      primaryColor: "#111111",
      secondaryColor: "#222222",
      backgroundColor: "#333333",
      textColor: "#444444",
      adminPrimaryColor: "#aaaaaa",
      adminBackgroundColor: "#cccccc",
    });

    expect(colors.primary).toBe("#111111");
    expect(colors.secondary).toBe("#222222");
    expect(colors.background).toBe("#333333");
    expect(colors.text).toBe("#444444");
    expect(cssVars["--color-primary"]).toBe("#111111");
    expect(cssVars["--color-background"]).toBe("#333333");
  });

  it("falls back to public colors when admin colors are missing", () => {
    const { colors, cssVars } = resolveAdminColors({
      enableAdminTheme: true,
      primaryColor: "#111111",
      secondaryColor: "#222222",
      backgroundColor: "#333333",
      textColor: "#444444",
    });

    expect(colors.primary).toBe("#111111");
    expect(colors.secondary).toBe("#222222");
    expect(colors.background).toBe("#333333");
    expect(colors.text).toBe("#444444");
    expect(cssVars["--color-primary"]).toBe("#111111");
    expect(cssVars["--color-background"]).toBe("#333333");
  });
});
