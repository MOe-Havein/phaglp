"use server"

import { prisma, safeDbQuery } from "@/lib/prisma"
import { revalidatePath, revalidateTag } from "next/cache"
import { Role } from "@prisma/client"
import { auth } from "@/auth"

async function ensureAdminAccess() {
  const session = await auth()
  if (session?.user?.role !== Role.ADMIN) {
    throw new Error("Unauthorized: Admin access required")
  }
}

export async function getAllMenusForAdmin() {
  try {
    await ensureAdminAccess()
    return await safeDbQuery(async () => {
      return prisma.navigationMenu.findMany({
        orderBy: { order: "asc" },
        include: {
          items: {
            orderBy: { order: "asc" },
          },
        },
      })
    })
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch menus" }
  }
}

export async function createMenu(data: {
  name: string
  order?: number
  href?: string | null
  isOpenNewTab?: boolean
  isActive?: boolean
  icon?: string | null
}) {
  try {
    await ensureAdminAccess()
    const result = await safeDbQuery(async () => {
      // Find highest order if not provided
      let order = data.order
      if (order === undefined) {
        const lastMenu = await prisma.navigationMenu.findFirst({
          orderBy: { order: "desc" },
        })
        order = lastMenu ? lastMenu.order + 1 : 1
      }

      return prisma.navigationMenu.create({
        data: {
          name: data.name,
          order,
          href: data.href || null,
          isOpenNewTab: data.isOpenNewTab || false,
          isActive: data.isActive !== false,
          icon: data.icon || null,
        },
      })
    })

    if (result.success) {
      revalidateTag("site-menus")
      revalidatePath("/")
    }
    return result
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create menu" }
  }
}

export async function updateMenu(
  id: string,
  data: {
    name?: string
    order?: number
    href?: string | null
    isOpenNewTab?: boolean
    isActive?: boolean
    icon?: string | null
  }
) {
  try {
    await ensureAdminAccess()
    const result = await safeDbQuery(async () => {
      return prisma.navigationMenu.update({
        where: { id },
        data: {
          name: data.name,
          order: data.order,
          href: data.href,
          isOpenNewTab: data.isOpenNewTab,
          isActive: data.isActive,
          icon: data.icon,
        },
      })
    })

    if (result.success) {
      revalidateTag("site-menus")
      revalidatePath("/")
    }
    return result
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update menu" }
  }
}

export async function deleteMenu(id: string) {
  try {
    await ensureAdminAccess()
    const result = await safeDbQuery(async () => {
      return prisma.navigationMenu.delete({
        where: { id },
      })
    })

    if (result.success) {
      revalidateTag("site-menus")
      revalidatePath("/")
    }
    return result
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete menu" }
  }
}

export async function createSubItem(
  menuId: string,
  data: {
    name: string
    href: string
    order?: number
    isOpenNewTab?: boolean
    isActive?: boolean
    icon?: string | null
  }
) {
  try {
    await ensureAdminAccess()
    const result = await safeDbQuery(async () => {
      let order = data.order
      if (order === undefined) {
        const lastItem = await prisma.navigationSubItem.findFirst({
          where: { menuId },
          orderBy: { order: "desc" },
        })
        order = lastItem ? lastItem.order + 1 : 1
      }

      return prisma.navigationSubItem.create({
        data: {
          menuId,
          name: data.name,
          href: data.href,
          order,
          isOpenNewTab: data.isOpenNewTab || false,
          isActive: data.isActive !== false,
          icon: data.icon || null,
        },
      })
    })

    if (result.success) {
      revalidateTag("site-menus")
      revalidatePath("/")
    }
    return result
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create sub-item" }
  }
}

export async function updateSubItem(
  id: string,
  data: {
    name?: string
    href?: string
    order?: number
    isOpenNewTab?: boolean
    isActive?: boolean
    icon?: string | null
  }
) {
  try {
    await ensureAdminAccess()
    const result = await safeDbQuery(async () => {
      return prisma.navigationSubItem.update({
        where: { id },
        data: {
          name: data.name,
          href: data.href,
          order: data.order,
          isOpenNewTab: data.isOpenNewTab,
          isActive: data.isActive,
          icon: data.icon,
        },
      })
    })

    if (result.success) {
      revalidateTag("site-menus")
      revalidatePath("/")
    }
    return result
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update sub-item" }
  }
}

export async function deleteSubItem(id: string) {
  try {
    await ensureAdminAccess()
    const result = await safeDbQuery(async () => {
      return prisma.navigationSubItem.delete({
        where: { id },
      })
    })

    if (result.success) {
      revalidateTag("site-menus")
      revalidatePath("/")
    }
    return result
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete sub-item" }
  }
}

export async function reorderMenus(menuIds: string[]) {
  try {
    await ensureAdminAccess()
    const result = await safeDbQuery(async () => {
      const updates = menuIds.map((id, index) =>
        prisma.navigationMenu.update({
          where: { id },
          data: { order: index + 1 },
        })
      )
      return prisma.$transaction(updates)
    })

    if (result.success) {
      revalidateTag("site-menus")
      revalidatePath("/")
    }
    return result
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to reorder menus" }
  }
}

export async function reorderSubItems(subItemIds: string[]) {
  try {
    await ensureAdminAccess()
    const result = await safeDbQuery(async () => {
      const updates = subItemIds.map((id, index) =>
        prisma.navigationSubItem.update({
          where: { id },
          data: { order: index + 1 },
        })
      )
      return prisma.$transaction(updates)
    })

    if (result.success) {
      revalidateTag("site-menus")
      revalidatePath("/")
    }
    return result
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to reorder sub-items" }
  }
}
