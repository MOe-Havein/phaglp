"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { ChevronLeft, Save, Loader2, BookOpen } from "lucide-react";
import { createCourseAction } from "@/lib/server/actions/admin/courses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import type { ActionResponseState } from "@/types";

const initialState: ActionResponseState = { success: false };

export function CreateCourseForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    createCourseAction,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      toast.success("Course created successfully!");
      router.push("/control/courses");
      router.refresh();
    } else if (state.error && !state.fieldErrors) {
      toast.error(state.error);
    }
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-8 max-w-5xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            asChild
            aria-label="Back to Courses"
          >
            <Link href="/control/courses">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">New Course</h1>
            <p className="text-muted-foreground text-sm">
              Add a new curriculum offering.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" disabled={isPending} asChild>
            <Link href="/control/courses">Cancel</Link>
          </Button>
          <Button
            type="submit"
            className="bg-violet-600 hover:bg-violet-700 text-white"
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Create Course
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Details</CardTitle>
              <CardDescription>
                Primary details for the new course.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g. Introduction to Philosophy"
                  className="text-lg font-medium"
                  required
                />
                {state.fieldErrors?.title && (
                  <p className="text-xs text-red-500 mt-1">
                    {state.fieldErrors.title[0]}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe the course content, requirements, and outcomes..."
                  className="min-h-[200px] resize-y"
                  required
                />
                {state.fieldErrors?.description && (
                  <p className="text-xs text-red-500 mt-1">
                    {state.fieldErrors.description[0]}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Settings & Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  name="slug"
                  placeholder="e.g. intro-to-philosophy"
                  required
                />
                {state.fieldErrors?.slug && (
                  <p className="text-xs text-red-500 mt-1">
                    {state.fieldErrors.slug[0]}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  required
                />
                {state.fieldErrors?.price && (
                  <p className="text-xs text-red-500 mt-1">
                    {state.fieldErrors.price[0]}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-violet-50 border-violet-100 dark:bg-violet-950/20 dark:border-violet-900/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2 text-violet-700 dark:text-violet-400">
                <BookOpen className="h-4 w-4" /> Draft Mode
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs leading-relaxed text-violet-600 dark:text-violet-500">
                New courses are created as drafts by default. You can publish
                the course and manage its modules once it is saved.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
