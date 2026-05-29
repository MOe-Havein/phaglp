"use server"

import { prisma, serializePrisma } from "@/lib/prisma"
import { revalidatePath, revalidateTag } from "next/cache"
import { Role } from "@prisma/client"
import {
  createLecture as createLectureDb,
  updateLecture as updateLectureDb,
} from "./server/lectures"
import { auth } from "@/auth"
import { z } from "zod"

const courseSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional().default(""),
  duration: z.string().optional().default(""),
  price: z.coerce.number().optional().default(0),
  published: z.boolean().optional().default(false),
})

const moduleSchema = z.object({
  title: z.string().min(1),
  courseId: z.string().min(1),
})

const lessonSchema = z.object({
  title: z.string().min(1),
  moduleId: z.string().min(1),
  courseId: z.string().min(1),
})

const lectureSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
  category: z.string().min(1),
  coverImage: z.string().nullable().optional(),
  isFeatured: z.boolean().optional().default(false),
  published: z.boolean().optional().default(false),
  tags: z.array(z.string()).optional().default([]),
})

async function ensureAdminOrInstructor() {
  const session = await auth()
  if (session?.user?.role !== Role.ADMIN && session?.user?.role !== Role.INSTRUCTOR) {
    throw new Error("Unauthorized: You do not have permission to perform this action.")
  }
}

// --- Courses ---

export async function createCourse(data: any) {
  try {
    await ensureAdminOrInstructor()
    const session = await auth()
    const parsedData = courseSchema.parse(data)

    const course = await prisma.course.create({
      data: {
        title: parsedData.title,
        slug: parsedData.slug,
        description: parsedData.description ?? "",
        duration: parsedData.duration ?? "",
        instructorId: session!.user.id!,
        price: parsedData.price,
        published: parsedData.published,
      },
    })

    revalidatePath("/control/courses")
    revalidatePath("/courses")
    revalidatePath("/")
    revalidateTag("courses")
    return { success: true, data: serializePrisma(course) }
  } catch (error: any) {
    console.error("Failed to create course:", error)
    return { success: false, error: error.message || "Failed to create course" }
  }
}

export async function updateCourse(id: string, data: any) {
  try {
    await ensureAdminOrInstructor()
    const parsedData = courseSchema.parse(data)

    const course = await prisma.course.update({
      where: { id },
      data: {
        title: parsedData.title,
        slug: parsedData.slug,
        description: parsedData.description ?? "",
        duration: parsedData.duration ?? "",
        price: parsedData.price,
        published: parsedData.published,
      },
    })

    revalidatePath("/control/courses")
    revalidatePath("/courses")
    revalidatePath(`/courses/${course.slug}`)
    revalidatePath("/")
    revalidateTag("courses")
    return { success: true, data: serializePrisma(course) }
  } catch (error: any) {
    console.error("Failed to update course:", error)
    return { success: false, error: error.message || "Failed to update course" }
  }
}

export async function deleteCourse(id: string) {
  try {
    await ensureAdminOrInstructor()
    await prisma.course.delete({ where: { id } })
    revalidatePath("/control/courses")
    revalidatePath("/courses")
    revalidateTag("courses")
    return { success: true }
  } catch (error: any) {
    console.error("Failed to delete course:", error)
    return { success: false, error: error.message || "Failed to delete course" }
  }
}

// --- Modules & Lessons ---

export async function createModule(courseId: string, title: string) {
  try {
    await ensureAdminOrInstructor()

    const parsedData = moduleSchema.parse({ title, courseId })

    const lastModule = await prisma.courseModule.findFirst({
      where: { courseId: parsedData.courseId },
      orderBy: { order: "desc" },
    })

    const courseModule = await prisma.courseModule.create({
      data: {
        title: parsedData.title,
        courseId: parsedData.courseId,
        order: (lastModule?.order ?? 0) + 1,
      },
    })

    revalidatePath(`/control/courses/${courseId}/curriculum`)
    return { success: true, data: serializePrisma(courseModule) }
  } catch (error: any) {
    console.error("Failed to create module:", error)
    return { success: false, error: error.message || "Failed to create module" }
  }
}

export async function createLesson(moduleId: string, courseId: string, title: string) {
  try {
    await ensureAdminOrInstructor()

    const parsedData = lessonSchema.parse({ title, moduleId, courseId })

    const lastLesson = await prisma.lesson.findFirst({
      where: { moduleId: parsedData.moduleId },
      orderBy: { order: "desc" },
    })

    const lesson = await prisma.lesson.create({
      data: {
        title: parsedData.title,
        moduleId: parsedData.moduleId,
        order: (lastLesson?.order ?? 0) + 1,
      },
    })

    revalidatePath(`/control/courses/${courseId}/curriculum`)
    return { success: true, data: serializePrisma(lesson) }
  } catch (error: any) {
    console.error("Failed to create lesson:", error)
    return { success: false, error: error.message || "Failed to create lesson" }
  }
}

// --- Lectures ---

export async function createLecture(data: any) {
  try {
    await ensureAdminOrInstructor()
    const session = await auth()

    if (!session?.user?.id) {
      return { success: false, error: "User session is invalid. Please log in again." }
    }

    const parsedData = lectureSchema.parse(data)

    const lecture = await createLectureDb({
      title: parsedData.title,
      body: parsedData.body,
      category: parsedData.category,
      coverImage: parsedData.coverImage || null,
      isFeatured: parsedData.isFeatured || false,
      authorId: session.user.id,
      published: parsedData.published || false,
      tags: parsedData.tags || [],
    })

    revalidatePath("/control/lectures")
    revalidatePath("/lectures")
    revalidatePath("/")
    revalidateTag("lectures")
    return { success: true, data: serializePrisma(lecture) }
  } catch (error: any) {
    console.error("Failed to create lecture:", error)
    return { success: false, error: error.message || "Failed to create lecture" }
  }
}

export async function updateLecture(id: string, data: any) {
  try {
    await ensureAdminOrInstructor()
    const parsedData = lectureSchema.parse(data)

    const lecture = await updateLectureDb(id, {
      title: parsedData.title,
      body: parsedData.body,
      category: parsedData.category,
      published: parsedData.published,
      tags: parsedData.tags || [],
      coverImage: parsedData.coverImage,
      isFeatured: parsedData.isFeatured,
    })

    revalidatePath("/control/lectures")
    revalidatePath("/lectures")
    revalidatePath(`/lectures/${lecture.slug}`)
    revalidatePath("/")
    revalidateTag("lectures")
    return { success: true, data: serializePrisma(lecture) }
  } catch (error: any) {
    console.error("Failed to update lecture:", error)
    return { success: false, error: error.message || "Failed to update lecture" }
  }
}

export async function deleteLecture(id: string) {
  try {
    await ensureAdminOrInstructor()
    await prisma.lecture.delete({ where: { id } })
    revalidatePath("/control/lectures")
    revalidatePath("/lectures")
    revalidatePath("/")
    revalidateTag("lectures")
    return { success: true }
  } catch (error: any) {
    console.error("Failed to delete lecture:", error)
    return { success: false, error: error.message || "Failed to delete lecture" }
  }
}
