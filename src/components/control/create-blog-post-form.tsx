"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { ChevronLeft, Save, Loader2, Sparkles } from "lucide-react";
import { createBlogPost } from "@/features/blog/actions/blog-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { WysiwygMarkdownEditor } from "@/components/editor/wysiwyg-markdown-editor";
import { CloudinaryUploadButton } from "@/components/cloudinary-upload-button";

export function CreateBlogPostForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);
  const [coverImage, setCoverImage] = useState("");

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const excerpt = formData.get("excerpt") as string;
    const tagsInput = formData.get("tagsInput") as string;

    // Parse comma-separated tags into array
    const tags = tagsInput
      ? tagsInput
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t.length > 0)
      : [];

    const data = {
      title,
      body: content,
      category: category || "General",
      excerpt: excerpt || undefined,
      coverImage: coverImage || undefined,
      tags,
      published,
    };

    try {
      const result = await createBlogPost(data);
      if (result.success) {
        toast.success("Blog post created successfully!");
        router.push("/control/blog");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to create blog post");
      }
    } catch (error) {
      console.error("Failed to create blog post:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleCreate} className="space-y-8 max-w-5xl mx-auto">
      {/* Header Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/control/blog">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              New Blog Post
            </h1>
            <p className="text-muted-foreground text-sm">
              Draft a new insight for the publication portal.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" disabled={loading} asChild>
            <Link href="/control/blog">Cancel</Link>
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
            Publish Post
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Editor Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-200/60 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Post Content</CardTitle>
              <CardDescription>
                Compose the main title and text body of your blog post.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="title"
                  className="font-semibold text-slate-700 dark:text-slate-300"
                >
                  Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g. Navigating AI Ethics in the Modern Age"
                  className="text-lg font-medium rounded-xl h-11 border-slate-200 dark:border-slate-800"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="font-semibold text-slate-700 dark:text-slate-300">
                  Body
                </Label>
                <WysiwygMarkdownEditor value={content} onChange={setContent} />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="excerpt"
                  className="font-semibold text-slate-700 dark:text-slate-300"
                >
                  Excerpt / Brief Summary
                </Label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
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
                <Label
                  htmlFor="category"
                  className="font-semibold text-slate-700 dark:text-slate-300"
                >
                  Category
                </Label>
                <Input
                  id="category"
                  name="category"
                  placeholder="e.g. Philosophy, Tech, Education"
                  required
                  className="rounded-xl h-10 border-slate-200 dark:border-slate-800"
                />
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label
                  htmlFor="tagsInput"
                  className="font-semibold text-slate-700 dark:text-slate-300"
                >
                  Tags (Comma-separated)
                </Label>
                <Input
                  id="tagsInput"
                  name="tagsInput"
                  placeholder="e.g. logic, ethics, ai"
                  className="rounded-xl h-10 border-slate-200 dark:border-slate-800"
                />
              </div>

              {/* Cover Image URL */}
              <div className="space-y-2">
                <Label
                  htmlFor="coverImage"
                  className="font-semibold text-slate-700 dark:text-slate-300"
                >
                  Cover Image URL
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="coverImage"
                    name="coverImage"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="https://example.com/cover.jpg"
                    className="rounded-xl h-10 border-slate-200 dark:border-slate-800 flex-1"
                  />
                  <CloudinaryUploadButton
                    onUpload={setCoverImage}
                    className="h-10 rounded-xl px-3"
                  />
                </div>
              </div>

              {/* Publish Toggle */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-900">
                <div className="space-y-0.5">
                  <Label
                    htmlFor="published"
                    className="font-bold text-slate-900 dark:text-slate-50"
                  >
                    Publish Directly
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Make this post immediately public.
                  </p>
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
                <Sparkles className="h-4 w-4" /> Drafting Tip
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                You can write complete tables, lists, and formatted HTML in the
                rich text area. Add links for in-article FoxyCart checkout
                directly from the link toolbar.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
