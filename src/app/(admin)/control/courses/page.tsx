import { auth } from "@/auth"
import { Role } from "@prisma/client"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, BookOpen, Edit, Trash2, Globe, Lock } from "lucide-react"
import Link from "next/link"

export default async function AdminCoursesPage() {
  const session = await auth()

  if (session?.user?.role !== Role.ADMIN && session?.user?.role !== Role.INSTRUCTOR) {
    redirect("/login")
  }

  const courses = await prisma.course.findMany({
    include: {
      instructor: { select: { name: true } },
      _count: { select: { enrollments: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-orange-100 rounded-xl">
            <BookOpen className="w-8 h-8 text-orange-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Course Management</h1>
            <p className="text-muted-foreground">
              Create and manage your philosophical curriculum.
            </p>
          </div>
        </div>
        <Button className="bg-orange-600 hover:bg-orange-700 text-white" asChild>
          <Link href="/control/courses/new">
            <Plus className="mr-2 h-4 w-4" /> New Course
          </Link>
        </Button>
      </div>

      <div className="grid gap-6">
        {courses.length === 0 ? (
          <Card className="border-dashed py-12">
            <CardContent className="text-center space-y-4">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto opacity-20" />
              <div className="text-xl font-medium text-muted-foreground">No courses found</div>
              <Button variant="outline" asChild>
                <Link href="/control/courses/new">Create your first course</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          courses.map((course) => (
            <Card key={course.id} className="group hover:border-orange-200 transition-all">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold group-hover:text-orange-600 transition-colors">
                        {course.title}
                      </h3>
                      {course.published ? (
                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200">
                          <Globe className="w-3 h-3 mr-1" /> Published
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-slate-100 text-slate-600">
                          <Lock className="w-3 h-3 mr-1" /> Draft
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        By{" "}
                        <span className="font-medium text-foreground">
                          {course.instructor.name}
                        </span>
                      </span>
                      <span>•</span>
                      <span>{course._count.enrollments} students enrolled</span>
                      <span>•</span>
                      <span className="font-bold text-orange-600">
                        {course.price === 0 ? "Free" : `$${course.price.toFixed(2)}`}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/control/courses/${course.id}`}>
                        <Edit className="w-4 h-4 mr-2" /> Edit
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:bg-destructive/5 border-destructive/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
