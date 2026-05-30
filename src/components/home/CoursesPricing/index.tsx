"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import {
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
  GraduationCap,
  Award,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Course {
  id: string
  slug: string
  title: string
  description: string
  price: number
  duration: string | null
  courseType: "GP_GENERAL" | "GP_GROUPS" | "GP_SUBJECTS" | "OTHER"
  instructor?: {
    name: string | null
  }
}

// Preset features based on courseType to represent highly professional packages
const getTypeFeatures = (type: string) => {
  switch (type) {
    case "GP_GENERAL":
      return [
        "Full Core Integration & Curriculum",
        "1-on-1 Personal Academic Mentoring",
        "Official Elite GP Certificate",
        "Priority 24/7 Platform Support",
        "Lifetime access to cohort forums",
      ]
    case "GP_GROUPS":
      return [
        "Interactive Peer Discussion Cohorts",
        "Weekly Live Guided Workshops",
        "Detailed Specialist Reviews",
        "Flexible study schedule",
        "Full access to group libraries",
      ]
    case "GP_SUBJECTS":
      return [
        "Syllabus-focused intensive study",
        "Automated Quizzes & Live Feedback",
        "Curated Expert Lectures series",
        "Self-paced learning structure",
        "Downloadable course summaries",
      ]
    default:
      return [
        "Comprehensive philosophical lectures",
        "Direct Instructor Q&A forum",
        "Responsive learning environment",
        "Mobile & offline compatibility",
      ]
  }
}

const getTypeMetadata = (type: string) => {
  switch (type) {
    case "GP_GENERAL":
      return {
        label: "General Program",
        badge: "Most Premium",
        gradient: "from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500",
        icon: GraduationCap,
        popular: true,
      }
    case "GP_GROUPS":
      return {
        label: "Groups Course",
        badge: "Cohort-Based",
        gradient: "from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500",
        icon: BookOpen,
        popular: false,
      }
    case "GP_SUBJECTS":
      return {
        label: "Subjects Course",
        badge: "Focused Mastery",
        gradient: "from-emerald-600 to-teal-600 dark:from-emerald-500 dark:to-teal-500",
        icon: Award,
        popular: false,
      }
    default:
      return {
        label: "Custom Module",
        badge: "Elective Studies",
        gradient: "from-slate-600 to-slate-700 dark:from-slate-500 dark:to-slate-600",
        icon: Sparkles,
        popular: false,
      }
  }
}

