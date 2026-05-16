"use server"

import { prisma, safeDbQuery } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { Role, SubscriptionTier } from "@prisma/client"
import { auth } from "@/auth"
import bcrypt from "bcryptjs"
import { z } from "zod"

async function ensureControlAccess() {
  const session = await auth()
  if (session?.user?.role !== Role.ADMIN) {
    throw new Error("Unauthorized: Control access required")
  }
}

export async function deleteUser(userId: string) {
  try {
    await ensureControlAccess()
    const result = await safeDbQuery(async () => {
      return prisma.user.delete({ where: { id: userId } })
    })
    if (result.success) {
      revalidatePath("/control/users")
    }
    return result
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete user" }
  }
}

export async function updateSiteSettings(data: any) {
  try {
    await ensureControlAccess()

    const result = await safeDbQuery(async () => {
      return prisma.siteSettings.upsert({
        where: { id: "global" },
        update: {
          siteName: data.siteName,
          siteUrl: data.siteUrl,
          description: data.description,
          maintenanceMode: data.maintenanceMode,
          metaTitle: data.metaTitle,
          metaDescription: data.metaDescription,
          primaryColor: data.primaryColor,
        },
        create: {
          id: "global",
          siteName: data.siteName,
          siteUrl: data.siteUrl,
          description: data.description,
          maintenanceMode: data.maintenanceMode,
          metaTitle: data.metaTitle,
          metaDescription: data.metaDescription,
          primaryColor: data.primaryColor,
        },
      })
    })

    if (result.success) {
      revalidatePath("/control/settings")
      revalidatePath("/")
    }
    return result
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update settings" }
  }
}

export async function toggleFeatureFlag(key: string, isEnabled: boolean) {
  try {
    await ensureControlAccess()
    const result = await safeDbQuery(async () => {
      return prisma.featureFlag.upsert({
        where: { key },
        update: { isEnabled },
        create: { key, isEnabled },
      })
    })

    if (result.success) {
      revalidatePath("/control/settings")
    }
    return result
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to toggle feature flag" }
  }
}

export async function updateUserRole(userId: string, role: Role) {
  try {
    await ensureControlAccess()
    const result = await safeDbQuery(async () => {
      return prisma.user.update({
        where: { id: userId },
        data: { role },
      })
    })

    if (result.success) {
      revalidatePath("/control/users")
    }
    return result
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update user role" }
  }
}

export async function updateUserTier(userId: string, tier: SubscriptionTier) {
  try {
    await ensureControlAccess()
    const result = await safeDbQuery(async () => {
      return prisma.user.update({
        where: { id: userId },
        data: { tier },
      })
    })

    if (result.success) {
      revalidatePath("/control/users")
    }
    return result
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update user tier" }
  }
}

const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional()
    .or(z.literal("")),
  role: z.nativeEnum(Role),
  tier: z.nativeEnum(SubscriptionTier).optional(),
})

export async function createUser(data: z.infer<typeof userSchema>) {
  try {
    await ensureControlAccess()

    const validated = userSchema.parse(data)

    if (!validated.password) {
      return { success: false, error: "Password is required for new users" }
    }

    const passwordHash = await bcrypt.hash(validated.password, 10)

    const result = await safeDbQuery(async () => {
      return prisma.user.create({
        data: {
          name: validated.name,
          email: validated.email,
          passwordHash,
          role: validated.role,
          tier: validated.tier ?? SubscriptionTier.BASIC,
        },
      })
    })

    if (result.success) {
      revalidatePath("/control/users")
    }
    return result
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create user" }
  }
}

export async function updateUser(userId: string, data: Partial<z.infer<typeof userSchema>>) {
  try {
    await ensureControlAccess()

    const validated = userSchema.partial().parse(data)

    const updateData: any = {
      name: validated.name,
      email: validated.email,
      role: validated.role,
    }

    if (validated.tier) {
      updateData.tier = validated.tier
    }

    if (validated.password) {
      updateData.passwordHash = await bcrypt.hash(validated.password, 10)
    }

    const result = await safeDbQuery(async () => {
      return prisma.user.update({
        where: { id: userId },
        data: updateData,
      })
    })

    if (result.success) {
      revalidatePath("/control/users")
    }
    return result
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update user" }
  }
}

export async function getControlAnalytics() {
  try {
    await ensureControlAccess()

    return await safeDbQuery(async () => {
      const [userCount, courseCount, lectureCount] = await Promise.all([
        prisma.user.count(),
        prisma.course.count(),
        prisma.lecture.count(),
      ])

      return {
        userCount,
        courseCount,
        lectureCount,
      }
    })
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch analytics" }
  }
}

export async function getRecentAnalytics(limit = 10) {
  try {
    await ensureControlAccess()

    return await safeDbQuery(async () => {
      return prisma.analytics.findMany({
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      })
    })
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch recent analytics" }
  }
}

export async function trackAnalytics(event: string, path?: string, metadata?: any) {
  try {
    const session = await auth()
    const userId = session?.user?.id

    return await safeDbQuery(async () => {
      return prisma.analytics.create({
        data: {
          event,
          path,
          metadata: metadata || {},
          userId,
        },
      })
    })
  } catch (error) {
    console.error("Failed to track analytics:", error)
    return { success: false, error: "Failed to track analytics" }
  }
}
