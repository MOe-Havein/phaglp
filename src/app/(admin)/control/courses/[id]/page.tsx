import { notFound } from "next/navigation";
import { prisma, serializePrisma } from "@/lib/prisma";
import { EditCourseForm } from "@/components/control/edit-course-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const course = await prisma.course.findUnique({
    where: { id },
    select: { title: true },
  });

  return {
    title: course
      ? `Edit: ${course.title} — PHAGLP Control`
      : "Edit Course — PHAGLP Control",
  };
}

export default async function EditCoursePage({ params }: PageProps) {
  const { id } = await params;
  const course = await prisma.course.findUnique({
    where: { id },
  });

  if (!course) {
    notFound();
  }

  // Serialize before passing to client components to prevent Date serialization issues in RSC
  const serializedCourse = serializePrisma(course);

  return (
    <div className="container mx-auto py-6">
      <EditCourseForm course={serializedCourse} />
    </div>
  );
}
