import { auth } from "@/auth"
import { Role } from "@prisma/client"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, FileText, Edit, Trash2, Calendar } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

export default async function AdminLecturesPage() {
  const session = await auth()

  if (session?.user?.role !== Role.ADMIN && session?.user?.role !== Role.INSTRUCTOR) {
    redirect("/login")
  }

  const lectures = await prisma.lecture.findMany({
    include: {
      author: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-100 rounded-xl">
            <FileText className="w-8 h-8 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Lecture CMS</h1>
            <p className="text-muted-foreground">
              Manage your philosophical blog and research updates.
            </p>
          </div>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" asChild>
          <Link href="/control/lectures/new">
            <Plus className="mr-2 h-4 w-4" /> Write Lecture
          </Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {lectures.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed rounded-2xl">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground">No lectures found in the repository.</p>
          </div>
        ) : (
          lectures.map((lecture) => (
            <div
              key={lecture.id}
              className="flex items-center justify-between p-4 bg-background border rounded-xl hover:shadow-sm transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="flex flex-col">
                  <h3 className="font-bold group-hover:text-emerald-600 transition-colors">
                    {lecture.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />{" "}
                      {format(new Date(lecture.createdAt), "MMM d, yyyy")}
                    </span>
                    <span>•</span>
                    <Badge
                      variant="outline"
                      className="text-[10px] py-0 px-1 border-emerald-100 text-emerald-700"
                    >
                      {lecture.category}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/control/lectures/${lecture.id}`}>
                    <Edit className="w-4 h-4" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
