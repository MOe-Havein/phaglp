import { auth } from "@/auth"
import { Role } from "@prisma/client"
import { redirect, notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import { PageForm } from "@/components/control/page-form"

interface EditPageProps {
  params: Promise<{ id: string }>
}

export default async function EditPage({ params }: EditPageProps) {
  const { id } = await params
  const session = await auth()

  if (session?.user?.role !== Role.ADMIN) {
    redirect("/login")
  }

  const page = await prisma.page.findUnique({
    where: { id },
  })

  if (!page) {
    notFound()
  }

  return <PageForm initialData={page} />
}