export function CoursesPricing() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCourses = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/courses/pricing")
      if (!response.ok) {
        throw new Error(`Failed to load plans: ${response.status} ${response.statusText}`)
      }
      const payload = await response.json()
      if (payload.success) {
        setCourses(payload.data || [])
      } else {
        throw new Error(payload.error || "Could not retrieve pricing plans.")
      }
    } catch (err: any) {
      console.error("Error fetching courses pricing:", err)
      setError(err?.message || "An unexpected error occurred while loading our academy plans.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  if (loading) {
    return <CoursesPricingSkeleton />
  }

  if (error) {
    return (
      <section className="py-24 px-4 bg-background relative overflow-hidden border-t border-border/40">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-center py-16 px-6 bg-rose-50/50 dark:bg-rose-950/10 rounded-3xl border border-rose-200/50 dark:border-rose-900/30 text-center max-w-xl mx-auto shadow-inner">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950 flex items-center justify-center mb-4 text-rose-600 dark:text-rose-400 shadow-sm">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Failed to Load Pricing Plans</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Our academic platform is temporarily unable to retrieve course offerings. Please try
              reloading the catalog.
            </p>
            <Button
              onClick={fetchCourses}
              className="inline-flex items-center gap-2 px-5 py-2 transition-all active:scale-95 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 px-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100/25 via-background to-emerald-100/20 dark:from-indigo-900/15 dark:via-background dark:to-emerald-900/10 relative overflow-hidden border-t border-border/40">
      {/* Dynamic Background Decorations */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-12 w-[700px] h-[700px] bg-indigo-500/15 dark:bg-indigo-500/8 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "12s" }} />
        <div className="absolute bottom-0 left-12 w-[700px] h-[700px] bg-emerald-500/12 dark:bg-emerald-500/6 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/15 border-primary/20 px-3 py-1 font-semibold uppercase tracking-wider text-xs">
            Investment in Intellect
          </Badge>
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight text-foreground text-balance">
            Elite Academic Pricing Plans
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Select an exclusive, high-performance course pathway designed for geniuses, scholars,
            and professionals alike.
          </p>
        </div>

        {/* Empty Catalog State */}
        {courses.length === 0 ? (
          <div className="text-center py-20 bg-card border border-dashed border-border rounded-3xl max-w-xl mx-auto shadow-sm">
            <GraduationCap className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
            <p className="text-foreground text-lg font-semibold">No Dynamic Plans Available Yet</p>
            <p className="text-xs text-muted-foreground mt-1 mb-6">
              Our academic catalog is being prepared. Check back shortly for custom certifications.
            </p>
            <Button asChild variant="outline">
              <Link href="/contact">Enquire About Schedules</Link>
            </Button>
          </div>
        ) : (
          /* Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {courses.map((course) => {
              const meta = getTypeMetadata(course.courseType)
              const features = getTypeFeatures(course.courseType)
              const IconComponent = meta.icon

              return (
                <Card
                  key={course.id}
                  className={`relative flex flex-col h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 rounded-3xl overflow-hidden ${
                    meta.popular
                      ? "border-primary shadow-lg shadow-primary/10 scale-105 z-10 bg-gradient-to-b from-card to-indigo-50/5 dark:to-indigo-950/5"
                      : "border-border bg-card"
                  }`}
                >
                  {/* Top Color Banner */}
                  <div className={`h-2 bg-gradient-to-r ${meta.gradient}`} />

                  {/* Header Badge */}
                  {meta.popular && (
                    <div className="absolute top-4 right-6">
                      <Badge className="bg-primary text-white hover:bg-primary/95 px-3 py-1 font-bold text-[10px] tracking-widest uppercase">
                        {meta.badge}
                      </Badge>
                    </div>
                  )}

                  {!meta.popular && (
                    <div className="absolute top-4 right-6">
                      <Badge
                        variant="outline"
                        className="border-border text-muted-foreground text-[10px] tracking-widest uppercase bg-background/50"
                      >
                        {meta.badge}
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`p-3 rounded-2xl bg-gradient-to-br ${meta.gradient} text-white shadow-md`}
                      >
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                          {meta.label}
                        </span>
                        <CardTitle className="text-xl font-extrabold tracking-tight text-foreground line-clamp-1 mt-0.5">
                          {course.title}
                        </CardTitle>
                      </div>
                    </div>

                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-4xl font-extrabold tracking-tight text-foreground">
                        ${course.price}
                      </span>
                      <span className="text-muted-foreground text-sm font-semibold">/ program</span>
                    </div>

                    <CardDescription className="pt-4 text-sm leading-relaxed line-clamp-3 min-h-[72px] italic">
                      {course.description.replace(/[#*`]/g, "")}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex-grow px-6 pb-6 pt-0">
                    <div className="border-t border-border/60 my-4" />

                    {/* Duration / Schedule Row */}
                    <div className="flex items-center gap-2 mb-6 text-sm text-foreground font-semibold">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>Duration: {course.duration || "Self-paced"}</span>
                    </div>

                    {/* Features list */}
                    <ul className="space-y-3.5">
                      {features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-3 group">
                          <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                          <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                            {feat}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter className="p-6 border-t border-border/40 bg-muted/20 mt-auto">
                    <Button
                      asChild
                      className={`w-full h-11 text-sm font-bold rounded-2xl transition-all duration-300 ${
                        meta.popular
                          ? "bg-primary text-primary-foreground hover:bg-primary/95 shadow-md shadow-primary/10"
                          : "bg-foreground text-background hover:bg-foreground/90"
                      }`}
                    >
                      <Link
                        href={`/courses/${course.slug}`}
                        className="flex items-center justify-center gap-2"
                      >
                        <span>Enroll Now</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

function CoursesPricingSkeleton() {
  return (
    <section className="py-24 px-4 bg-background border-t border-border/40 animate-pulse">
      <div className="container mx-auto max-w-7xl">
        {/* Title skeleton */}
        <div className="text-center mb-16 max-w-3xl mx-auto space-y-4">
          <div className="h-5 bg-muted rounded-full w-24 mx-auto" />
          <div className="h-10 bg-muted rounded-2xl w-3/4 mx-auto" />
          <div className="h-6 bg-muted rounded-lg w-full mx-auto" />
        </div>

        {/* Dynamic cards grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <Card
              key={i}
              className="flex flex-col border border-border bg-card h-[500px] rounded-3xl overflow-hidden"
            >
              <div className="h-2 bg-muted" />
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-muted" />
                  <div className="space-y-2 flex-grow">
                    <div className="h-3 bg-muted rounded w-20" />
                    <div className="h-5 bg-muted rounded w-3/4" />
                  </div>
                </div>
                <div className="h-8 bg-muted rounded w-28 mt-4" />
                <div className="h-14 bg-muted rounded w-full mt-4" />
              </div>
              <div className="px-6 py-4 flex-grow space-y-3">
                <div className="h-4 bg-muted rounded w-1/3 mb-4" />
                <div className="h-3.5 bg-muted rounded w-full" />
                <div className="h-3.5 bg-muted rounded w-full" />
                <div className="h-3.5 bg-muted rounded w-4/5" />
              </div>
              <div className="p-6 mt-auto">
                <div className="h-11 bg-muted rounded-2xl w-full" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
