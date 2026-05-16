"use server"

import { prisma, serializePrisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { Role } from "@prisma/client"
import { auth } from "@/auth"
import { slugify } from "./utils"

async function ensureAdmin() {
  const session = await auth()
  if (session?.user?.role !== Role.ADMIN) {
    throw new Error("Unauthorized: Admin access required")
  }
}

export async function createPage(data: any) {
  try {
    await ensureAdmin()

    const slug = data.slug || slugify(data.title)

    // Check uniqueness
    const existing = await prisma.page.findUnique({ where: { slug } })
    if (existing) {
      return { success: false, error: "Slug already exists" }
    }

    const page = await prisma.page.create({
      data: {
        title: data.title,
        slug,
        content: data.content,
        seoTitle: data.seoTitle,
        metaDescription: data.metaDescription,
        published: data.published || false,
      },
    })

    revalidatePath("/control/pages")
    revalidatePath(`/${slug}`)
    return { success: true, data: serializePrisma(page) }
  } catch (error: any) {
    console.error("Create page error:", error)
    return { success: false, error: error.message || "Failed to create page" }
  }
}

export async function updatePage(id: string, data: any) {
  try {
    await ensureAdmin()

    const slug = data.slug || slugify(data.title)

    const page = await prisma.page.update({
      where: { id },
      data: {
        title: data.title,
        slug,
        content: data.content,
        seoTitle: data.seoTitle,
        metaDescription: data.metaDescription,
        published: data.published,
      },
    })

    revalidatePath("/control/pages")
    revalidatePath(`/${slug}`)
    return { success: true, data: serializePrisma(page) }
  } catch (error: any) {
    console.error("Update page error:", error)
    return { success: false, error: error.message || "Failed to update page" }
  }
}

export async function deletePage(id: string) {
  try {
    await ensureAdmin()
    const page = await prisma.page.delete({ where: { id } })
    revalidatePath("/control/pages")
    revalidatePath(`/${page.slug}`)
    return { success: true }
  } catch (error: any) {
    console.error("Delete page error:", error)
    return { success: false, error: error.message || "Failed to delete page" }
  }
}
