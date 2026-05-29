import { cache } from "react"
import { prisma } from "@/lib/prisma"
import type { AcademyAsset, AdminDashboardStats } from "@/types"

/**
 * Fetch all academy assets for the admin inventory table.
 * Results are deduplicated per-request via React's `cache()`.
 */
export const getAssetsForAdmin = cache(async (): Promise<AcademyAsset[]> => {
  try {
    const assets = await prisma.academyAsset.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        course: { select: { id: true, title: true, slug: true } },
        allocations: {
          where: { returnedAt: null },
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
          orderBy: { allocatedAt: "desc" },
        },
      },
    })
    return assets as unknown as AcademyAsset[]
  } catch {
    return []
  }
})

/**
 * Fetch a single asset by ID, including its full allocation history.
 */
export const getAssetById = cache(async (id: string): Promise<AcademyAsset | null> => {
  try {
    const asset = await prisma.academyAsset.findUnique({
      where: { id },
      include: {
        course: { select: { id: true, title: true, slug: true } },
        allocations: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
          orderBy: { allocatedAt: "desc" },
        },
      },
    })
    return asset ? (asset as unknown as AcademyAsset) : null
  } catch {
    return null
  }
})

/**
 * Aggregate statistics for the admin dashboard overview.
 */
export const getAdminDashboardStats = cache(async (): Promise<AdminDashboardStats> => {
  try {
    const [userCount, courseCount, lectureCount, pageCount, assetCount, messageCount, unreadMessageCount] =
      await Promise.all([
        prisma.user.count(),
        prisma.course.count(),
        prisma.lecture.count(),
        prisma.page.count(),
        prisma.academyAsset.count(),
        prisma.contactMessage.count(),
        prisma.contactMessage.count({ where: { isRead: false } }),
      ])

    return {
      userCount,
      courseCount,
      lectureCount,
      pageCount,
      assetCount,
      messageCount,
      unreadMessageCount,
    }
  } catch {
    return {
      userCount: 0,
      courseCount: 0,
      lectureCount: 0,
      pageCount: 0,
      assetCount: 0,
      messageCount: 0,
      unreadMessageCount: 0,
    }
  }
})
