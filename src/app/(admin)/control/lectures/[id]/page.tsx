import { auth } from "@/auth"
import { Role } from "@prisma/client"
import { redirect, notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import { EditLectureForm } from "@/components/control/edit-lecture-form"

interface EditLecturePageProps {
  params: Promise<{ id: string }>
}

export default async function EditLecturePage({ params }: EditLecturePageProps) {
  const { id } = await params
  const session = await auth()

  if (session?.user?.role !== Role.ADMIN && session?.user?.role !== Role.INSTRUCTOR) {
    redirect("/login")
  }

  const lecture = await prisma.lecture.findUnique({
    where: { id },
  })

  if (!lecture) {
    notFound()
  }

  return <EditLectureForm lecture={lecture} />
}
