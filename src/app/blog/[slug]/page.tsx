import { getLectureBySlug } from "@/lib/server/lectures"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, User, Clock } from "lucide-react"
import Link from "next/link"
import { RichTextViewer } from "@/components/editor/rich-text-viewer"
import { FoxyLoader } from "@/components/foxy/foxy-loader"

// Ensure dynamic rendering to handle database state safely at runtime
export const dynamic = "force-dynamic"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { slug } = await params
    const lecture = await getLectureBySlug(slug)
    if (!lecture) return {}

    return {
      title: lecture.title,
      description: lecture.excerpt,
      openGraph: {
        title: lecture.title,
        description: lecture.excerpt || undefined,
        type: "article",
        publishedTime:
          typeof lecture.createdAt === "string"
            ? lecture.createdAt
            : lecture.createdAt.toISOString(),
        modifiedTime:
          typeof lecture.updatedAt === "string"
            ? lecture.updatedAt
            : lecture.updatedAt.toISOString(),
        authors: [lecture.author?.name || ""],
        tags: (lecture.tags as string[]) || undefined,
      },
    }
  } catch (error) {
    console.error("Blog metadata generation failed:", error)
    return {
      title: "Lecture",
    }
  }
}

export default async function LecturePage({ params }: PageProps) {
  const { slug } = await params

  let lecture
  try {
    lecture = await getLectureBySlug(slug)
  } catch (error) {
    console.error("Failed to fetch lecture:", error)
  }

  if (!lecture) {
    notFound()
  }

  const tags = (lecture.tags as string[]) || []

  return (
    <div className="container mx-auto px-4 py-12 relative min-h-screen">
      {/* Background Radial Light Effect */}
      <div className="absolute top-10 left-1/4 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl opacity-40 dark:opacity-20 pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl opacity-40 dark:opacity-20 pointer-events-none" />

      <div className="max-w-3xl mx-auto relative">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Blog Listing
        </Link>

        <article>
          <header className="mb-10">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className="bg-primary/10 hover:bg-primary/20 text-primary border-none px-3 font-semibold">
                {lecture.category}
              </Badge>
              {tags.map((tag: string) => (
                <Badge key={tag} variant="outline" className="text-slate-500 border-slate-200 dark:border-slate-800">
                  #{tag}
                </Badge>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight tracking-tight text-slate-900 dark:text-slate-50">
              {lecture.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground border-y border-slate-100 dark:border-slate-900 py-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {lecture.author?.name || "Anonymous"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{format(new Date(lecture.createdAt), "MMMM d, yyyy")}</span>
              </div>
              {lecture.readingTime && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{lecture.readingTime} min read</span>
                </div>
              )}
            </div>
          </header>

          {/* Cover Image */}
          {lecture.coverImage && (
            <div className="mb-10 rounded-2xl overflow-hidden shadow-md max-h-96 w-full">
              <img
                src={lecture.coverImage}
                alt={lecture.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Body Content */}
          <div className="prose prose-blue dark:prose-invert max-w-none">
            <RichTextViewer html={lecture.body} />
          </div>
        </article>

        {/* Global FoxyLoader ensures FoxyCart intercept is fully active */}
        <FoxyLoader />
      </div>
    </div>
  )
}

