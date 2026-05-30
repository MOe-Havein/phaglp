import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, duration, durationMonths, modules } = body

    if (!title || !modules || !Array.isArray(modules)) {
      return NextResponse.json({ error: "Invalid course outline payload" }, { status: 400 })
    }

    // Generate unique slug
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") + "-" + Math.random().toString(36).substring(2, 7)

    // Save Course, Modules, and Lessons within a single transaction
    const savedCourse = await prisma.$transaction(async (tx) => {
      // 1. Create Course record
      const course = await tx.course.create({
        data: {
          slug,
          title,
          description,
          price: 0, // Free AI-generated course by default
          published: true, // Auto-publish for immediate availability
          instructorId: session.user.id!,
          duration,
          durationMonths: durationMonths || 1,
        },
      })

      // 2. Add Modules and nested Lessons sequentially
      for (const mod of modules) {
        const createdModule = await tx.courseModule.create({
          data: {
            courseId: course.id,
            title: mod.title,
            order: mod.order || 1,
          },
        })

        if (mod.lessons && Array.isArray(mod.lessons)) {
          for (const les of mod.lessons) {
            await tx.lesson.create({
              data: {
                moduleId: createdModule.id,
                title: les.title,
                content: les.content || "",
                order: les.order || 1,
              },
            })
          }
        }
      }

      return course
    })

    return NextResponse.json({
      success: true,
      courseId: savedCourse.id,
      slug: savedCourse.slug,
    })
  } catch (error: any) {
    console.error("Save Course Outline API Error:", error)
    return NextResponse.json({ error: error.message || "Failed to save course outline" }, { status: 500 })
  }
}
