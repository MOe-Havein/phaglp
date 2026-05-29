import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/rbac"

export const dynamic = "force-dynamic"

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
    const isAdmin = await requireAdmin()

    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
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

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Settings Update Error:", error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}
