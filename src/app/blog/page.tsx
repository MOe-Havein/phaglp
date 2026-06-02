import prisma, { safeDbQuery } from "@/lib/prisma"
import { BlogListing } from "@/components/blog/blog-listing"
import { unstable_cache } from "next/cache"
import { redis } from "@/lib/redis"

// Ensure dynamic rendering to handle database state safely
export const dynamic = "force-dynamic"

const getCachedBlogLectures = unstable_cache(
  async () => {
    const cacheKey = "blog-lectures"
    const cached = await redis.get<any[]>(cacheKey)
    if (cached) {
      return cached
    }

    const result = await safeDbQuery(async () => {
      return prisma.lecture.findMany({
        where: {
          published: true,
        },
        include: {
          author: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      })
    }, [])

    const data = result.data || []

    await redis.set(cacheKey, data, { ex: 300 })
    return data
  },
  ["blog-lectures"],
  { tags: ["lectures"], revalidate: 300 },
)

export default async function LecturesBlogPage() {
  let lectures: any[] = []
  try {
    lectures = await getCachedBlogLectures()
  } catch (error) {
    console.error("Failed to fetch cached blog lectures:", error)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mb-12">
        <h1 className="text-4xl font-bold mb-4">Latest Insights & Lectures</h1>
        <p className="text-lg text-muted-foreground">
          Explore research, articles, and community updates from the PHAGLP academic ecosystem.
        </p>
      </div>

      <BlogListing lectures={lectures} />
    </div>
  )
}

