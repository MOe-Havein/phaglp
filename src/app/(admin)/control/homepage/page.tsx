import React from "react"
import prisma from "@/lib/db/prisma"
import { requireAdmin } from "@/lib/rbac"
import { HomepageEditor } from "@/components/admin/HomepageEditor"

export default async function HomepageEditorPage() {
  await requireAdmin()

  const sections = await prisma.homepageSection.findMany({
    orderBy: { order: "asc" },
  })

  return (
    <div className="container mx-auto py-10 space-y-8 px-4">
      <HomepageEditor initialSections={sections} />
    </div>
  )
}
