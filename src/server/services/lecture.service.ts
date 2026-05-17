import { LectureRepository } from "../repositories/lecture.repository"
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
    const lectures = await LectureRepository.getLatestPublished(limit)
    return serializePrisma(lectures)
  },

  /**
   * Fetches a specific lecture by slug.
   */
  async getLectureBySlug(slug: string) {
    const lecture = await LectureRepository.findBySlug(slug)
    return serializePrisma(lecture)
  },
}
