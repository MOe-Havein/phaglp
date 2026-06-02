"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import { enrollInCourse } from "@/lib/course-actions"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useSession } from "next-auth/react"

import Link from "next/link"

interface EnrollButtonProps {
  courseId: string
  isEnrolled: boolean
  price: number
  courseSlug?: string | undefined
  foxyUrl?: string | undefined
}

export function EnrollButton({ courseId, isEnrolled, price, courseSlug, foxyUrl }: EnrollButtonProps) {
  const [loading, setLoading] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  async function handleEnroll() {
    if (!session) {
      router.push(`/login?callbackUrl=/courses/${courseSlug || courseId}`)
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
      <Button asChild className="w-full mb-4 bg-emerald-600 hover:bg-emerald-700 text-white h-12 text-lg font-bold">
        <Link href={`/courses/${courseSlug}/player`}>
          Go to Classroom
        </Link>
      </Button>
    )
  }

  // If it's a paid course, redirect to FoxyCart checkout if logged in, or prompt login if not
  if (price > 0) {
    if (!session) {
      return (
        <Button
          onClick={() => router.push(`/login?callbackUrl=/courses/${courseSlug || courseId}`)}
          className="w-full mb-4 bg-accent text-white hover:bg-accent/90 h-12 text-lg font-bold shadow-lg shadow-accent/20"
        >
          Sign in to Enroll
        </Button>
      )
    }

    return (
      <Button
        asChild
        className="w-full mb-4 bg-accent text-white hover:bg-accent/90 h-12 text-lg font-bold shadow-lg shadow-accent/20"
      >
        <a href={foxyUrl || "#"}>
          Enroll for ${price.toFixed(2)}
        </a>
      </Button>
    )
  }

  return (
    <Button
      onClick={handleEnroll}
      disabled={loading}
      className="w-full mb-4 bg-accent text-white hover:bg-accent/90 h-12 text-lg font-bold shadow-lg shadow-accent/20"
    >
      {loading ? "Processing..." : "Enroll for Free"}
    </Button>
  )
}
