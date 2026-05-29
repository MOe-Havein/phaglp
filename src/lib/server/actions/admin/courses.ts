"use server"

import { prisma, safeDbQuery } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { requireAdmin } from "./_shared"
import { auth } from "@/auth"
import type { ActionResponseState } from "@/types"

const courseSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(255),
  slug: z.string().min(2, "Slug must be at least 2 characters").max(255).regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
})

function parseFormData(formData: FormData): Record<string, string | null> {
  const out: Record<string, string | null> = {}
  formData.forEach((value, key) => {
    out[key] = value === "" ? null : String(value)
  })
  return out
}

export async function createCourseAction(
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
    const parsed = courseSchema.safeParse(raw)
    if (!parsed.success) {
      return {
        success: false,
        error: "Validation failed",
        fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      }
    }

    const data = parsed.data
    const result = await safeDbQuery(() =>
      prisma.course.create({
        data: {
          title: data.title,
          slug: data.slug,
          description: data.description,
          price: data.price,
          instructorId: session.user.id!,
          published: false,
        },
      })
    )

    if (result.success) {
      revalidatePath("/control/courses")
      revalidatePath("/courses")
    }
    return result
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create course" }
  }
}
