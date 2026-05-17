"use client"

import { createPage, updatePage } from "@/lib/page-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { ChevronLeft, Save, Loader2, Search } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { slugify } from "@/lib/utils"

interface PageFormProps {
  initialData?: any
}

export function PageForm({ initialData }: PageFormProps) {
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState(initialData?.title || "")
  const [slug, setSlug] = useState(initialData?.slug || "")
  const [autoSlug, setAutoSlug] = useState(!initialData)
  const router = useRouter()

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setTitle(val)
    if (autoSlug) {
      setSlug(slugify(val))
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const data = {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      content: formData.get("content") as string,
      seoTitle: formData.get("seoTitle") as string,
      metaDescription: formData.get("metaDescription") as string,
      published: formData.get("published") === "on",
    }

    try {
      let result
      if (initialData) {
        result = await updatePage(initialData.id, data)
      } else {
        result = await createPage(data)
      }

      if (result.success) {
        toast.success(initialData ? "Page updated" : "Page created")
        router.push("/control/pages")
        router.refresh()
      } else {
        toast.error(result.error || "Something went wrong")
      }
    } catch (error) {
      console.error("Save page error:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="container mx-auto py-10 space-y-8 max-w-5xl px-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/control/pages">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {initialData ? "Edit Page" : "Create Page"}
            </h1>
            <p className="text-muted-foreground text-sm">Design a custom page for your platform.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {initialData ? "Save Changes" : "Publish Page"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Page Content</CardTitle>
              <CardDescription>The main body of your page. Supports text and HTML.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Page Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="e.g., About Us"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  name="content"
                  defaultValue={initialData?.content || ""}
                  placeholder="Write your page content here..."
                  className="min-h-[400px] font-sans text-base leading-relaxed"
                  required
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Publishing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="slug">Slug / URL</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="slug"
                    name="slug"
                    value={slug}
                    onChange={(e) => {
                      setSlug(e.target.value)
                      setAutoSlug(false)
                    }}
                    placeholder="about-us"
                    required
                  />
                </div>
                <p className="text-[10px] text-muted-foreground">
                  The URL will be: phaglp.com/{slug || "..."}
                </p>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3 bg-slate-50/50">
                <div className="space-y-0.5">
                  <Label>Visibility</Label>
                  <p className="text-xs text-muted-foreground">Publicly accessible</p>
                </div>
                <Switch name="published" defaultChecked={initialData?.published ?? false} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Search className="w-4 h-4 text-blue-600" /> SEO Metadata
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seoTitle">SEO Title</Label>
                <Input
                  id="seoTitle"
                  name="seoTitle"
                  defaultValue={initialData?.seoTitle || ""}
                  placeholder="Browser tab title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  name="metaDescription"
                  defaultValue={initialData?.metaDescription || ""}
                  placeholder="Brief summary for search engines..."
                  className="h-24 text-xs"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
