import "server-only";
import { prisma } from "@/lib/prisma";
import { cached } from "./cache";
import { siteConfig } from "@/config/site";
import { SiteSettings } from "@/lib/shared/types";
import { logger } from "./logger";

export async function getSiteSettings(
  hostname?: string | null,
): Promise<SiteSettings> {
  const hostKey = hostname || "default";

  return cached<SiteSettings>(
    `site-settings-${hostKey}`,
    async (): Promise<SiteSettings> => {
      try {
        const settings = await prisma.siteSettings.findFirst({
          where: {
            id: "global",
          },
        });

        if (!settings) {
          logger.warn(
            `No DB settings found for host: ${hostKey}, using static default`,
          );
          return siteConfig;
        }

        // Return a complete object with safe fallbacks ensuring zero undefined references leak
        return {
          id: settings.id,
          siteName: settings.siteName || siteConfig.siteName,
          siteUrl: settings.siteUrl || siteConfig.siteUrl,
          metaTitle: settings.metaTitle || siteConfig.metaTitle,
          metaDescription: settings.metaDescription || siteConfig.metaDescription,
          description: settings.description || siteConfig.description,
          
          // Strict conversions to completely avoid 'undefined' type mismatches
          primaryColor: settings.primaryColor ?? siteConfig.primaryColor ?? null,
          ogImage: settings.ogImage ?? siteConfig.ogImage ?? null,
          logoUrl: settings.logoUrl ?? siteConfig.logoUrl ?? null,
          faviconUrl: settings.faviconUrl ?? siteConfig.faviconUrl ?? null,
          googleAnalyticsId: settings.googleAnalyticsId ?? siteConfig.googleAnalyticsId ?? null,
          fullAddress: settings.fullAddress ?? siteConfig.fullAddress ?? null,
          
          // Handle string-to-boolean casting cleanly
          //  Pass the natively typed booleans directly (or force a safe boolean cast just in case)
maintenanceMode: Boolean(settings.maintenanceMode),
enableGoogleAnalytics: Boolean(settings.enableGoogleAnalytics),
allowRegistration: Boolean(settings.allowRegistration),

          // Static layout components array structures
          navItems: siteConfig.navItems,
          footerLinks: siteConfig.footerLinks,
        };
      } catch (error) {
        logger.error("Failed to fetch site settings from DB", error);
        return siteConfig;
      }
    },
    {
      tags: ["site-settings", `site-settings-${hostKey}`],
      revalidate: 3600,
    },
  );
}
