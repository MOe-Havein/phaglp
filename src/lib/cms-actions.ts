"use server"

import { prisma, serializePrisma } from "@/lib/prisma"
import { revalidatePath, revalidateTag } from "next/cache"
import { Role } from "@prisma/client"
import { auth } from "@/auth"
import {
  createLecture as createLectureDb,
  updateLecture as updateLectureDb,
} from "./server/lectures"

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

    const course = await prisma.course.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        duration: data.duration,
        instructorId: session!.user.id!,
        price: parseFloat(data.price),
        published: data.published || false,
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

    const course = await prisma.course.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        duration: data.duration,
        price: parseFloat(data.price),
        published: data.published,
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

    const lastModule = await prisma.courseModule.findFirst({
      where: { courseId },
      orderBy: { order: "desc" },
    })

    const courseModule = await prisma.courseModule.create({
      data: {
        title,
        courseId,
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

    const lastLesson = await prisma.lesson.findFirst({
      where: { moduleId },
      orderBy: { order: "desc" },
    })

    const lesson = await prisma.lesson.create({
      data: {
        title,
        moduleId,
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

    const lecture = await createLectureDb({
      title: data.title,
      body: data.body,
      category: data.category,
      coverImage: data.coverImage || null,
      isFeatured: data.isFeatured || false,
      authorId: session.user.id,
      published: data.published || false,
      tags: data.tags || [],
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

    const lecture = await updateLectureDb(id, {
      title: data.title,
      body: data.body,
      category: data.category,
      published: data.published,
      tags: data.tags || [],
      coverImage: data.coverImage,
      isFeatured: data.isFeatured,
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
