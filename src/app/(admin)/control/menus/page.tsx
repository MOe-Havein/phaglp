import { auth } from "@/auth"
import { Role } from "@prisma/client"
import { redirect } from "next/navigation"
import { prisma, serializePrisma } from "@/lib/prisma"
import { MenuManager } from "@/components/control/menu-manager"
import { Navigation } from "lucide-react"

export default async function AdminMenusPage() {
  const session = await auth()

  if (session?.user?.role !== Role.ADMIN) {
    redirect("/login")
  }

  // Hydrate all navigation menus with their nested submenu items ordered correctly
  const rawMenus = await prisma.navigationMenu.findMany({
    orderBy: { order: "asc" },
    include: {
      items: {
        orderBy: { order: "asc" },
      },
    },
  })

  // Sanitize Prisma query outputs so they can be passed as component props without warning
  const menus = serializePrisma(rawMenus)

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex items-center gap-4 border-b pb-6">
        <div className="p-3 bg-primary/10 rounded-xl">
          <Navigation className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Navigation Control Hub</h1>
          <p className="text-muted-foreground">
            Configure dynamic menus, nested dropdown systems, custom redirects, and tab targets
            across the platform.
          </p>
        </div>
      </div>

      <MenuManager initialMenus={menus} />
    </div>
  )
}
