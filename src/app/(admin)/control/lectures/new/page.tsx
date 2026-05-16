"use client"

import { createLecture } from "@/lib/cms-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChevronLeft, Save, Image as ImageIcon, Wand2, Loader2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { MarkdownEditor } from "@/components/editor/markdown-editor"
import { AIAssistantPanel } from "@/components/control/ai-assistant-panel"
import Image from "next/image"

export default function NewLecturePage() {
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState("")
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [slug, setSlug] = useState("")
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()

  async function handlePublish(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const data = {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      body: content,
      category: formData.get("category") as string,
      coverImage: (formData.get("coverImageUrl") as string) || null,
      isFeatured: formData.get("isFeatured") === "on",
      published: true,
    }

    try {
      const result = await createLecture(data)

      if (result.success) {
        toast.success("Lecture published successfully!")
        router.push("/control/lectures")
        router.refresh()
      } else {
        toast.error(result.error || "Failed to publish lecture")
      }
    } catch (error: any) {
      console.error("Failed to publish lecture:", error)
      toast.error("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleInsertContent = (generatedContent: string) => {
    setContent((prev) => (prev ? `${prev}\n\n${generatedContent}` : generatedContent))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file")
      return
    }

    // Check file size (max 4MB to fit within Vercel's 4.5MB limit)
    if (file.size > 4 * 1024 * 1024) {
      toast.error("Image size must be less than 4MB")
      return
    }

    setIsUploading(true)

    // Create local preview immediately
    const reader = new FileReader()
    reader.onloadend = () => {
      setCoverImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        let errorData
        try {
          errorData = await response.json()
        } catch {
          errorData = { error: response.statusText || "Upload failed" }
        }
        throw new Error(errorData.error || "Upload failed")
      }

      const data = await response.json()
      setCoverImagePreview(data.secure_url)
      toast.success("Image uploaded successfully!")
    } catch (error: any) {
      console.error("Error uploading image:", error)
      toast.error(error.message || "Failed to upload image")
      setCoverImagePreview(null)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setCoverImage(null)
    setCoverImagePreview(null)
  }

  return (
    <form onSubmit={handlePublish} className="container mx-auto py-10 space-y-8 max-w-5xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/control/lectures">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create Lecture</h1>
            <p className="text-muted-foreground text-sm">
              Draft a new philosophical insight for the community.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" disabled={loading || isUploading}>
            Save Draft
          </Button>
          <Button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
            disabled={loading || isUploading}
          >
            {loading || isUploading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {isUploading ? "Uploading Image..." : "Publish Insight"}
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
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
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
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
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
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="ethics-of-ai"
                    required
                  />
                  <Button type="button" variant="ghost" size="icon" className="shrink-0">
                    <Wand2 className="h-4 w-4 text-emerald-600" />
                  </Button>
                </div>
              </div>
              <div className="space-y-4 pt-2 border-t">
                <Label>Cover Image</Label>
                {coverImagePreview ? (
                  <div className="relative group w-full h-48">
                    <Image
                      src={coverImagePreview}
                      alt="Cover preview"
                      fill
                      className="object-cover rounded-lg border shadow-sm transition-opacity group-hover:opacity-90"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Remove
                    </Button>
                    {/* Hidden input to store the final URL for form submission */}
                    <input type="hidden" name="coverImageUrl" value={coverImagePreview} />
                  </div>
                ) : (
                  <label htmlFor="cover-upload" className="block group cursor-pointer">
                    <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg p-8 text-center space-y-3 hover:bg-slate-50 dark:hover:bg-slate-900/50 hover:border-emerald-500/50 transition-all duration-200">
                      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-200">
                        <ImageIcon className="h-6 w-6 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Click to upload cover image
                        </p>
                        <p className="text-xs text-muted-foreground">
                          SVG, PNG, JPG or WEBP (max 1280px)
                        </p>
                      </div>
                    </div>
                    <input
                      id="cover-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                )}
                {isUploading && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Uploading to Cloudinary...
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  name="isFeatured"
                  className="rounded border-gray-300"
                />
                <Label htmlFor="isFeatured" className="cursor-pointer">
                  Mark as Featured
                </Label>
              </div>
            </CardContent>
          </Card>

          <AIAssistantPanel
            title={title}
            category={category}
            content={content}
            onInsertContent={handleInsertContent}
            onSetCategory={setCategory}
            onSetSlug={setSlug}
          />
        </div>
      </div>
    </form>
  )
}
