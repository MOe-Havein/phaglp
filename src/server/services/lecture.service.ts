import { LectureRepository } from "../repositories/lecture.repository"
import { getCachedData } from "@/lib/redis"
import { serializePrisma } from "@/lib/prisma"

/**
 * Service Layer for Lecture Domain
 * Handles business logic, caching orchestration, and DTO transformation.
 */
export const LectureService = {
  /**
   * Fetches latest lectures with distributed caching.
   */
  async getLatestLectures(limit: number = 3) {
    const cacheKey = `lectures:latest:${limit}`

    const data = await getCachedData(
      cacheKey,
      async () => {
        const lectures = await LectureRepository.getLatestPublished(limit)
        return lectures
      },
      300, // 5 minute cache
    )

    return serializePrisma(data)
  },

  /**
   * Fetches a specific lecture by slug.
   */
  async getLectureBySlug(slug: string) {
    const cacheKey = `lecture:slug:${slug}`

    const data = await getCachedData(
      cacheKey,
      async () => {
        return await LectureRepository.findBySlug(slug)
      },
      3600, // 1 hour cache
    )

    return serializePrisma(data)
  },
}
