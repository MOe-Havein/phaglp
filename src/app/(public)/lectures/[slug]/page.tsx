import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"


import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, User } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { RichTextViewer } from "@/components/editor/rich-text-viewer"

export default async function LectureDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const lecture = await prisma.lecture.findUnique({
    where: { slug },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  })

  if (!lecture) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/lectures"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-blue-600 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Lectures
        </Link>

        <header className="mb-12">
          <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100 border-none px-3">
            {lecture.category}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{lecture.title}</h1>

          <div className="flex items-center gap-6 text-muted-foreground border-y py-4">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <span className="font-medium text-foreground">
                {lecture.author.name || "Anonymous"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{format(new Date(lecture.createdAt), "MMMM d, yyyy")}</span>
            </div>
          </div>
        </header>

        <div className="prose prose-blue max-w-none prose-headings:font-bold prose-p:text-slate-700 prose-p:leading-relaxed">
          <RichTextViewer html={lecture.body} />
        </div>

        <div className="mt-12 pt-8 border-t">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">
            Related Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {lecture.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                #{tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
