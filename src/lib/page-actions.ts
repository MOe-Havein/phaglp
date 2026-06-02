"use server"

import { prisma, serializePrisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { Role } from "@prisma/client"
import { auth } from "@/auth"
import { slugify } from "./utils"
import { clearNavigationCache } from "./menu-actions"

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

    // Fetch the existing page to detect slug modifications
    const oldPage = await prisma.page.findUnique({
      where: { id },
      select: { slug: true }
    })
    if (!oldPage) {
      return { success: false, error: "Page not found" }
    }
    const oldSlug = oldPage.slug

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

    // If the slug changed, update all corresponding navigation items to prevent 404s
    if (oldSlug !== slug) {
      // Sync leading slash paths (standard)
      await prisma.navigationMenu.updateMany({
        where: { href: `/${oldSlug}` },
        data: { href: `/${slug}` },
      })
      await prisma.navigationSubItem.updateMany({
        where: { href: `/${oldSlug}` },
        data: { href: `/${slug}` },
      })

      // Sync non-leading slash paths (for robustness)
      await prisma.navigationMenu.updateMany({
        where: { href: oldSlug },
        data: { href: slug },
      })
      await prisma.navigationSubItem.updateMany({
        where: { href: oldSlug },
        data: { href: slug },
      })

      // Invalidate navigation and layouts cache
      await clearNavigationCache()
      revalidatePath(`/${oldSlug}`)
    }

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

    // Fetch page to get its slug before deleting
    const page = await prisma.page.findUnique({
      where: { id },
      select: { slug: true }
    })
    if (!page) {
      return { success: false, error: "Page not found" }
    }
    const slug = page.slug

    await prisma.page.delete({ where: { id } })

    // Safely update linked navigation items to prevent public 404s
    await prisma.navigationMenu.updateMany({
      where: { href: `/${slug}` },
      data: { href: "#", isActive: false },
    })
    await prisma.navigationSubItem.updateMany({
      where: { href: `/${slug}` },
      data: { href: "#", isActive: false },
    })

    // Safely update linked navigation items without leading slashes
    await prisma.navigationMenu.updateMany({
      where: { href: slug },
      data: { href: "#", isActive: false },
    })
    await prisma.navigationSubItem.updateMany({
      where: { href: slug },
      data: { href: "#", isActive: false },
    })

    // Invalidate navigation and layouts cache
    await clearNavigationCache()

    revalidatePath("/control/pages")
    revalidatePath(`/${slug}`)
    return { success: true }
  } catch (error: any) {
    console.error("Delete page error:", error)
    return { success: false, error: error.message || "Failed to delete page" }
  }
}
