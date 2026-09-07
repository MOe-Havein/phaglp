"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  BrainCircuit,
  ListTodo,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Save,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { ModelSelector, useDefaultAIModel } from "@/components/model-selector";

interface LessonOutline {
  title: string;
  content: string;
  order: number;
}

interface ModuleOutline {
  title: string;
  order: number;
  lessons: LessonOutline[];
}

interface CourseOutline {
  title: string;
  description: string;
  duration: string;
  durationMonths: number;
  modules: ModuleOutline[];
}

export default function AICoursePlannerPage() {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [moduleCount, setModuleCount] = useState(3);
  const [lessonsPerModule, setLessonsPerModule] = useState(3);

  const [isLoading, setIsLoading] = useState(false);
  const [outline, setOutline] = useState<CourseOutline | null>(null);
  const { model: aiModel, setModel: setAiModel } = useDefaultAIModel();

  // Generate Course Outline via AI
  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a study topic");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/courses/ai-planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          description,
          moduleCount,
          lessonsPerModule,
          model: aiModel || undefined,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to generate outline");
      }

      setOutline(result.data);
      toast.success("AI Outline Generated Successfully");
    } catch (error: any) {
      console.error(error);
      toast.error(
        error.message || "An error occurred during outline generation",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Save the customized outline to the database
  const handleSaveCourse = async () => {
    if (!outline) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/courses/save-outline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(outline),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to save course");
      }

      toast.success("Course Created and Saved Successfully");
      router.push(`/control/courses`);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to save customized course outline");
    } finally {
      setIsLoading(false);
    }
  };

  const [writingLessonIdx, setWritingLessonIdx] = useState<{
    mIdx: number;
    lIdx: number;
  } | null>(null);
  const [quizzingLessonIdx, setQuizzingLessonIdx] = useState<{
    mIdx: number;
    lIdx: number;
  } | null>(null);

  // AI-driven Lecture Content Generation
  const handleWriteLecture = async (mIdx: number, lIdx: number) => {
    if (!outline) return;
    const lesson = outline.modules[mIdx]?.lessons[lIdx];
    if (!lesson) return;

    setWritingLessonIdx({ mIdx, lIdx });
    try {
      const res = await fetch("/api/courses/ai-planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "write-lecture",
          courseTitle: outline.title,
          lessonTitle: lesson.title,
          model: aiModel || undefined,
        }),
      });

      const data = await res.json();
      if (data.success && data.content) {
        updateLessonContent(mIdx, lIdx, data.content);
        toast.success(`Lecture content generated for: ${lesson.title}`);
      } else {
        toast.error(data.error || "Failed to generate lecture content");
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
    } finally {
      setWritingLessonIdx(null);
    }
  };

  // AI-driven Quiz Generation
  const handleGenerateQuiz = async (mIdx: number, lIdx: number) => {
    if (!outline) return;
    const lesson = outline.modules[mIdx]?.lessons[lIdx];
    if (!lesson) return;

    setQuizzingLessonIdx({ mIdx, lIdx });
    try {
      const res = await fetch("/api/courses/ai-planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate-quiz",
          courseTitle: outline.title,
          lessonTitle: lesson.title,
          currentContent: lesson.content || "",
          model: aiModel || undefined,
        }),
      });

      const data = await res.json();
      if (data.success && data.content) {
        updateLessonContent(mIdx, lIdx, data.content);
        toast.success(`Interactive quiz generated for: ${lesson.title}`);
      } else {
        toast.error(data.error || "Failed to generate interactive quiz");
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
    } finally {
      setQuizzingLessonIdx(null);
    }
  };

  // Helper: Edit Course/Module/Lesson Fields in state
  const updateCourseTitle = (val: string) => {
    if (!outline) return;
    setOutline({ ...outline!, title: val });
  };

  const updateCourseDescription = (val: string) => {
    if (!outline) return;
    setOutline({ ...outline!, description: val });
  };

  const updateModuleTitle = (mIdx: number, val: string) => {
    if (!outline) return;
    const updatedModules = [...outline!.modules];
    if (updatedModules[mIdx]) {
      updatedModules[mIdx]!.title = val;
    }
    setOutline({ ...outline!, modules: updatedModules });
  };

  const updateLessonTitle = (mIdx: number, lIdx: number, val: string) => {
    if (!outline) return;
    const updatedModules = [...outline!.modules];
    if (updatedModules[mIdx] && updatedModules[mIdx]!.lessons[lIdx]) {
      updatedModules[mIdx]!.lessons[lIdx]!.title = val;
    }
    setOutline({ ...outline!, modules: updatedModules });
  };

  const updateLessonContent = (mIdx: number, lIdx: number, val: string) => {
    if (!outline) return;
    const updatedModules = [...outline!.modules];
    if (updatedModules[mIdx] && updatedModules[mIdx]!.lessons[lIdx]) {
      updatedModules[mIdx]!.lessons[lIdx]!.content = val;
    }
    setOutline({ ...outline!, modules: updatedModules });
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100/40 via-slate-50/50 to-slate-100/40 dark:from-slate-950/40 dark:via-slate-950/20 dark:to-slate-950/40 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Button
            variant="link"
            asChild
            className="p-0 text-muted-foreground font-semibold flex items-center gap-1.5 w-fit"
          >
            <Link href="/control/courses">
              <ArrowLeft className="w-4 h-4" /> Back to Courses
            </Link>
          </Button>
        </div>

        {/* Header Details */}
        <div className="mb-10 space-y-2">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
            <BrainCircuit className="w-9 h-9 text-primary animate-pulse" />
            AI-Driven Curriculum Planner
          </h1>
          <p className="text-muted-foreground text-sm font-semibold">
            Prompt our high-fidelity educational engine to architect structured
            multi-module courses instantly.
          </p>
        </div>

        {/* Input Phase Panel */}
        {!outline && (
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/80 shadow-2xl rounded-3xl p-6 md:p-8">
            <CardHeader className="p-0 mb-6">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" /> Specify Course
                Goal
              </CardTitle>
              <CardDescription className="text-xs">
                Provide academic focus boundaries to help AI shape modules,
                lessons, and textbook descriptions.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                  Course Topic
                </label>
                <input
                  type="text"
                  placeholder="E.g., Stoic Philosophy, Quantum Mechanics, Islamic Golden Age Science..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 font-semibold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                  Target Focus & Goal
                </label>
                <textarea
                  placeholder="Describe target audience depth, conceptual boundaries, or special highlights..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 font-semibold leading-relaxed"
                />
              </div>

              <div className="space-y-2">
                <ModelSelector value={aiModel || ""} onChange={setAiModel} />
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                    Modules Count
                  </label>
                  <select
                    value={moduleCount}
                    onChange={(e) => setModuleCount(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 font-semibold"
                  >
                    {[2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n} Modules
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                    Lessons Per Module
                  </label>
                  <select
                    value={lessonsPerModule}
                    onChange={(e) =>
                      setLessonsPerModule(Number(e.target.value))
                    }
                    className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 font-semibold"
                  >
                    {[2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n} Lessons
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-0 mt-8">
              <Button
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary via-indigo-600 to-purple-600 hover:from-primary/95 hover:to-indigo-650 text-white font-bold rounded-xl py-6 shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Architecting
                    Outline...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 animate-pulse" /> Generate
                    Curriculum Outline <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Interactive Editor Phase Panel */}
        {outline && (
          <div className="space-y-8">
            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/80 shadow-2xl rounded-3xl p-6 md:p-8">
              <CardHeader className="p-0 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <ListTodo className="w-5 h-5 text-indigo-500" /> Review
                    Generated Outline
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Tweak and customize generated fields locally. Press save to
                    dynamically insert modules and lessons.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setOutline(null)}
                    className="rounded-xl font-bold"
                  >
                    Start Over
                  </Button>
                  <Button
                    onClick={handleSaveCourse}
                    disabled={isLoading}
                    className="bg-primary text-white hover:bg-primary/95 rounded-xl font-bold shadow-md shadow-primary/20 flex items-center gap-2"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Save Course
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-0 space-y-6">
                {/* Course Metadata Forms */}
                <div className="p-5 bg-slate-50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">
                      Course Title
                    </label>
                    <input
                      type="text"
                      value={outline.title}
                      onChange={(e) => updateCourseTitle(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">
                      Course Overview
                    </label>
                    <textarea
                      value={outline.description}
                      onChange={(e) => updateCourseDescription(e.target.value)}
                      rows={2}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-semibold leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-xs font-semibold text-muted-foreground">
                      Duration:{" "}
                      <span className="text-foreground font-bold">
                        {outline.duration}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-muted-foreground">
                      Modules:{" "}
                      <span className="text-foreground font-bold">
                        {outline.modules.length}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Modules & Lessons Loop */}
                <div className="space-y-8">
                  {outline.modules.map((mod, mIdx) => (
                    <div
                      key={mIdx}
                      className="space-y-4 relative pl-4 border-l-2 border-indigo-500/30"
                    >
                      {/* Module title form */}
                      <div className="flex items-center gap-2.5">
                        <Badge className="bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20 border-0 font-extrabold text-[10px] py-1 px-2.5 rounded-md">
                          MODULE {mod.order}
                        </Badge>
                        <input
                          type="text"
                          value={mod.title}
                          onChange={(e) =>
                            updateModuleTitle(mIdx, e.target.value)
                          }
                          className="flex-1 bg-transparent border-b border-transparent hover:border-slate-200 focus:border-primary text-lg font-black text-foreground focus:outline-none py-0.5"
                        />
                      </div>

                      {/* Lessons cards within this module */}
                      <div className="grid gap-4 ml-2">
                        {mod.lessons.map((les, lIdx) => (
                          <div
                            key={lIdx}
                            className="bg-slate-50/50 dark:bg-slate-950/20 hover:border-slate-300 dark:hover:border-slate-700 transition-colors border border-slate-200/50 dark:border-slate-800/80 rounded-2xl p-4.5 space-y-3"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-400">
                                Lesson {les.order}:
                              </span>
                              <input
                                type="text"
                                value={les.title}
                                onChange={(e) =>
                                  updateLessonTitle(mIdx, lIdx, e.target.value)
                                }
                                className="flex-1 bg-transparent border-b border-transparent hover:border-slate-200 focus:border-primary text-sm font-bold focus:outline-none"
                              />
                            </div>

                            {/* AI Lesson Writer Buttons */}
                            <div className="flex flex-wrap gap-2 pt-1.5 pb-0.5">
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                disabled={
                                  writingLessonIdx !== null ||
                                  quizzingLessonIdx !== null
                                }
                                onClick={() => handleWriteLecture(mIdx, lIdx)}
                                className="text-[10px] h-7 font-bold flex items-center gap-1 border-primary/20 hover:border-primary/50 text-primary dark:text-blue-450 bg-white dark:bg-slate-900 shadow-sm"
                              >
                                {writingLessonIdx?.mIdx === mIdx &&
                                writingLessonIdx?.lIdx === lIdx ? (
                                  <>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />{" "}
                                    Writing...
                                  </>
                                ) : (
                                  <>
                                    <Sparkles className="w-3.5 h-3.5" /> Write
                                    Lecture
                                  </>
                                )}
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                disabled={
                                  writingLessonIdx !== null ||
                                  quizzingLessonIdx !== null
                                }
                                onClick={() => handleGenerateQuiz(mIdx, lIdx)}
                                className="text-[10px] h-7 font-bold flex items-center gap-1 border-emerald-500/20 hover:border-emerald-500/50 text-emerald-600 dark:text-emerald-450 bg-white dark:bg-slate-900 shadow-sm"
                              >
                                {quizzingLessonIdx?.mIdx === mIdx &&
                                quizzingLessonIdx?.lIdx === lIdx ? (
                                  <>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />{" "}
                                    Quizzing...
                                  </>
                                ) : (
                                  <>
                                    <BookOpen className="w-3.5 h-3.5" /> Add
                                    Quiz
                                  </>
                                )}
                              </Button>
                            </div>

                            <textarea
                              value={les.content || ""}
                              onChange={(e) =>
                                updateLessonContent(mIdx, lIdx, e.target.value)
                              }
                              rows={3}
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-xl px-3 py-2 text-xs font-medium leading-relaxed focus:outline-none"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
