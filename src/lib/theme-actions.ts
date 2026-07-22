"use server";

import { getSiteSettings } from "@/lib/server/site-settings";
import { updateSiteSettings } from "@/lib/control-actions";

export async function saveTheme(data: {
  primaryColor?: string | null;
  secondaryColor?: string | null;
  backgroundColor?: string | null;
  textColor?: string | null;
  enableAdminTheme?: boolean | null;
  adminPrimaryColor?: string | null;
  adminSecondaryColor?: string | null;
  adminBackgroundColor?: string | null;
  adminTextColor?: string | null;
  adminTheme?: string | null;
}) {
  const s = await getSiteSettings();

  const payload = {
    ...s,
    ...data,
    enableAdminTheme: data.enableAdminTheme ?? s.enableAdminTheme ?? false,
    primaryColor:
      typeof data.primaryColor === "string"
        ? data.primaryColor
        : s.primaryColor,
    secondaryColor:
      typeof data.secondaryColor === "string"
        ? data.secondaryColor
        : s.secondaryColor,
    backgroundColor:
      typeof data.backgroundColor === "string"
        ? data.backgroundColor
        : s.backgroundColor,
    textColor:
      typeof data.textColor === "string" ? data.textColor : s.textColor,
    adminPrimaryColor:
      typeof data.adminPrimaryColor === "string"
        ? data.adminPrimaryColor
        : s.adminPrimaryColor,
    adminSecondaryColor:
      typeof data.adminSecondaryColor === "string"
        ? data.adminSecondaryColor
        : s.adminSecondaryColor,
    adminBackgroundColor:
      typeof data.adminBackgroundColor === "string"
        ? data.adminBackgroundColor
        : s.adminBackgroundColor,
    adminTextColor:
      typeof data.adminTextColor === "string"
        ? data.adminTextColor
        : s.adminTextColor,
    adminTheme:
      typeof data.adminTheme === "string" ? data.adminTheme : s.adminTheme,
  };

  return updateSiteSettings(payload);
}
