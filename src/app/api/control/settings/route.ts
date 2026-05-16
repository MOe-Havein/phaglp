import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "global" },
    })
    return NextResponse.json(settings)
  } catch {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const {
      siteName,
      siteUrl,
      maintenanceMode,
      metaTitle,
      metaDescription,
      ogImage,
      logoUrl,
      faviconUrl,
      primaryColor,
      googleAnalyticsId,
      enableGoogleAnalytics,
    } = body

    const settings = await prisma.siteSettings.upsert({
      where: { id: "global" },
      update: {
        siteName,
        siteUrl,
        maintenanceMode,
        metaTitle,
        metaDescription,
        ogImage,
        logoUrl,
        faviconUrl,
        primaryColor,
        googleAnalyticsId,
        enableGoogleAnalytics,
      },
      create: {
        id: "global",
        siteName,
        siteUrl,
        maintenanceMode,
        metaTitle,
        metaDescription,
        ogImage,
        logoUrl,
        faviconUrl,
        primaryColor,
        googleAnalyticsId,
        enableGoogleAnalytics,
      },
    })

    // Invalidate Redis cache
    try {
      const redis = (await import("@/lib/redis")).default
      if (redis) await redis.del("site_settings_global")
    } catch (e) {
      console.warn("Redis invalidation failed", e)
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Settings Update Error:", error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}
