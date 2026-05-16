import { auth } from "@/auth"
import { Role } from "@prisma/client"
import { redirect, notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import { EditCourseForm } from "@/components/control/edit-course-form"

interface EditCoursePageProps {
  params: Promise<{ id: string }>
}

export default async function EditCoursePage({ params }: EditCoursePageProps) {
  const { id } = await params
  const session = await auth()

  if (session?.user?.role !== Role.ADMIN && session?.user?.role !== Role.INSTRUCTOR) {
    redirect("/login")
  }

  const course = await prisma.course.findUnique({
    where: { id },
  })

  if (!course) {
    notFound()
  }

  return <EditCourseForm course={course} />
}
