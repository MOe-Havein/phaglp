"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createCourse } from "@/lib/cms-actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { BookOpen, Loader2, Save, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewCoursePage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const data = {
      title: formData.get("title"),
      slug: formData.get("slug"),
      description: formData.get("description"),
      duration: formData.get("duration"),
      price: formData.get("price"),
      published: formData.get("published") === "on",
    }

    try {
      await createCourse(data)
      toast.success("Course created successfully")
      router.push("/control/courses")
    } catch (error) {
      toast.error("Failed to create course")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl space-y-8">
      <Link
        href="/control/courses"
        className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Courses
      </Link>

      <div className="flex items-center gap-4">
        <div className="p-3 bg-orange-100 rounded-xl">
          <BookOpen className="w-8 h-8 text-orange-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Course</h1>
          <p className="text-muted-foreground">Draft your new philosophical curriculum.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="border-orange-100 shadow-xl shadow-orange-500/5">
          <CardHeader>
            <CardTitle>Course Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="title">Course Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g. Introduction to Metaphysics"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="slug">Slug (URL)</Label>
              <Input id="slug" name="slug" placeholder="intro-to-metaphysics" required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe the course content and objectives..."
                className="min-h-[150px]"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="duration">Duration</Label>
              <Input id="duration" name="duration" placeholder="e.g. 8 weeks, 40 hours, etc." />
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="grid gap-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input id="price" name="price" type="number" step="0.01" defaultValue="0" />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label>Published Status</Label>
                  <p className="text-xs text-muted-foreground">
                    Make this course visible to students immediately.
                  </p>
                </div>
                <Switch name="published" />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold h-12"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Course
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
