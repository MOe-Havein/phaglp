"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"
import { ChevronLeft, Save, Trash2, Loader2, Sparkles } from "lucide-react"
import { updateBlogPost, deleteBlogPost } from "@/lib/blog-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { WysiwygMarkdownEditor } from "@/components/editor/wysiwyg-markdown-editor"
import { CloudinaryUploadButton } from "@/components/cloudinary-upload-button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface EditBlogPostFormProps {
  post: any
}

export function EditBlogPostForm({ post }: EditBlogPostFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [content, setContent] = useState(post.body || "")
  const [published, setPublished] = useState(post.published || false)
  const [coverImage, setCoverImage] = useState(post.coverImage || "")

  // Format existing tags for display
  const initialTags = Array.isArray(post.tags) ? post.tags.join(", ") : ""

  async function handleUpdate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const title = formData.get("title") as string
    const category = formData.get("category") as string
    const excerpt = formData.get("excerpt") as string
    const tagsInput = formData.get("tagsInput") as string

    const tags = tagsInput
      ? tagsInput.split(",").map((t) => t.trim()).filter((t) => t.length > 0)
      : []

    const data = {
      title,
      body: content,
      category: category || "General",
      excerpt: excerpt || null,
      coverImage: coverImage || null,
      tags,
      published,
    }

    try {
      const result = await updateBlogPost(post.id, data)
      if (result.success) {
        toast.success("Blog post updated successfully!")
        router.push("/control/blog")
        router.refresh()
      } else {
        toast.error(result.error || "Failed to update blog post")
      }
    } catch (error) {
      console.error("Failed to update blog post:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      const result = await deleteBlogPost(post.id)
      if (result.success) {
        toast.success("Blog post deleted successfully!")
        router.push("/control/blog")
        router.refresh()
      } else {
        toast.error(result.error || "Failed to delete blog post")
      }
    } catch (error) {
      console.error("Failed to delete blog post:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <form onSubmit={handleUpdate} className="space-y-8 max-w-5xl mx-auto">
      {/* Header Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/control/blog">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Edit Blog Post</h1>
            <p className="text-muted-foreground text-sm">Refine your insights and publish changes.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Destructive Delete Alert Dialog */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="button" variant="destructive" disabled={loading || deleting}>
                {deleting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="mr-2 h-4 w-4" />
                )}
                Delete Post
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-lg font-bold">Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription className="text-sm text-slate-500 dark:text-slate-400">
                  This action cannot be undone. This will permanently delete the blog post and evict all caches globally.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold"
                >
                  Yes, Delete Post
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button type="button" variant="outline" disabled={loading || deleting} asChild>
            <Link href="/control/blog">Cancel</Link>
          </Button>
          <Button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
            disabled={loading || deleting}
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
        {/* Editor Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-200/60 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Post Content</CardTitle>
              <CardDescription>Refine the main title and body of your blog post.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="font-semibold text-slate-700 dark:text-slate-300">Title</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={post.title}
                  placeholder="e.g. Navigating AI Ethics in the Modern Age"
                  className="text-lg font-medium rounded-xl h-11 border-slate-200 dark:border-slate-800"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="font-semibold text-slate-700 dark:text-slate-300">Body</Label>
                <WysiwygMarkdownEditor value={content} onChange={setContent} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt" className="font-semibold text-slate-700 dark:text-slate-300">Excerpt / Brief Summary</Label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  defaultValue={post.excerpt || ""}
                  placeholder="A short snippet to capture reader attention on search listings..."
                  className="rounded-xl border-slate-200 dark:border-slate-800 min-h-[80px]"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Settings Column */}
        <div className="space-y-6">
          <Card className="border-slate-200/60 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Metadata & Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category" className="font-semibold text-slate-700 dark:text-slate-300">Category</Label>
                <Input
                  id="category"
                  name="category"
                  defaultValue={post.category}
                  placeholder="e.g. Philosophy, Tech, Education"
                  required
                  className="rounded-xl h-10 border-slate-200 dark:border-slate-800"
                />
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label htmlFor="tagsInput" className="font-semibold text-slate-700 dark:text-slate-300">Tags (Comma-separated)</Label>
                <Input
                  id="tagsInput"
                  name="tagsInput"
                  defaultValue={initialTags}
                  placeholder="e.g. logic, ethics, ai"
                  className="rounded-xl h-10 border-slate-200 dark:border-slate-800"
                />
              </div>

              {/* Cover Image URL */}
              <div className="space-y-2">
                <Label htmlFor="coverImage" className="font-semibold text-slate-700 dark:text-slate-300">Cover Image URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="coverImage"
                    name="coverImage"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="https://example.com/cover.jpg"
                    className="rounded-xl h-10 border-slate-200 dark:border-slate-800 flex-1"
                  />
                  <CloudinaryUploadButton onUpload={setCoverImage} className="h-10 rounded-xl px-3" />
                </div>
              </div>

              {/* Publish Toggle */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-900">
                <div className="space-y-0.5">
                  <Label htmlFor="published" className="font-bold text-slate-900 dark:text-slate-50">Published Status</Label>
                  <p className="text-xs text-muted-foreground">Make this post visible publicly.</p>
                </div>
                <Switch
                  id="published"
                  checked={published}
                  onCheckedChange={setPublished}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-emerald-50/50 border-emerald-100 dark:bg-emerald-950/10 dark:border-emerald-900/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-emerald-800 dark:text-emerald-400">
                <Sparkles className="h-4 w-4" /> Editing Tip
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                Changes saved are instantly visible in the public blog listing and reader pages due to dynamic Redis cache eviction.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
