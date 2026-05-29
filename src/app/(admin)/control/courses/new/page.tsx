import { CreateCourseForm } from "@/components/control/create-course-form"

export const metadata = {
  title: "New Course — PHAGLP Control",
  description: "Create a new course curriculum.",
}

export default function NewCoursePage() {
  return (
    <div className="container mx-auto py-10">
      <CreateCourseForm />
    </div>
  )
}
