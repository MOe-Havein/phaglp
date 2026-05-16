import { auth } from "@/auth"
import { Role } from "@prisma/client"
import { redirect, notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { CurriculumManager } from "@/components/control/curriculum-manager"

interface CurriculumPageProps {
  params: Promise<{ id: string }>
}

export default async function CurriculumPage({ params }: CurriculumPageProps) {
  const { id } = await params
  const session = await auth()

  if (session?.user?.role !== Role.ADMIN && session?.user?.role !== Role.INSTRUCTOR) {
    redirect("/login")
  }

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      modules: {
        include: {
          lessons: {
            orderBy: { order: "asc" },
          },
        },
        orderBy: { order: "asc" },
      },
    },
  })

  if (!course) {
    notFound()
  }

  return (
    <div className="container mx-auto py-10 space-y-8 max-w-5xl">
      <div className="flex items-center justify-between border-b pb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/control/courses/${course.id}`}>
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Course Curriculum</h1>
            <p className="text-muted-foreground">{course.title}</p>
          </div>
        </div>
      </div>

      <CurriculumManager courseId={course.id} initialModules={course.modules as any} />
    </div>
  )
}
