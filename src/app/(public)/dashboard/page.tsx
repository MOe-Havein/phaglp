import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, GraduationCap, History, PlayCircle, Trophy, Sparkles } from "lucide-react"
import Link from "next/link"
import { auth } from "@/auth"
import { SubscriptionTier } from "@prisma/client"

export default async function DashboardPage() {
  const session = await auth()
  const user = session?.user
  const tier = user?.tier || SubscriptionTier.BASIC

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
    <div className="min-h-screen bg-secondary/30">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-foreground flex items-center gap-3">
              Welcome back, {user?.name?.split(" ")[0] || "Student"}!
              {tier === SubscriptionTier.PRO && (
                <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white border-0">
                  PRO
                </Badge>
              )}
              {tier === SubscriptionTier.ENTERPRISE && (
                <Badge className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white border-0">
                  ENTERPRISE
                </Badge>
              )}
              {tier === SubscriptionTier.BASIC && (
                <Badge variant="secondary" className="text-xs">
                  BASIC
                </Badge>
              )}
            </h1>
            <p className="text-muted-foreground">
              Continue your journey through wisdom and science.
            </p>
          </div>

          {tier === SubscriptionTier.BASIC && (
            <div className="bg-gradient-to-r from-primary/10 to-blue-600/10 border border-blue-600/20 rounded-lg p-4 flex items-center gap-4 max-w-sm">
              <div className="bg-primary p-2 rounded-full text-white shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Ready for more?</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Unlock premium courses and AI tools.
                </p>
              </div>
              <Button
                asChild
                size="sm"
                className="ml-auto shrink-0 bg-primary text-white hover:bg-primary/90"
              >
                <Link href="/pricing">Upgrade</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-background shadow-sm">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Enrolled Courses
              </CardTitle>
              <GraduationCap className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">4</div>
              <p className="text-xs text-muted-foreground">2 active this week</p>
            </CardContent>
          </Card>
          <Card className="bg-background shadow-sm">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completed Lessons
              </CardTitle>
              <BookOpen className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">24</div>
              <p className="text-xs text-muted-foreground">Across all modules</p>
            </CardContent>
          </Card>
          <Card className="bg-background shadow-sm">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Study Hours
              </CardTitle>
              <History className="w-4 h-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">12.5h</div>
              <p className="text-xs text-muted-foreground">+2.5h since yesterday</p>
            </CardContent>
          </Card>
          <Card className="bg-background shadow-sm">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Achievements
              </CardTitle>
              <Trophy className="w-4 h-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">8</div>
              <p className="text-xs text-muted-foreground">Top 10% this month</p>
            </CardContent>
          </Card>
        </div>

        {/* Ongoing Courses */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">My Courses</h2>
            <Button asChild className="bg-primary text-white hover:bg-primary/90">
              <Link href="/courses">Explore More</Link>
            </Button>
          </div>

          <div className="grid gap-6">
            {ongoingCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-md transition-shadow bg-background">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-foreground">
                        {course.name}
                        <Badge
                          variant="secondary"
                          className="bg-accent/10 text-accent hover:bg-accent/20"
                        >
                          {course.progress}% Complete
                        </Badge>
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Instructor: {course.instructor}
                      </CardDescription>
                    </div>
                    <Button size="sm" asChild className="bg-primary text-white">
                      <Link href={`/courses/${course.id}`}>
                        <PlayCircle className="w-4 h-4 mr-2" />
                        Continue Lesson
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full transition-all duration-500"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    Next: {course.lastLesson}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions / Recent Activity */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-background">
            <CardHeader>
              <CardTitle className="text-foreground">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <p className="text-sm">Completed "The Allegory of the Cave" lesson</p>
                  <span className="text-xs text-muted-foreground ml-auto">2h ago</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-600" />
                  <p className="text-sm">Started "Bioethics in Medicine"</p>
                  <span className="text-xs text-muted-foreground ml-auto">Yesterday</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  <p className="text-sm">Earned badge: "Morning Thinker"</p>
                  <span className="text-xs text-muted-foreground ml-auto">2 days ago</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background">
            <CardHeader>
              <CardTitle className="text-foreground">Recommended for You</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Link
                  href="/lectures/1"
                  className="block hover:bg-secondary/20 p-2 rounded transition-colors"
                >
                  <h4 className="font-medium text-sm">
                    Beyond Good and Evil - A Modern Commentary
                  </h4>
                  <p className="text-xs text-muted-foreground">Lecture • 12 min read</p>
                </Link>
                <Link
                  href="/courses/3"
                  className="block hover:bg-secondary/20 p-2 rounded transition-colors"
                >
                  <h4 className="font-medium text-sm">Introduction to Hegelian Dialectics</h4>
                  <p className="text-xs text-muted-foreground">Course • 8 Modules</p>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
