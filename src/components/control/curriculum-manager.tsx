"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, GripVertical, Edit, Trash2, BookOpen, Video, FileText, Loader2 } from "lucide-react"
import { createModule, createLesson } from "@/lib/cms-actions"
import { toast } from "sonner"

interface Lesson {
  id: string
  title: string
  order: number
  videoUrl: string | null
}

interface Module {
  id: string
  title: string
  order: number
  lessons: Lesson[]
}

interface CurriculumManagerProps {
  courseId: string
  initialModules: Module[]
}

export function CurriculumManager({ courseId, initialModules }: CurriculumManagerProps) {
  const [loading, setLoading] = useState(false)
  const [moduleTitle, setModuleTitle] = useState("")
  const [lessonTitle, setLessonTitle] = useState("")
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null)
  const [isModuleDialogOpen, setIsModuleDialogOpen] = useState(false)
  const [isLessonDialogOpen, setIsLessonDialogOpen] = useState(false)

  async function handleAddModule() {
    if (!moduleTitle.trim()) return
    setLoading(true)
    try {
      const result = await createModule(courseId, moduleTitle)
      if (result.success) {
        toast.success("Module added successfully")
        setModuleTitle("")
        setIsModuleDialogOpen(false)
      } else {
        toast.error(result.error || "Failed to add module")
      }
    } catch (error) {
      console.error("Failed to add module:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  async function handleAddLesson() {
    if (!lessonTitle.trim() || !activeModuleId) return
    setLoading(true)
    try {
      const result = await createLesson(activeModuleId, courseId, lessonTitle)
      if (result.success) {
        toast.success("Lesson added successfully")
        setLessonTitle("")
        setIsLessonDialogOpen(false)
      } else {
        toast.error(result.error || "Failed to add lesson")
      }
    } catch (error) {
      console.error("Failed to add lesson:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Dialog open={isModuleDialogOpen} onOpenChange={setIsModuleDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-white">
              <Plus className="mr-2 h-4 w-4" /> Add Module
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Module</DialogTitle>
              <DialogDescription>
                Create a new section for your course curriculum.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="moduleTitle">Module Title</Label>
              <Input
                id="moduleTitle"
                value={moduleTitle}
                onChange={(e) => setModuleTitle(e.target.value)}
                placeholder="e.g. Introduction to Logic"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModuleDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddModule} disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Module
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-6">
        {initialModules.length === 0 ? (
          <Card className="border-dashed py-20">
            <CardContent className="text-center space-y-4">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto opacity-20" />
              <div className="text-xl font-medium text-muted-foreground">
                Your curriculum is empty
              </div>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                Start building your course by adding your first module.
              </p>
            </CardContent>
          </Card>
        ) : (
          initialModules.map((module) => (
            <Card key={module.id} className="border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between bg-slate-50/50 py-4">
                <div className="flex items-center gap-3">
                  <GripVertical className="h-5 w-5 text-slate-400 cursor-move" />
                  <CardTitle className="text-lg">{module.title}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setActiveModuleId(module.id)
                      setIsLessonDialogOpen(true)
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Lesson
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {module.lessons.length === 0 ? (
                    <div className="p-8 text-center text-sm text-muted-foreground italic">
                      No lessons in this module yet.
                    </div>
                  ) : (
                    module.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between p-4 pl-12 hover:bg-slate-50 group"
                      >
                        <div className="flex items-center gap-3">
                          {lesson.videoUrl ? (
                            <Video className="h-4 w-4 text-blue-500" />
                          ) : (
                            <FileText className="h-4 w-4 text-slate-400" />
                          )}
                          <span className="text-sm font-medium">{lesson.title}</span>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={isLessonDialogOpen} onOpenChange={setIsLessonDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Lesson</DialogTitle>
            <DialogDescription>Add a new lesson to your module.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="lessonTitle">Lesson Title</Label>
            <Input
              id="lessonTitle"
              value={lessonTitle}
              onChange={(e) => setLessonTitle(e.target.value)}
              placeholder="e.g. The Law of Non-Contradiction"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLessonDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddLesson} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Lesson
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
