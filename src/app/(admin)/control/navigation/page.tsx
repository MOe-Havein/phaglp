import { Navigation } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { MenuManager } from "@/components/control/menu-manager"

export const metadata = {
  title: "Navigation Control — PHAGLP Control",
}

async function getMenus() {
  try {
    return await prisma.navigationMenu.findMany({
      orderBy: { order: "asc" },
      include: {
        items: { orderBy: { order: "asc" } },
      },
    })
  } catch {
    return []
  }
}

export default async function NavigationPage() {
  const menus = await getMenus()

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
          <Navigation className="w-4 h-4" />
          <span>Navigation</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
          Navigation Control
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage header and footer menus and sub-links.
        </p>
      </div>

      <MenuManager initialMenus={menus as any} />
    </div>
  )
}
