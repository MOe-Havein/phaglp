import { auth } from "@/auth"
import { TechConceptsDashboard } from "@/components/dashboard/tech-concepts-dashboard"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"

export const metadata = {
  title: "Interactive Tech Concepts Hub",
  description:
    "Explore advanced integrated technology configurations within the PHAGLP Unified Academy platform.",
}

export default async function TechConceptsPage() {
  const session = await auth()

  if (!session || !session.user) {
    redirect("/login?callbackUrl=/dashboard/tech-concepts")
  }

  const logs = await prisma.analytics.findMany({
    where: {
      userId: session.user.id,
      path: "/dashboard/tech-concepts",
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 15,
  })

  return (
    <div className="min-h-screen bg-slate-50/40 dark:bg-slate-950/20 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <TechConceptsDashboard user={session.user} initialDbLogs={logs} />
      </div>
    </div>
  )
}
