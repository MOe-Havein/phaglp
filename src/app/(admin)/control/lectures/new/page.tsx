import { CreateLectureForm } from "@/components/control/create-lecture-form"

export const metadata = {
  title: "New Lecture — PHAGLP Control",
  description: "Create a new lecture.",
}

export default function NewLecturePage() {
  return (
    <div className="container mx-auto py-10">
      <CreateLectureForm />
    </div>
  )
}
