import { getLectureBySlug } from "@/lib/server/lectures"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import { format } from "date-fns"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkToc from "remark-toc"
import rehypeRaw from "rehype-raw"
import rehypeSanitize from "rehype-sanitize"
import rehypeSlug from "rehype-slug"
import { Badge } from "@/components/ui/badge"

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
        authors: [lecture.author.name || ""],
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
    <article className="container mx-auto py-10 max-w-4xl">
      <header className="mb-10 text-center">
        <div className="flex justify-center gap-2 mb-4">
          <Badge>{lecture.category}</Badge>
          {tags.map((tag: string) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{lecture.title}</h1>
        <div className="flex justify-center items-center gap-4 text-muted-foreground">
          <span>{format(new Date(lecture.createdAt), "MMMM d, yyyy")}</span>
          <span>•</span>
          <span>{lecture.readingTime} min read</span>
          <span>•</span>
          <span>By {lecture.author.name}</span>
        </div>
      </header>

      <div className="prose dark:prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkToc]}
          rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeSlug]}
        >
          {lecture.body}
        </ReactMarkdown>
      </div>
    </article>
  )
}
