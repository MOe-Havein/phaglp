import { prisma, safeDbQuery } from "@/lib/prisma"
import { unstable_cache } from "next/cache"

export interface LectureSummary {
  id: string
  title: string
  slug: string
  body: string
  category: string
  createdAt: string
  author: {
    name: string | null
  }
}

/**
 * Fetches the latest published lectures from the database.
 * Optimized for performance and intended for use in Server Components.
 * Uses safeDbQuery to prevent serialization issues and handle outages.
 *
 * @param limit Number of lectures to fetch (default 3)
 * @returns Array of lectures with basic info
 */
export async function getLatestLectures(limit: number = 3): Promise<LectureSummary[]> {
  const fetcher = unstable_cache(
    async () => {
      const result = await safeDbQuery(async () => {
        return prisma.lecture.findMany({
          where: {
            published: true,
          },
          take: limit,
          orderBy: {
            createdAt: "desc",
          },
          select: {
            id: true,
            title: true,
            slug: true,
            body: true,
            category: true,
            createdAt: true,
            author: {
              select: {
                name: true,
              },
            },
          },
        })
      }, [])

      return (result.data as any) || []
    },
    [`latest-lectures-${limit}`],
    { tags: ["lectures"], revalidate: 300 },
  )

  return fetcher()
}
