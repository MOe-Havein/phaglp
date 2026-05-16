import prisma, { safeDbQuery } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Metadata } from "next"

// Ensure dynamic rendering to handle database state safely at runtime
export const dynamic = "force-dynamic"

interface CustomPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: CustomPageProps): Promise<Metadata> {
  try {
    const { slug } = await params
    const result = await safeDbQuery(async () => {
      return prisma.page.findUnique({
        where: { slug, published: true },
      })
    })

    if (!result.success || !result.data) return {}

    return {
      title: result.data.seoTitle || result.data.title,
      description: result.data.metaDescription,
    }
  } catch (error) {
    console.error("Metadata generation failed:", error)
    return {
      title: "Page",
    }
  }
}

import { MarkdownViewer } from "@/components/editor/markdown-viewer"

export default async function CustomPage({ params }: CustomPageProps) {
  const { slug } = await params

  const result = await safeDbQuery(async () => {
    return prisma.page.findUnique({
      where: {
        slug,
        published: true,
      },
    })
  })

  if (!result.success || !result.data) {
    notFound()
  }

  const page = result.data

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <header className="mb-12 border-b pb-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {page.title}
        </h1>
      </header>

      <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-p:leading-relaxed prose-a:text-blue-600 dark:prose-a:text-blue-400">
        <MarkdownViewer value={page.content} />
      </div>

      <footer className="mt-16 pt-8 border-t text-sm text-muted-foreground italic">
        Last updated: {new Date(page.updatedAt).toLocaleDateString()}
      </footer>
    </div>
  )
}
