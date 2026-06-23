import prisma, { safeDbQuery } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";


import nextDynamic from "next/dynamic";

const MarkdownViewer = nextDynamic(
  () => import("@/components/editor/markdown-viewer").then((mod) => mod.MarkdownViewer),
  { ssr: true }
);

// Ensure dynamic rendering to handle database state safely at runtime
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const getBlogPostBySlug = async (slug: string) => {
  return (
    async () => {
      const result = await safeDbQuery(async () => {
        return prisma.post.findUnique({
          where: { slug },
          include: {
            author: {
              select: {
                name: true,
              },
            },
          },
        });
      });
      return result.data;
    },
    [`blog-post-${slug}`],
    { tags: ["blog-posts"], revalidate: 300 },
  )();
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Blog post not found",
      description: "The requested blog entry could not be located.",
    };
  }

  return {
    title: post.title,
    description: post.excerpt ?? post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? post.title,
      type: "article",
      publishedTime:
        typeof post.createdAt === "string"
          ? post.createdAt
          : post.createdAt.toISOString(),
      modifiedTime:
        typeof post.updatedAt === "string"
          ? post.updatedAt
          : post.updatedAt.toISOString(),
      authors: [post.author?.name ?? ""],
      tags: (post.tags as string[]) ?? undefined,
    },
  };
}

export default async function BlogPostDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let post;
  try {
    post = await getBlogPostBySlug(slug);
  } catch (error) {
    console.error("Failed to fetch blog post:", error);
  }

  if (!post) {
    notFound();
  }

  const tags = Array.isArray(post.tags) ? (post.tags as string[]) : [];

  return (
    <div className="container mx-auto px-4 py-12 relative min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Subtle Ambient Background Light Radial Blurs */}
      <div className="absolute top-10 left-1/4 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl opacity-40 dark:opacity-20 pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl opacity-40 dark:opacity-20 pointer-events-none" />

      <div className="max-w-3xl mx-auto relative">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-blue-400 mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Blog Listing
        </Link>

        <article>
          <header className="mb-10">
            <div className="flex flex-wrap gap-2 mb-4">
              {/* Premium High Contrast Primary Accent Badges */}
              <Badge className="bg-blue-50 border border-blue-200 text-blue-800 dark:bg-blue-950/40 dark:border-blue-900/50 dark:text-blue-400 px-3 py-0.5 rounded-md text-xs font-bold">
                {post.category}
              </Badge>
              {tags.map((tag: string) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-slate-600 border-slate-300 bg-slate-50 dark:text-slate-400 dark:border-slate-800 dark:bg-slate-900/50 font-medium px-2.5 py-0.5 rounded-md"
                >
                  #{tag}
                </Badge>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight tracking-tight text-slate-900 dark:text-slate-50">
              {post.title}
            </h1>

            {/* Meta Data Row: Tuned explicitly to pass 4.5:1 text requirements */}
            <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-400 border-y border-slate-200 dark:border-slate-800 py-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400" />
                <span className="font-bold text-slate-900 dark:text-slate-200">
                  {post.author?.name || "Anonymous"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>{format(new Date(post.createdAt), "MMMM d, yyyy")}</span>
              </div>
              {post.readingTime && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>{post.readingTime} min read</span>
                </div>
              )}
            </div>
          </header>

   



          {/* Curved Premium Frame Cover Image */}
          {post.coverImage && (
            <div className="relative mb-10 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm w-full h-64 md:h-96 bg-slate-100 dark:bg-slate-900">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                priority // Tells Next.js to load this immediately since it's at the top of the page
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>
          )}

    
          {/* Body content slot */}
          <div className="prose prose-slate max-w-none dark:prose-invert">
            <MarkdownViewer
              value={typeof post.body === "string" ? post.body : ""}
            />
          </div>
        </article>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id": `https://phaglp.com/blog/${post.slug}`,
              },
              headline: post.title,
              image: post.coverImage ? [post.coverImage] : undefined,
              datePublished:
                typeof post.createdAt === "string"
                  ? post.createdAt
                  : post.createdAt.toISOString(),
              dateModified:
                typeof post.updatedAt === "string"
                  ? post.updatedAt
                  : post.updatedAt.toISOString(),
              author: {
                "@type": "Person",
                name: post.author?.name || "Anonymous",
              },
              publisher: {
                "@type": "Organization",
                name: "PHAGLP",
                logo: {
                  "@type": "ImageObject",
                  url: "https://phaglp.com/logo.png",
                },
              },
            }).replace(/</g, "\\u003c"),
          }}
        />
      </div>
    </div>
  );
}
