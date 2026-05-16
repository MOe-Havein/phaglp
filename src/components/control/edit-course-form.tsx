"use client"

import { updateCourse } from "@/lib/cms-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChevronLeft, Save, BookOpen, Loader2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Course } from "@prisma/client"

interface EditCourseFormProps {
  course: Course
}

export function EditCourseForm({ course }: EditCourseFormProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleUpdate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const data = {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      description: formData.get("description") as string,
      duration: formData.get("duration") as string,
      price: formData.get("price") as string,
      published: formData.get("published") === "on",
    }

    try {
      const result = await updateCourse(course.id, data)
      if (result.success) {
        toast.success("Course updated successfully!")
        router.push("/control/courses")
        router.refresh()
      } else {
        toast.error(result.error || "Failed to update course")
      }
    } catch (error) {
      console.error("Failed to update course:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleUpdate} className="container mx-auto py-10 space-y-8 max-w-5xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/control/courses">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Course</h1>
            <p className="text-muted-foreground text-sm">Update your philosophical curriculum.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" disabled={loading} asChild>
            <Link href="/control/courses">Cancel</Link>
          </Button>
          <Button
            type="submit"
            className="bg-orange-600 hover:bg-orange-700 text-white"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Details</CardTitle>
              <CardDescription>Primary information about the course.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={course.title}
                  placeholder="Advanced Metaphysics"
                  className="text-lg font-medium"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={course.description || ""}
                  placeholder="Describe the course journey..."
                  className="min-h-[200px] resize-y"
                  required
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  name="duration"
                  defaultValue={course.duration || ""}
                  placeholder="e.g. 10 hours"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  defaultValue={course.price}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  name="slug"
                  defaultValue={course.slug}
                  placeholder="course-slug"
                  required
                />
              </div>
              <div className="flex items-center space-x-2 pt-4 border-t">
                <input
                  type="checkbox"
                  id="published"
                  name="published"
                  defaultChecked={course.published}
                  className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-600"
                />
                <Label htmlFor="published">Published</Label>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-orange-50 border-orange-100 dark:bg-orange-950/20 dark:border-orange-900/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2 text-orange-700 dark:text-orange-400">
                <BookOpen className="h-4 w-4" /> Curriculum
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs leading-relaxed text-orange-600 dark:text-orange-500">
                Course modules and lessons are currently managed in a separate section.
              </p>
              <Button
                size="sm"
                variant="outline"
                className="w-full bg-white border-orange-200 text-orange-700 hover:bg-orange-50"
                asChild
              >
                <Link href={`/control/courses/${course.id}/curriculum`}>Manage Modules</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
