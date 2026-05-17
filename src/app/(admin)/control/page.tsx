import { auth } from "@/auth"
import { Role } from "@prisma/client"
import { redirect } from "next/navigation"
import { getControlAnalytics, getRecentAnalytics } from "@/lib/control-actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RecentAnalytics } from "@/components/control/recent-analytics"
import {
  Users,
  BookOpen,
  FileText,
  ShieldCheck,
  ArrowUpRight,
  LayoutDashboard,
  BarChart3,
} from "lucide-react"
import Link from "next/link"

export default async function ControlCenter() {
  const session = await auth()

  if (session?.user?.role !== Role.ADMIN) {
    redirect("/login")
  }

  // Parallel data fetching for performance
  const [statsResult, recentResult] = await Promise.all([
    getControlAnalytics(),
    getRecentAnalytics(5),
  ])

  const stats =
    statsResult.success && "data" in statsResult && statsResult.data
      ? statsResult.data
      : { userCount: 0, courseCount: 0, lectureCount: 0 }

  const recentAnalytics =
    recentResult.success && "data" in recentResult && recentResult.data ? recentResult.data : []

  const modules = [
    {
      name: "Settings",
      icon: ShieldCheck,
      href: "/control/settings",
      color: "bg-blue-100 text-blue-600",
      count: "Global",
    },
    {
      name: "Users",
      icon: Users,
      href: "/control/users",
      color: "bg-purple-100 text-purple-600",
      count: stats.userCount,
    },
    {
      name: "Courses",
      icon: BookOpen,
      href: "/control/courses",
      color: "bg-orange-100 text-orange-600",
      count: stats.courseCount,
    },
    {
      name: "Lectures",
      icon: FileText,
      href: "/control/lectures",
      color: "bg-emerald-100 text-emerald-600",
      count: stats.lectureCount,
    },
  ]

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex items-center justify-between border-b pb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-xl">
            <LayoutDashboard className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Control Center</h1>
            <p className="text-muted-foreground">
              Welcome back, {session.user.name}. Here is what is happening today.
            </p>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {modules.map((m) => (
          <Link key={m.name} href={m.href} className="group">
            <Card className="hover:border-primary/50 transition-all hover:shadow-md h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{m.name}</CardTitle>
                <div className={`p-2 rounded-lg ${m.color}`}>
                  <m.icon className="w-4 h-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{m.count}</div>
                <div className="flex items-center text-xs text-muted-foreground mt-1 group-hover:text-primary">
                  Manage Module <ArrowUpRight className="ml-1 w-3 h-3" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <RecentAnalytics data={recentAnalytics} />

        <Card className="border-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Platform Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Next.js Framework</span>
                <span className="font-mono text-emerald-600">v15.5.9 (Stable)</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Database Status</span>
                <span className="font-mono text-emerald-600">Connected (Neon/Postgres)</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Cache Status</span>
                <span className="font-mono text-emerald-600">Next.js Built-in</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
