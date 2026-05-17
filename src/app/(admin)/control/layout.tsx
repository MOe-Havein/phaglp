import { ControlSidebar } from "@/components/control/ControlSidebar"
import { PageTransition } from "@/components/animations/page-transition"
import { auth } from "@/auth"
import { Role } from "@prisma/client"
import { redirect } from "next/navigation"

export default async function ControlLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  // Strict server-side check for admin/instructor roles
  if (!session || !session.user?.role || session.user.role === Role.USER) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen bg-gray-50/50 dark:bg-gray-950">
      <ControlSidebar userName={session.user?.name} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </div>
  )
}
