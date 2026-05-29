import { notFound } from "next/navigation"
import { prisma, serializePrisma } from "@/lib/prisma"
import { EditLectureForm } from "@/components/control/edit-lecture-form"

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  const lecture = await prisma.lecture.findUnique({
    where: { id },
    select: { title: true },
  })

  return {
    title: lecture ? `Edit: ${lecture.title} — PHAGLP Control` : "Edit Lecture — PHAGLP Control",
  }
}

export default async function EditLecturePage({ params }: PageProps) {
  const { id } = await params
  const lecture = await prisma.lecture.findUnique({
    where: { id },
  })

  if (!lecture) {
    notFound()
  }

  // Serialize before passing to client components to prevent Date serialization issues in RSC
  const serializedLecture = serializePrisma(lecture)

  return (
    <div className="container mx-auto py-6">
      <EditLectureForm lecture={serializedLecture} />
    </div>
  )
}
