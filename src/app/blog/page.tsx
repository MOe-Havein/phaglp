import { prisma, safeDbQuery } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { format } from "date-fns"

// Ensure dynamic rendering to handle database state safely
export const dynamic = "force-dynamic"

export default async function LecturesBlogPage() {
  const result = await safeDbQuery(async () => {
    return prisma.lecture.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      include: { author: true },
    })
  }, [])

  const lectures = result.data || []

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Latest Lectures</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {lectures.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed">
            <p className="text-muted-foreground">No lectures available at the moment.</p>
          </div>
        ) : (
          lectures.map((lecture: any) => (
            <Card key={lecture.id} className="flex flex-col hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary">{lecture.category}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(lecture.createdAt), "MMM d, yyyy")}
                  </span>
                </div>
                <CardTitle>
                  <Link href={`/blog/${lecture.slug}`} className="hover:text-primary">
                    {lecture.title}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-muted-foreground line-clamp-3">
                  {lecture.excerpt || lecture.body.substring(0, 150)}...
                </p>
                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{lecture.readingTime} min read</span>
                  <span>•</span>
                  <span>By {lecture.author?.name || "Anonymous"}</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
