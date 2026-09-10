"use client";
// Change this import location to point to your server actions file instead:
import { updateLecture, deleteLecture } from "@/lib/cms-actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ChevronLeft,
  Save,
  Image as ImageIcon,
  Wand2,
  Loader2,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Lecture } from "@prisma/client";
import { RichTextEditor } from "@/components/editor/rich-text-editor";
import { CloudinaryUploadButton } from "@/components/cloudinary-upload-button";

interface EditLectureFormProps {
  lecture: Lecture;
}

export function EditLectureForm({ lecture }: EditLectureFormProps) {
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [content, setContent] = useState(lecture.body);
  const [coverImage, setCoverImage] = useState(lecture.coverImage || "");
  const router = useRouter();

  async function handleUpdate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const data = {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      body: content,
      category: formData.get("category") as string,
      coverImage: coverImage,
      published: lecture.published, // Preserve existing publish state
    };

    try {
      const result = await updateLecture(lecture.id, data);
      if (result.success) {
        toast.success("Lecture updated successfully!");
        router.push("/control/lectures");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update lecture");
      }
    } catch (error) {
      console.error("Failed to update lecture:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    const confirmDelete = window.confirm(
      "Are you absolutely sure you want to permanently delete this lecture? This action cannot be undone.",
    );
    if (!confirmDelete) return;

    setDeleting(true);
    try {
      const result = await deleteLecture(lecture.id);
      if (result.success) {
        toast.success("Lecture deleted successfully!");
        router.push("/control/lectures");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to delete lecture");
      }
    } catch (error) {
      console.error("Failed to delete lecture:", error);
      toast.error("An unexpected error occurred during deletion");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <form
      onSubmit={handleUpdate}
      className="container mx-auto py-10 space-y-8 max-w-5xl"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/control/lectures">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Edit Lecture
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
              Refine your philosophical insight.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={loading || deleting}
            asChild
          >
            <Link href="/control/lectures">Cancel</Link>
          </Button>
          <Button
            type="submit"
            variant="default" // Using default high-contrast accessible variant setup
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
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Lecture Content</CardTitle>
              <CardDescription>
                The core text and narrative of your piece.
              </CardDescription>
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
                <RichTextEditor value={content} onChange={setContent} />
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone Section */}
          <Card className="border-red-200 bg-red-50/30 dark:border-red-900/30 dark:bg-red-950/10">
            <CardHeader>
              <CardTitle className="text-red-700 dark:text-red-400 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" /> Danger Zone
              </CardTitle>
              <CardDescription className="text-red-600 dark:text-red-500">
                Permanently eliminate this record from the system core.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md font-medium leading-relaxed">
                Once deleted, this piece cannot be retrieved. All cached layout
                links, slugs, and relational database data will immediately be
                purged.
              </p>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={loading || deleting}
                className="shrink-0"
              >
                {deleting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="mr-2 h-4 w-4" />
                )}
                Delete Lecture
              </Button>
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
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
                  >
                    <Wand2 className="h-4 w-4 text-blue-700 dark:text-blue-400" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <Label>Cover Image</Label>
                <div className="flex flex-col gap-3">
                  {coverImage ? (
                    <img
                      src={coverImage}
                      alt="Cover Preview"
                      className="w-full h-auto object-cover rounded-xl border border-slate-200 dark:border-slate-800"
                    />
                  ) : (
                    <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center space-y-2 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                      <ImageIcon className="h-8 w-8 mx-auto text-slate-400" />
                      <p className="text-xs text-slate-500 font-medium">
                        No cover image uploaded
                      </p>
                    </div>
                  )}
                  <CloudinaryUploadButton onUpload={setCoverImage}>
                    Upload Cover Image
                  </CloudinaryUploadButton>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50/50 border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2 text-blue-700 dark:text-blue-400">
                <Wand2 className="h-4 w-4" /> AI Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs leading-relaxed text-blue-600 dark:text-blue-500 font-medium">
                Use AI to refine your philosophical insight or generate new
                variations.
              </p>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="w-full bg-white text-slate-800 border-slate-200 hover:bg-slate-50 dark:bg-slate-950 dark:text-slate-200 dark:border-slate-800 dark:hover:bg-slate-900"
              >
                Analyze Content
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
