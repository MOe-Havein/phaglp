import { auth } from "@/auth"
import { TechConceptsDashboard } from "@/components/dashboard/tech-concepts-dashboard"
import { redirect } from "next/navigation"

export const metadata = {
  title: "Interactive Tech Concepts Hub",
  description: "Explore advanced integrated technology configurations within the PHAGLP Unified Academy platform.",
}

export default async function TechConceptsPage() {
  const session = await auth()

  if (!session || !session.user) {
    redirect("/login?callbackUrl=/dashboard/tech-concepts")
  }

  return (
    <div className="min-h-screen bg-slate-50/40 dark:bg-slate-950/20 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <TechConceptsDashboard user={session.user} />
      </div>
    </div>
  )
}
