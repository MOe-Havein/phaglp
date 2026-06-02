"use server"

import { prisma, serializePrisma } from "@/lib/prisma"
import { revalidatePath, revalidateTag } from "next/cache"
import { Role } from "@prisma/client"
import { auth } from "@/auth"
import { z } from "zod"
import { slugify } from "@/lib/utils"
import { redis } from "@/lib/redis"
import readingTime from "reading-time"

const blogPostSchema = z.object({
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

async function generateUniqueSlug(title: string) {
  let slug = slugify(title)
  let counter = 1
  const MAX_ATTEMPTS = 100

  while (counter < MAX_ATTEMPTS) {
    const existing = await prisma.post.findUnique({
      where: { slug },
      select: { id: true },
    })

    if (!existing) return slug

    slug = `${slugify(title)}-${counter}`
    counter++
  }

  throw new Error("Could not generate a unique slug after 100 attempts")
}

export async function createBlogPost(data: any) {
  try {
    await ensureAdminOrInstructor()
    const session = await auth()

    if (!session?.user?.id) {
      return { success: false, error: "User session is invalid. Please log in again." }
    }

    const parsedData = blogPostSchema.parse(data)
    const slug = await generateUniqueSlug(parsedData.title)
    const stats = readingTime(parsedData.body)

    const post = await prisma.post.create({
      data: {
        title: parsedData.title,
        body: parsedData.body,
        category: parsedData.category,
        coverImage: parsedData.coverImage || null,
        isFeatured: parsedData.isFeatured || false,
        published: parsedData.published || false,
        tags: parsedData.tags || [],
        slug,
        readingTime: Math.ceil(stats.minutes),
        authorId: session.user.id,
      },
    })

    // Instant Redis Cache Eviction
    await redis.del("blog-posts")

    // Dynamic Router Eviction
    revalidatePath("/blog")
    revalidatePath("/")
    revalidateTag("blog-posts")
    return { success: true, data: serializePrisma(post) }
  } catch (error: any) {
    console.error("Failed to create blog post:", error)
    return { success: false, error: error.message || "Failed to create blog post" }
  }
}

export async function updateBlogPost(id: string, data: any) {
  try {
    await ensureAdminOrInstructor()
    const parsedData = blogPostSchema.parse(data)
    const stats = readingTime(parsedData.body)

    const existing = await prisma.post.findUnique({ where: { id } })
    if (!existing) throw new Error("Blog post not found")

    const updateData: any = {
      title: parsedData.title,
      body: parsedData.body,
      category: parsedData.category,
      published: parsedData.published,
      tags: parsedData.tags || [],
      readingTime: Math.ceil(stats.minutes),
    }

    if (parsedData.title !== existing.title) {
      updateData.slug = await generateUniqueSlug(parsedData.title)
    }
    if (parsedData.coverImage !== undefined) {
      updateData.coverImage = parsedData.coverImage
    }
    if (parsedData.isFeatured !== undefined) {
      updateData.isFeatured = parsedData.isFeatured
    }

    const post = await prisma.post.update({
      where: { id },
      data: updateData,
    })

    // Instant Redis Cache Eviction
    await redis.del("blog-posts")

    // Dynamic Router Eviction
    revalidatePath("/blog")
    revalidatePath(`/blog/${post.slug}`)
    revalidatePath("/")
    revalidateTag("blog-posts")
    return { success: true, data: serializePrisma(post) }
  } catch (error: any) {
    console.error("Failed to update blog post:", error)
    return { success: false, error: error.message || "Failed to update blog post" }
  }
}

export async function deleteBlogPost(id: string) {
  try {
    await ensureAdminOrInstructor()
    const post = await prisma.post.delete({ where: { id } })

    // Instant Redis Cache Eviction
    await redis.del("blog-posts")

    // Dynamic Router Eviction
    revalidatePath("/blog")
    revalidatePath(`/blog/${post.slug}`)
    revalidatePath("/")
    revalidateTag("blog-posts")
    return { success: true }
  } catch (error: any) {
    console.error("Failed to delete blog post:", error)
    return { success: false, error: error.message || "Failed to delete blog post" }
  }
}
