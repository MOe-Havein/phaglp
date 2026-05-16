import { auth } from "@/auth"
import { Role } from "@prisma/client"
import { redirect } from "next/navigation"
import { PageForm } from "@/components/control/page-form"

export default async function NewPage() {
  const session = await auth()

  if (session?.user?.role !== Role.ADMIN) {
    redirect("/login")
  }

  return <PageForm />
}
