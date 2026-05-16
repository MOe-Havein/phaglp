"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import { enrollInCourse } from "@/lib/course-actions"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useSession } from "next-auth/react"

interface EnrollButtonProps {
  courseId: string
  isEnrolled: boolean
  price: number
}

export function EnrollButton({ courseId, isEnrolled, price }: EnrollButtonProps) {
  const [loading, setLoading] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  async function handleEnroll() {
    if (!session) {
      router.push(`/login?callbackUrl=/courses/${courseId}`)
      return
    }

    setLoading(true)
    try {
      const result = await enrollInCourse(courseId)
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success("Successfully enrolled in the course!")
        router.refresh()
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (isEnrolled) {
    return (
      <Button disabled className="w-full mb-4 bg-green-600 text-white h-12 text-lg font-bold">
        Already Enrolled
      </Button>
    )
  }

  return (
    <Button
      onClick={handleEnroll}
      disabled={loading}
      className="w-full mb-4 bg-accent text-white hover:bg-accent/90 h-12 text-lg font-bold shadow-lg shadow-accent/20"
    >
      {loading ? "Processing..." : price === 0 ? "Enroll for Free" : "Enroll Now"}
    </Button>
  )
}
