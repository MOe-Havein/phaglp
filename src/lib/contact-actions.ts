"use server"

import { prisma, safeDbQuery } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { Role } from "@prisma/client"
import { auth } from "@/auth"
import { z } from "zod"
import { rateLimit } from "./rate-limit"
import { headers } from "next/headers"

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

async function ensureAdmin() {
  const session = await auth()
  if (session?.user?.role !== Role.ADMIN) {
    throw new Error("Unauthorized: Admin access required")
  }
}

export async function submitContactForm(data: z.infer<typeof contactSchema>) {
  try {
    // 1. Rate Limiting
    const ip = (await headers()).get("x-forwarded-for") ?? "127.0.0.1"
    
    if (rateLimit) {
      const { success: rateLimitSuccess } = await rateLimit.limit(`contact_${ip}`)

      if (!rateLimitSuccess) {
        return { success: false, error: "Too many requests. Please try again later." }
      }
    }

    // 2. Validation
    const validatedFields = contactSchema.safeParse(data)
    if (!validatedFields.success) {
      // Flatten errors to a single string for simple serializable error
      return {
        success: false,
        error: Object.values(validatedFields.error.flatten().fieldErrors).flat().join(", "),
      }
    }

    return await safeDbQuery(async () => {
      const { name, email, subject, message } = validatedFields.data
      await prisma.contactMessage.create({
        data: { name, email, subject, message },
      })
      return { success: true }
    })
  } catch (error: any) {
    console.error("Contact submission error:", error)
    return { success: false, error: error.message || "Failed to send message. Please try again." }
  }
}

export async function getContactMessages() {
  try {
    await ensureAdmin()
    return await safeDbQuery(async () => {
      return prisma.contactMessage.findMany({
        orderBy: { createdAt: "desc" },
      })
    }, [])
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch messages" }
  }
}

export async function markMessageAsRead(id: string, isRead: boolean = true) {
  try {
    await ensureAdmin()
    const result = await safeDbQuery(async () => {
      await prisma.contactMessage.update({
        where: { id },
        data: { isRead },
      })
      return { success: true }
    })

    if (result.success) {
      revalidatePath("/control/messages")
    }
    return result
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update status" }
  }
}

export async function deleteContactMessage(id: string) {
  try {
    await ensureAdmin()
    const result = await safeDbQuery(async () => {
      await prisma.contactMessage.delete({ where: { id } })
      return { success: true }
    })

    if (result.success) {
      revalidatePath("/control/messages")
    }
    return result
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete message" }
  }
}
