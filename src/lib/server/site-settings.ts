import "server-only"
import { prisma } from "@/lib/prisma"
import { cached } from "./cache"
import { siteConfig } from "@/config/site"
import { SiteSettings } from "@/lib/shared/types"
import { logger } from "./logger"

export async function getSiteSettings(hostname?: string | null): Promise<SiteSettings> {
  const hostKey = hostname || "default"

  return cached<SiteSettings>(
    `site-settings-${hostKey}`,
    async () => {
      try {
        // Multi-tenant logic: normally looks up by hostname
        // For now, we fallback to 'global' id or specific host mapping
        const settings = await prisma.siteSettings.findFirst({
          where: {
            // Logic to match hostname to tenant could go here
            // e.g. domain: hostname
            id: "global",
          },
        })

        if (!settings) {
          logger.warn(`No DB settings found for host: ${hostKey}, using static default`)
          return siteConfig
        }

        return {
          ...siteConfig, // Start with defaults
          siteName: settings.siteName,
          description: settings.description || siteConfig.description,
          siteUrl: settings.siteUrl,
          maintenanceMode: settings.maintenanceMode,
          enableGoogleAnalytics: settings.enableGoogleAnalytics,
          googleAnalyticsId: settings.googleAnalyticsId,
          primaryColor: settings.primaryColor,
          ogImage: settings.ogImage,
        }
      } catch (error) {
        logger.error("Failed to fetch site settings from DB", error)
        return siteConfig
      }
    },
    {
      tags: ["site-settings", `site-settings-${hostKey}`],
      revalidate: 3600, // 1 hour default
    },
  )
}
