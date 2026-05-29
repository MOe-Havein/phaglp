"use server"

import { prisma, safeDbQuery } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { requireAdmin } from "./_shared"
import { auth } from "@/auth"
import type { ActionResponseState } from "@/types"
import readingTime from "reading-time"

const lectureSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(255),
  slug: z.string().min(2, "Slug must be at least 2 characters").max(255).regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  body: z.string().min(5, "Body must be at least 5 characters"),
  category: z.string().min(2, "Category must be at least 2 characters").max(100),
  tagsInput: z.string().optional().default(""),
})

function parseFormData(formData: FormData): Record<string, string | null> {
  const out: Record<string, string | null> = {}
  formData.forEach((value, key) => {
    out[key] = value === "" ? null : String(value)
  })
  return out
}

export async function createLectureAction(
  _prevState: ActionResponseState,
  formData: FormData,
): Promise<ActionResponseState> {
  try {
    await requireAdmin()
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized: User session invalid" }
    }

    const raw = parseFormData(formData)
    const parsed = lectureSchema.safeParse(raw)
    if (!parsed.success) {
      return {
        success: false,
        error: "Validation failed",
        fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      }
    }

    const data = parsed.data
    const tags = data.tagsInput
      ? data.tagsInput
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : []

    const stats = readingTime(data.body)
    const readingTimeMinutes = Math.ceil(stats.minutes)

    const result = await safeDbQuery(() =>
      prisma.lecture.create({
        data: {
          title: data.title,
          slug: data.slug,
          body: data.body,
          category: data.category,
          tags: tags,
          authorId: session.user.id!,
          published: false,
          readingTime: readingTimeMinutes,
        },
      })
    )

    if (result.success) {
      revalidatePath("/control/lectures")
      revalidatePath("/lectures")
    }
    return result
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create lecture" }
  }
}
