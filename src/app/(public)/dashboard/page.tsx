import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  GraduationCap,
  PlayCircle,
  Trophy,
  Sparkles,
  Calendar,
  BookOpenCheck,
  Camera,
} from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import { auth } from "@/auth"
import { SubscriptionTier } from "@prisma/client"
import prisma from "@/lib/prisma"
import { CustomizeModal } from "@/components/dashboard/customize-modal"
import { format } from "date-fns"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const session = await auth()
  const user = session?.user

  if (!user || !user.id) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 dark:bg-slate-950/20 px-4">
        <Card className="max-w-md w-full border-slate-200 dark:border-slate-800 shadow-xl rounded-3xl p-6 text-center">
          <GraduationCap className="w-16 h-16 text-primary mx-auto mb-4 animate-bounce" />
          <h2 className="text-2xl font-bold mb-2">Access Portal</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Please log in or register to access your customized learning and philosophical research
            dashboard.
          </p>
          <Button
            asChild
            className="w-full bg-primary text-white rounded-xl shadow-md font-semibold"
          >
            <Link href="/login">Log In to Dashboard</Link>
          </Button>
        </Card>
      </div>
    )
  }

  // Fetch dbUser preferences and dynamic platform content
  const [dbUser, allLectures] = await Promise.all([
    prisma.user.findUnique({
      where: { id: user.id },
      select: {
        name: true,
        email: true,
        image: true,
        role: true,
        lecturePreferences: true,
        tier: true,
      },
    }),
    prisma.lecture.findMany({
      where: { published: true },
      include: {
        author: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ])

  const tier = dbUser?.tier || SubscriptionTier.BASIC
  const preferences = dbUser?.lecturePreferences || []

  // Extract unique categories from published lectures
  const availableCategories = Array.from(new Set(allLectures.map((l) => l.category)))

  // Filter lectures based on preference settings
  const customizedLectures =
    preferences.length > 0
      ? allLectures.filter((l) => preferences.includes(l.category))
      : allLectures // Show all if no preference is chosen yet

  const ongoingCourses = [
    {
      id: 1,
      name: "Foundations of Stoicism",
      progress: 65,
      lastLesson: "The Dichotomy of Control",
      instructor: "Marcus Aurelius",
    },
    {
      id: 2,
      name: "Modern Ethics in Technology",
      progress: 30,
      lastLesson: "Algorithmic Bias",
      instructor: "Dr. Jane Doe",
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/20 py-10">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Facebook Style Profile Header */}
        <div className="mb-10 rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 shadow-md">
          {/* Cover Photo */}
          <div className="relative h-48 md:h-64 w-full bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 overflow-hidden">
            {/* Ambient Background Lights */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-1/3 -mb-10 w-72 h-48 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:20px_20px]" />

            {/* Add Cover Photo Label / Decorative Badge */}
            <Badge className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-md text-white border-0 text-[10px] uppercase font-bold tracking-wider py-1 px-3.5 hover:bg-black/60 cursor-default">
              PHAGLP Scholar Campus
            </Badge>
          </div>

          {/* Profile Area */}
          <div className="relative p-6 pt-20 md:pt-6 pb-8 flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
            {/* Facebook Style Overlapping Avatar */}
            <div className="absolute -top-16 md:-top-24 left-1/2 -translate-x-1/2 md:left-8 md:translate-x-0 group">
              <div className="relative rounded-full border-4 border-white dark:border-slate-900 shadow-xl overflow-hidden bg-slate-100 dark:bg-slate-800 transition-transform duration-300 hover:scale-105">
                <Avatar className="w-32 h-32 md:w-36 md:h-36 rounded-full">
                  <AvatarImage
                    src={dbUser?.image || ""}
                    alt={dbUser?.name || "User Avatar"}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-gradient-to-tr from-primary to-indigo-600 text-white text-3xl font-extrabold uppercase flex items-center justify-center">
                    {dbUser?.name
                      ? dbUser.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                      : "US"}
                  </AvatarFallback>
                </Avatar>

                {/* Decorative Camera Icon overlay matching Facebook profile photo edit style */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 cursor-pointer">
                  <Camera className="w-6 h-6 text-white animate-bounce" />
                </div>
              </div>
            </div>

            {/* Profile Info Details (pushed right to make room for Avatar on desktop) */}
            <div className="text-center md:text-left md:pl-44 flex-1">
              <div className="flex flex-col md:flex-row md:items-center gap-2.5 mb-1.5 justify-center md:justify-start">
                <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-2 justify-center md:justify-start">
                  <span>{dbUser?.name || "Academic Scholar"}</span>
                  <span
                    className="inline-flex items-center justify-center w-5 h-5 bg-blue-500 rounded-full text-white shadow-sm"
                    title="Verified Scholar"
                  >
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293l-4 4a1 1 0 01-1.414 0l-2-2a1 1 0 111.414-1.414L9 10.586l3.293-3.293a1 1 0 111.414 1.414z" />
                    </svg>
                  </span>
                </h1>

                {/* User Role Badge */}
                <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-bold py-0.5 px-2.5 rounded-full uppercase w-fit mx-auto md:mx-0">
                  {dbUser?.role || "USER"}
                </Badge>
              </div>

              {/* Email & Tier Status details */}
              <p className="text-muted-foreground text-xs font-medium mb-3 flex flex-wrap items-center justify-center md:justify-start gap-x-2 gap-y-1">
                <span>{dbUser?.email}</span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="flex items-center gap-1">
                  {tier === SubscriptionTier.PRO && (
                    <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white border-0 shadow-sm font-bold text-[9px] py-0 px-2">
                      PRO MEMBER
                    </Badge>
                  )}
                  {tier === SubscriptionTier.ENTERPRISE && (
                    <Badge className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white border-0 shadow-sm font-bold text-[9px] py-0 px-2">
                      ENTERPRISE
                    </Badge>
                  )}
                  {tier === SubscriptionTier.BASIC && (
                    <Badge variant="secondary" className="text-[9px] font-semibold py-0 px-2">
                      BASIC SCHOLAR
                    </Badge>
                  )}
                </span>
              </p>

              <p className="text-muted-foreground text-xs leading-relaxed max-w-xl">
                Continue your intellectual journey through unified philosophical frameworks and
                scientific research.
              </p>
            </div>

            {/* Profile Action Buttons */}
            <div className="flex items-center gap-3 shrink-0 self-center md:self-end mt-4 md:mt-0">
              {/* Customization modal trigger button */}
              <CustomizeModal
                initialPreferences={preferences}
                availableCategories={availableCategories}
              />
              {tier === SubscriptionTier.BASIC && (
                <Button
                  asChild
                  size="sm"
                  className="bg-primary text-white hover:bg-primary/90 rounded-xl shadow-md font-semibold"
                >
                  <Link href="/pricing">Upgrade Platform</Link>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card className="bg-white dark:bg-slate-900 border-slate-200/60 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-shadow rounded-2xl">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Enrolled Courses
              </CardTitle>
              <GraduationCap className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-foreground">4</div>
              <p className="text-xs text-muted-foreground mt-1">
                2 active learning modules this week
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-900 border-slate-200/60 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-shadow rounded-2xl">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Completed Lessons
              </CardTitle>
              <BookOpen className="w-4 h-4 text-indigo-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-foreground">24</div>
              <p className="text-xs text-muted-foreground mt-1">Across all global disciplines</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-900 border-slate-200/60 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-shadow rounded-2xl">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Lecture Feed Filters
              </CardTitle>
              <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-foreground">{preferences.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {preferences.length > 0 ? "Personalized focus active" : "Displaying all categories"}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-900 border-slate-200/60 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-shadow rounded-2xl">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Active Tier
              </CardTitle>
              <Trophy className="w-4 h-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-foreground capitalize">
                {tier.toLowerCase()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Full curriculum accessible</p>
            </CardContent>
          </Card>
        </div>

        {/* Personalized Lecture Focus Feed */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-foreground flex items-center gap-2">
                <Sparkles className="text-primary w-6 h-6 animate-pulse" />
                My Customized Research & Lectures
              </h2>
              <p className="text-muted-foreground text-xs mt-0.5">
                Curated insights automatically aligned with your dashboard focus settings.
              </p>
            </div>
            {preferences.length > 0 && (
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-0 text-xs py-1 px-3 rounded-full font-bold">
                Filtered Feed
              </Badge>
            )}
          </div>

          {customizedLectures.length === 0 ? (
            <Card className="text-center py-16 border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white/30 dark:bg-slate-900/10 rounded-2xl shadow-sm">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <CardTitle className="text-lg font-bold mb-1">No matching lectures found</CardTitle>
              <CardDescription className="max-w-md mx-auto text-xs px-4">
                No lectures are currently published under your customized categories. Try editing
                your focus topics or writing a new one.
              </CardDescription>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {customizedLectures.slice(0, 6).map((lec) => (
                <Card
                  key={lec.id}
                  className="group hover:border-primary/40 hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden flex flex-col justify-between bg-white dark:bg-slate-900 border-slate-200/60 dark:border-slate-800/80"
                >
                  <div>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-primary/10 text-primary border-0 text-[10px] px-2 py-0.5 font-bold">
                          {lec.category}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(lec.createdAt), "MMM d, yyyy")}
                        </span>
                      </div>
                      <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-2">
                        {lec.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                        {lec.excerpt || lec.body.replace(/[#*`]/g, "").substring(0, 120) + "..."}
                      </p>
                    </CardContent>
                  </div>
                  <CardFooter className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      by {lec.author.name || "Anonymous"}
                    </span>
                    <Button
                      asChild
                      size="sm"
                      variant="ghost"
                      className="text-primary hover:text-primary/80 p-0 h-auto font-bold flex items-center gap-1"
                    >
                      <Link href={`/lectures/${lec.slug}`}>Read Lecture →</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Interactive Technological Concepts Hub Banner */}
        <div className="mb-10 bg-gradient-to-r from-indigo-900/90 via-slate-900 to-blue-900/90 dark:from-indigo-950/80 dark:via-slate-950 dark:to-blue-950/80 border border-indigo-500/30 rounded-3xl p-6 relative overflow-hidden shadow-xl shadow-indigo-500/5 group">
          <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-colors duration-500" />
          <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-colors duration-500" />
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <Badge className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold uppercase tracking-wider text-[10px] px-2.5 py-0.5 animate-pulse">
                  Exclusive Hub
                </Badge>
                <span className="text-[10px] text-indigo-400 font-bold flex items-center gap-1">
                  <Sparkles
                    className="w-3.5 h-3.5 animate-spin"
                    style={{ animationDuration: "4s" }}
                  />{" "}
                  Next-Gen Integration
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
                Interactive Competitive Technological Concepts
              </h2>
              <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                Review and interact with our active integrations of Generative AI, Adaptive Pathing,
                Academic Digital Twins, Cryptographic Ledger Verification, VR/AR lectures, and Low
                Connectivity realignments.
              </p>
            </div>
            <Button
              asChild
              className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white hover:from-indigo-600 hover:to-blue-700 font-bold rounded-2xl shadow-lg shadow-indigo-500/20 md:shrink-0 transition-transform active:scale-95 group-hover:translate-x-1 duration-300"
            >
              <Link href="/dashboard/tech-concepts" className="flex items-center gap-2">
                Explore Tech Playground →
              </Link>
            </Button>
          </div>
        </div>

        {/* Ongoing Courses */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-foreground flex items-center gap-2">
              <BookOpenCheck className="text-indigo-500 w-6 h-6" />
              Active Curriculums
            </h2>
            <Button asChild size="sm" variant="outline" className="rounded-xl font-bold">
              <Link href="/courses">Explore Catalog</Link>
            </Button>
          </div>

          <div className="grid gap-6">
            {ongoingCourses.map((course) => (
              <Card
                key={course.id}
                className="hover:shadow-md transition-shadow rounded-2xl bg-white dark:bg-slate-900 border-slate-200/60 dark:border-slate-800/80"
              >
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                      <CardTitle className="flex flex-wrap items-center gap-2 text-xl font-bold text-foreground">
                        {course.name}
                        <Badge
                          variant="secondary"
                          className="bg-primary/5 text-primary hover:bg-primary/10 border-0 font-bold"
                        >
                          {course.progress}% Complete
                        </Badge>
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Instructor: {course.instructor}
                      </CardDescription>
                    </div>
                    <Button
                      size="sm"
                      asChild
                      className="bg-primary text-white rounded-xl shadow-sm shrink-0"
                    >
                      <Link href={`/courses`}>
                        <PlayCircle className="w-4 h-4 mr-2" />
                        Resume Module
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full transition-all duration-500"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  <div className="mt-2.5 text-xs text-muted-foreground flex items-center justify-between">
                    <span>
                      Next topic: <strong>{course.lastLesson}</strong>
                    </span>
                    <span>Self-paced</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
