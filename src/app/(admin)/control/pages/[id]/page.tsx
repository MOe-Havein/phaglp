import { notFound } from "next/navigation"
import { PageForm } from "@/components/control/page-form"
import { prisma, serializePrisma } from "@/lib/prisma"

export const metadata = {
  title: "Edit Page — PHAGLP Control",
}

interface EditPageProps {
  params: Promise<{ id: string }>
}

export default async function EditPage({ params }: EditPageProps) {
  const { id } = await params

  // Bulletproof safeguard: If Next.js 15 routing group resolution matches 'new' to [id],
  // render the create page form directly instead of throwing a 404.
  if (id === "new") {
    return (
      <div className="container mx-auto py-6">
        <PageForm />
      </div>
    )
  }

  const page = await prisma.page.findUnique({
    where: { id },
  })

  if (!page) {
    notFound()
  }

  return (
    <div className="container mx-auto py-6">
      <PageForm initialData={serializePrisma(page)} />
    </div>
  )
}
