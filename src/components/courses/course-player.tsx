"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Play, 
  BookOpen, 
  Award, 
  Trophy, 
  ArrowLeft,
  Printer
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { toggleLessonProgress } from "@/lib/certificate-actions"

interface Lesson {
  id: string
  title: string
  content: string | null
  videoUrl: string | null
  order: number
}

interface Module {
  id: string
  title: string
  order: number
  lessons: Lesson[]
}

interface CoursePlayerProps {
  userId: string
  course: {
    id: string
    title: string
    slug: string
  }
  modules: Module[]
  initialCompletedLessonIds: string[]
  initialPercent: number
}

export function CoursePlayer({
  userId,
  course,
  modules,
  initialCompletedLessonIds,
  initialPercent,
}: CoursePlayerProps) {
  const [completedIds, setCompletedIds] = useState<string[]>(initialCompletedLessonIds)
  const [percent, setPercent] = useState(initialPercent)
  
  // Find the first lesson to play as default
  const allLessons = modules.flatMap((m) => m.lessons)
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(
    allLessons[0] || null
  )

  const [togglingId, setTogglingId] = useState<string | null>(null)
  
  // Celebration state
  const [showCelebration, setShowCelebration] = useState(false)
  const [newCertificateCode, setNewCertificateCode] = useState("")

  const handleToggle = async (lessonId: string) => {
    setTogglingId(lessonId)
    try {
      const result = await toggleLessonProgress(userId, lessonId, course.id)
      
      if (result.success) {
        if (result.completed) {
          setCompletedIds((prev) => [...prev, lessonId])
          toast.success("Lesson marked as completed!")
        } else {
          setCompletedIds((prev) => prev.filter((id) => id !== lessonId))
          toast.info("Lesson marked as incomplete")
        }

        setPercent(result.progressPercent ?? 0)

        // Award celebration
        if (result.certificateIssued && result.certificateCode) {
          setNewCertificateCode(result.certificateCode)
          setShowCelebration(true)
        }
      } else {
        toast.error(result.error || "Failed to update lesson progress")
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred")
    } finally {
      setTogglingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Dynamic Header Dashboard */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-xl px-6 py-4 sticky top-0 z-40 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-slate-800 text-slate-400 hover:text-slate-100"
            asChild
          >
            <Link href={`/courses/${course.slug}`}>
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="font-extrabold text-base md:text-lg line-clamp-1">{course.title}</h1>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Scholar Classroom Player</p>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="flex items-center gap-4 w-full md:max-w-md shrink-0">
          <div className="flex-1">
            <div className="flex justify-between text-xs font-bold mb-1.5">
              <span className="text-slate-400">Class Progress</span>
              <span className="text-primary-foreground">{percent}% Complete</span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden shadow-inner">
              <div
                className="bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 h-full rounded-full transition-all duration-700 animate-pulse"
                style={{ width: `${percent}%`, animationDuration: "8s" }}
              />
            </div>
          </div>
          {percent === 100 && (
            <Badge className="bg-emerald-550/20 text-emerald-450 border border-emerald-500/30 font-black py-1 px-3 flex items-center gap-1.5 animate-bounce">
              <Award className="w-4 h-4 text-emerald-450" />
              Certified
            </Badge>
          )}
        </div>
      </header>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Side: Modular Sidebar Course Index */}
        <aside className="w-full lg:w-96 border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-900/30 overflow-y-auto max-h-[40vh] lg:max-h-none flex-shrink-0">
          <div className="p-4 border-b border-slate-800 bg-slate-900/50">
            <h2 className="font-bold text-sm uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              Academy Curriculum
            </h2>
          </div>
          <div className="divide-y divide-slate-850">
            {modules.map((module, mIdx) => (
              <div key={module.id} className="p-4">
                <h3 className="font-extrabold text-xs text-indigo-400 uppercase tracking-wider mb-3">
                  Module {mIdx + 1}: {module.title}
                </h3>
                <div className="space-y-1">
                  {module.lessons.map((lesson) => {
                    const isCompleted = completedIds.includes(lesson.id)
                    const isActive = activeLesson?.id === lesson.id
                    
                    return (
                      <div
                        key={lesson.id}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-200 ${
                          isActive
                            ? "bg-indigo-950/40 border-indigo-500/55 text-indigo-250 shadow-md"
                            : "border-transparent hover:bg-slate-900/60 text-slate-350"
                        }`}
                      >
                        <button
                          onClick={() => setActiveLesson(lesson)}
                          className="flex-1 text-left flex items-start gap-2.5"
                        >
                          <Play className={`w-4 h-4 mt-0.5 shrink-0 ${isActive ? "text-indigo-450 fill-indigo-450/20" : "text-slate-500"}`} />
                          <span className="text-xs font-bold leading-tight">{lesson.title}</span>
                        </button>

                        <div className="pl-3">
                          <Checkbox
                            checked={isCompleted}
                            onCheckedChange={() => handleToggle(lesson.id)}
                            disabled={togglingId === lesson.id}
                            className="w-4.5 h-4.5 rounded-md border-slate-700 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Right Side: High-End Lesson Viewing Sandbox */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto flex flex-col justify-between bg-slate-950">
          {activeLesson ? (
            <div className="max-w-4xl w-full mx-auto space-y-8">
              {/* Lecture Title & Type Metadata */}
              <div className="space-y-3">
                <Badge className="bg-primary/20 text-blue-450 border border-primary/30 font-bold uppercase tracking-widest text-[9px] px-3 py-1">
                  Classroom Session {activeLesson.order}
                </Badge>
                <h2 className="text-2xl md:text-3xl font-black text-white font-serif">{activeLesson.title}</h2>
              </div>

              {/* Lecture Mock Video Player Container */}
              <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl flex items-center justify-center group">
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900/60 to-slate-950 pointer-events-none" />
                
                {/* Visual Audio Waveform Mock Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:32px_32px]" />
                
                <div className="z-10 text-center space-y-4">
                  <div className="w-16 h-16 bg-white/10 dark:bg-white/5 rounded-full flex items-center justify-center border border-white/20 shadow-xl group-hover:scale-105 transition-transform duration-300">
                    <Play className="w-8 h-8 text-primary-foreground fill-white/10" />
                  </div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Interactive Video Lab Session</p>
                </div>
              </div>

              {/* Lecture Lesson Body Content Frame */}
              <Card className="bg-slate-900/40 border-slate-850 shadow-xl rounded-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-extrabold uppercase tracking-widest text-slate-400">Lecture Reading Outline</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-invert prose-slate max-w-none text-slate-300 text-sm md:text-base leading-relaxed font-serif p-6 bg-slate-950/20 rounded-xl">
                  {activeLesson.content ? (
                    <div className="whitespace-pre-line">{activeLesson.content}</div>
                  ) : (
                    <div className="italic text-slate-500">No reading content added for this lesson session. Complete this lab using the video play resources.</div>
                  )}
                </CardContent>
              </Card>

              {/* Next Lesson Action Panel */}
              <div className="pt-6 border-t border-slate-850 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="mark-active"
                    checked={completedIds.includes(activeLesson.id)}
                    onCheckedChange={() => handleToggle(activeLesson.id)}
                    disabled={togglingId === activeLesson.id}
                    className="w-5 h-5 rounded-md border-slate-700 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                  />
                  <label htmlFor="mark-active" className="text-xs md:text-sm font-extrabold text-slate-350 cursor-pointer select-none hover:text-white transition-colors">
                    Mark this classroom session as Completed
                  </label>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-center p-8">
              <div>
                <BookOpen className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                <h3 className="font-bold text-lg">No Lessons Available</h3>
                <p className="text-sm text-slate-500 max-w-xs mt-1">This course does not have any modules or lessons uploaded yet.</p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Confetti Celebration Modal */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <Card className="max-w-lg w-full border-amber-500/40 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 p-8 text-center rounded-3xl shadow-2xl relative overflow-hidden group">
            {/* Ambient Background Glows */}
            <div className="absolute -top-16 left-1/4 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-16 right-1/4 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl" />
            
            <div className="relative space-y-6 z-10">
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-gradient-to-tr from-amber-400 to-yellow-600 rounded-full flex items-center justify-center shadow-xl border-4 border-slate-900 animate-bounce">
                  <Trophy className="w-10 h-10 text-white" />
                </div>
              </div>

              <div className="space-y-2">
                <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30 font-black uppercase tracking-widest text-[10px] px-3 py-1">
                  100% Course Completed
                </Badge>
                <h2 className="text-3xl font-black text-white font-serif leading-tight">
                  Congratulations, Scholar!
                </h2>
                <p className="text-sm text-slate-400 leading-relaxed font-serif italic max-w-sm mx-auto">
                  You have successfully completed every critical module and discourse requirement for:
                </p>
                <p className="font-extrabold text-indigo-400 font-sans text-lg mt-2">
                  {course.title}
                </p>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-1 max-w-xs mx-auto">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Official Gold Seal Code</span>
                <p className="font-mono text-sm font-bold text-amber-400">{newCertificateCode}</p>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <Button
                  asChild
                  className="bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-slate-950 font-black rounded-xl shadow-lg shadow-amber-500/15 py-6 flex items-center gap-2"
                >
                  <Link href={`/certificates/${newCertificateCode}`}>
                    <Printer className="w-4.5 h-4.5" />
                    Verify & Print Certificate
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setShowCelebration(false)}
                  className="text-slate-400 hover:text-slate-100 hover:bg-slate-900"
                >
                  Continue Reviewing Lessons
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
