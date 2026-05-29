import { Home } from "lucide-react"
import { prisma, serializePrisma } from "@/lib/prisma"
import { HomepageEditor } from "@/components/admin/HomepageEditor"

export const metadata = {
  title: "Homepage CMS — PHAGLP Control",
}

async function getSections() {
  try {
    const sections = await prisma.homepageSection.findMany({
      orderBy: { order: "asc" },
    })
    return serializePrisma(sections)
  } catch {
    return []
  }
}

export default async function HomepagePage() {
  const sections = await getSections()

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
          <Home className="w-4 h-4" />
          <span>CMS</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Homepage</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage the public-facing homepage sections.
        </p>
      </div>

      <HomepageEditor initialSections={sections as any} />
    </div>
  )
}
