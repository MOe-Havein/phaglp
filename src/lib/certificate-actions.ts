"use server"

import prisma, { safeDbQuery } from "@/lib/prisma"
import { nanoid } from "nanoid"

/**
 * Issue a new Calligraphic Certificate for a scholar completing a course.
 */
export async function issueCertificate(userId: string, courseId: string, grade: string = "Completed") {
  try {
    // Check if certificate already exists for this user and course
    const existing = await prisma.certificate.findFirst({
      where: { userId, courseId },
    })

    if (existing) {
      return { success: true, certificateCode: existing.certificateCode }
    }

    // Generate unique code in uppercase, E.g., "CERT-2026-X7Y2-A9Z1"
    const randomCode = nanoid(8).toUpperCase().match(/.{1,4}/g)?.join("-") || "ABCD-1234"
    const certificateCode = `CERT-2026-${randomCode}`

    const result = await safeDbQuery(async () => {
      return prisma.certificate.create({
        data: {
          userId,
          courseId,
          certificateCode,
          grade,
        },
      })
    })

    if (!result.success || !result.data) {
      return { success: false, error: result.error || "Failed to create certificate" }
    }

    return { success: true, certificateCode }
  } catch (error: any) {
    console.error("Issue Certificate Error:", error)
    return { success: false, error: error.message || "Failed to issue certificate" }
  }
}

/**
 * Retrieve certificate details by its unique verification code.
 */
export async function verifyCertificate(code: string) {
  return await safeDbQuery(async () => {
    return prisma.certificate.findUnique({
      where: { certificateCode: code },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            role: true,
          },
        },
        course: {
          select: {
            title: true,
            description: true,
            duration: true,
          },
        },
      },
    })
  })
}

/**
 * Get all certificates issued to a specific scholar.
 */
export async function getUserCertificates(userId: string) {
  return await safeDbQuery(async () => {
    return prisma.certificate.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            title: true,
            description: true,
            duration: true,
          },
        },
      },
      orderBy: { issueDate: "desc" },
    })
  })
}

/**
 * Get all issued certificates across all users for administrative review.
 */
export async function getAllCertificates() {
  return await safeDbQuery(async () => {
    return prisma.certificate.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { issueDate: "desc" },
    })
  })
}

/**
 * Revoke/delete a certificate.
 */
export async function revokeCertificate(id: string) {
  try {
    const result = await safeDbQuery(async () => {
      return prisma.certificate.delete({
        where: { id },
      })
    })
    if (!result.success) {
      return { success: false, error: result.error || "Failed to revoke certificate" }
    }
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to revoke certificate" }
  }
}

/**
 * Get a user's completion progress for a course.
 */
export async function getCourseProgress(userId: string, courseId: string) {
  try {
    // 1. Get all modules and lessons in the course
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          include: {
            lessons: {
              select: { id: true }
            }
          }
        }
      }
    })

    if (!course) {
      return { success: false, error: "Course not found", data: { percent: 0, completedCount: 0, totalCount: 0, completedLessonIds: [] } }
    }

    const lessons = course.modules.flatMap((m) => m.lessons)
    const totalCount = lessons.length

    if (totalCount === 0) {
      return { success: true, data: { percent: 0, completedCount: 0, totalCount: 0, completedLessonIds: [] } }
    }

    const lessonIds = lessons.map((l) => l.id)

    // 2. Get completed progress records for these lessons
    const completedProgress = await prisma.lessonProgress.findMany({
      where: {
        userId,
        lessonId: { in: lessonIds }
      }
    })

    const completedCount = completedProgress.length
    const percent = Math.round((completedCount / totalCount) * 100)

    return {
      success: true,
      data: {
        percent,
        completedCount,
        totalCount,
        completedLessonIds: completedProgress.map((p) => p.lessonId)
      }
    }
  } catch (error: any) {
    console.error("Get Course Progress Error:", error)
    return { success: false, error: error.message, data: { percent: 0, completedCount: 0, totalCount: 0, completedLessonIds: [] } }
  }
}

/**
 * Toggle a lesson's completion status.
 * Automatically issues a certificate if course completion hits 100%.
 */
export async function toggleLessonProgress(userId: string, lessonId: string, courseId: string) {
  try {
    // 1. Check if progress record exists
    const existing = await prisma.lessonProgress.findUnique({
      where: {
        userId_lessonId: { userId, lessonId }
      }
    })

    let completed = false

    if (existing) {
      // Toggle off -> Delete record
      await prisma.lessonProgress.delete({
        where: { id: existing.id }
      })
      completed = false
    } else {
      // Toggle on -> Create record
      await prisma.lessonProgress.create({
        data: { userId, lessonId }
      })
      completed = true
    }

    // 2. Recalculate course progress
    const progressResult = await getCourseProgress(userId, courseId)
    if (!progressResult.success || !progressResult.data) {
      return { success: false, error: "Failed to recalculate progress" }
    }

    const { percent } = progressResult.data
    let certificateIssued = false
    let certificateCode = ""

    // 3. If progress is 100%, automatically award certificate
    if (percent === 100) {
      const certResult = await issueCertificate(userId, courseId, "Pass with Distinction (A)")
      if (certResult.success && certResult.certificateCode) {
        certificateIssued = true
        certificateCode = certResult.certificateCode
      }
    }

    return {
      success: true,
      completed,
      progressPercent: percent,
      certificateIssued,
      certificateCode
    }
  } catch (error: any) {
    console.error("Toggle Lesson Progress Error:", error)
    return { success: false, error: error.message }
  }
}
