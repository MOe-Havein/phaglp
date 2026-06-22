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
    async () => {
      try {
        // Multi-tenant logic: normally looks up by hostname
        // For now, falling back to 'global' id based on your schema
        const settings = await prisma.siteSettings.findFirst({
          where: {
            // Add your multi-tenant tenant matching logic here if needed:
            // id: hostname === "phaglp.com" ? "global" : "global"
            id: "global",
          },
        });

        if (!settings) {
          logger.warn(
            `No DB settings found for host: ${hostKey}, using static default`,
          );
          return siteConfig;
        }

        // Dynamically map DB payload fields with proper string-to-boolean conversions
        return {
          ...siteConfig, // Fallback to static defaults for missing items
          id: settings.id,
          siteName: settings.siteName || siteConfig.siteName,
          siteUrl: settings.siteUrl || siteConfig.siteUrl,
          metaTitle: settings.metaTitle || siteConfig.metaTitle,
          metaDescription: settings.metaDescription || siteConfig.metaDescription,
          description: settings.description || siteConfig.description,
          primaryColor: settings.primaryColor || siteConfig.primaryColor,
          ogImage: settings.ogImage || siteConfig.ogImage,
          logoUrl: settings.logoUrl || siteConfig.logoUrl,
          faviconUrl: settings.faviconUrl || siteConfig.faviconUrl,
          googleAnalyticsId: settings.googleAnalyticsId || siteConfig.googleAnalyticsId,
          fullAddress: settings.fullAddress || siteConfig.fullAddress,
          
          // Handle "0" / "1" string-to-boolean casting safely
          maintenanceMode: settings.maintenanceMode === "1",
          enableGoogleAnalytics: settings.enableGoogleAnalytics === "1",
          allowRegistration: settings.allowRegistration === "1",
        };
      } catch (error) {
        logger.error("Failed to fetch site settings from DB", error);
        return siteConfig;
      }
    },
    {
      tags: ["site-settings", `site-settings-${hostKey}`],
      revalidate: 3600, // 1 hour Next.js Data Cache revalidation
    },
  );
}
