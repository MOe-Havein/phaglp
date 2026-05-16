import prisma from "@/lib/prisma"
import { getCachedData } from "@/lib/redis"
import { Metadata } from "next"

export async function getSiteSettings() {
  return getCachedData(
    "site_settings_global",
    async () => {
      if (!prisma) {
        console.warn("Prisma client not initialized, returning null settings")
        return null
      }
      try {
        const settings = await prisma.siteSettings.findUnique({
          where: { id: "global" },
        })
        return settings
      } catch (error) {
        console.error("Failed to fetch site settings from DB:", error)
        return null
      }
    },
    3600, // Cache for 1 hour
  )
}

export async function generateGlobalMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()

  const defaultTitle = settings?.siteName || "PHAGLP Platform"
  const defaultDescription =
    settings?.metaDescription || "A modern platform for philosophical education."
  const siteUrl = settings?.siteUrl || "https://phaglp.com"

  // Ensure siteUrl has a protocol for the URL constructor
  const safeSiteUrl = siteUrl.startsWith("http") ? siteUrl : `https://${siteUrl}`

  let metadataBase: URL
  try {
    metadataBase = new URL(safeSiteUrl)
  } catch (error) {
    console.error("Invalid siteUrl for metadataBase, falling back to default:", siteUrl)
    metadataBase = new URL("https://phaglp.com")
  }

  return {
    title: {
      default: settings?.metaTitle || defaultTitle,
      template: `%s | ${defaultTitle}`,
    },
    description: defaultDescription,
    metadataBase,
    openGraph: {
      title: settings?.metaTitle || defaultTitle,
      description: defaultDescription,
      url: siteUrl,
      siteName: defaultTitle,
      images: settings?.ogImage ? [{ url: settings.ogImage }] : [],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: settings?.metaTitle || defaultTitle,
      description: defaultDescription,
      images: settings?.ogImage ? [settings.ogImage] : [],
    },
  }
}
