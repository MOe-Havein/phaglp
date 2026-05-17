"use client"

import { updateLecture } from "@/lib/cms-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChevronLeft, Save, Image as ImageIcon, Wand2, Loader2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Lecture } from "@prisma/client"
import { MarkdownEditor } from "@/components/editor/markdown-editor"

interface EditLectureFormProps {
  lecture: Lecture
}

export function EditLectureForm({ lecture }: EditLectureFormProps) {
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState(lecture.body)
  const router = useRouter()

  async function handleUpdate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const data = {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      body: content,
      category: formData.get("category") as string,
      published: lecture.published, // Preserve existing publish state
    }

    try {
      const result = await updateLecture(lecture.id, data)
      if (result.success) {
        toast.success("Lecture updated successfully!")
        router.push("/control/lectures")
        router.refresh()
      } else {
        toast.error(result.error || "Failed to update lecture")
      }
    } catch (error) {
      console.error("Failed to update lecture:", error)
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
            <Link href="/control/lectures">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Lecture</h1>
            <p className="text-muted-foreground text-sm">Refine your philosophical insight.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" disabled={loading} asChild>
            <Link href="/control/lectures">Cancel</Link>
          </Button>
          <Button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
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
              <CardTitle>Lecture Content</CardTitle>
              <CardDescription>The core text and narrative of your piece.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={lecture.title}
                  placeholder="The Ethics of AI Consciousness..."
                  className="text-lg font-medium"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Body</Label>
                <MarkdownEditor value={content} onChange={setContent} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  name="category"
                  defaultValue={lecture.category}
                  placeholder="Ethics, Metaphysics, Logic..."
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="slug"
                    name="slug"
                    defaultValue={lecture.slug}
                    placeholder="ethics-of-ai"
                    required
                  />
                  <Button type="button" variant="ghost" size="icon" className="shrink-0">
                    <Wand2 className="h-4 w-4 text-emerald-600" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2 pt-2 border-t">
                <Label>Cover Image</Label>
                <div className="border-2 border-dashed rounded-lg p-8 text-center space-y-2 hover:bg-slate-50 transition-colors cursor-pointer">
                  <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground opacity-50" />
                  <p className="text-xs text-muted-foreground">Update lecture cover image</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-emerald-50 border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                <Wand2 className="h-4 w-4" /> AI Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs leading-relaxed text-emerald-600 dark:text-emerald-500">
                Use AI to refine your existing content or generate new sections.
              </p>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="w-full bg-white border-emerald-200 text-emerald-700 hover:bg-emerald-50"
              >
                Analyze Content
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
