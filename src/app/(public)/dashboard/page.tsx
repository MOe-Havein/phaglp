import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, GraduationCap, PlayCircle, Trophy, Sparkles, Calendar, BookOpenCheck } from "lucide-react"
import Link from "next/link"
import { auth } from "@/auth"
import { SubscriptionTier } from "@prisma/client"
import prisma from "@/lib/prisma"
import { CustomizeModal } from "@/components/dashboard/customize-modal"
import { format } from "date-fns"

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
            Please log in or register to access your customized learning and philosophical research dashboard.
          </p>
          <Button asChild className="w-full bg-primary text-white rounded-xl shadow-md font-semibold">
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
      select: { lecturePreferences: true, tier: true },
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
        
        {/* Welcome Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/60 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 backdrop-blur-md shadow-sm">
          <div>
            <h1 className="text-3xl font-extrabold mb-2 text-foreground flex flex-wrap items-center gap-3">
              <span>Welcome back, {user?.name?.split(" ")[0] || "Student"}!</span>
              {tier === SubscriptionTier.PRO && (
                <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white border-0 shadow-sm font-bold">
                  PRO MEMBER
                </Badge>
              )}
              {tier === SubscriptionTier.ENTERPRISE && (
                <Badge className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white border-0 shadow-sm font-bold">
                  ENTERPRISE
                </Badge>
              )}
              {tier === SubscriptionTier.BASIC && (
                <Badge variant="secondary" className="text-xs font-semibold px-2 py-0.5">
                  BASIC SCHOLAR
                </Badge>
              )}
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Continue your intellectual journey through unified philosophical frameworks and scientific research.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
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
              <p className="text-xs text-muted-foreground mt-1">2 active learning modules this week</p>
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
                No lectures are currently published under your customized categories. Try editing your focus topics or writing a new one.
              </CardDescription>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {customizedLectures.slice(0, 6).map((lec) => (
                <Card key={lec.id} className="group hover:border-primary/40 hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden flex flex-col justify-between bg-white dark:bg-slate-900 border-slate-200/60 dark:border-slate-800/80">
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
                    <span className="text-muted-foreground">by {lec.author.name || "Anonymous"}</span>
                    <Button asChild size="sm" variant="ghost" className="text-primary hover:text-primary/80 p-0 h-auto font-bold flex items-center gap-1">
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
                  <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} /> Next-Gen Integration
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
                Interactive Competitive Technological Concepts
              </h2>
              <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                Review and interact with our active integrations of Generative AI, Adaptive Pathing, Academic Digital Twins, Cryptographic Ledger Verification, VR/AR lectures, and Low Connectivity realignments.
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
              <Card key={course.id} className="hover:shadow-md transition-shadow rounded-2xl bg-white dark:bg-slate-900 border-slate-200/60 dark:border-slate-800/80">
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
                    <Button size="sm" asChild className="bg-primary text-white rounded-xl shadow-sm shrink-0">
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
                    <span>Next topic: <strong>{course.lastLesson}</strong></span>
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
