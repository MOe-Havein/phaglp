import prisma, { safeDbQuery } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User, Clock } from "lucide-react";
import Link from "next/link";
import { FoxyLoader } from "@/components/foxy/foxy-loader";
import { unstable_cache } from "next/cache";
import nextDynamic from "next/dynamic";
const WysiwygEditor = nextDynamic(() => import("@/components/editor/wysiwyg-markdown-editor").then(mod => mod.WysiwygMarkdownEditor), { ssr: false });

// Ensure dynamic rendering to handle database state safely at runtime
export const dynamic = "force-dynamic";

interface PageProps {
  params: { slug: string };
}

const getBlogPostBySlug = async (slug: string) => {
  return unstable_cache(
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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // Always return a valid Metadata object – fallback values are used when the post is missing.
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  // Guard: if the post cannot be found, return minimal metadata to avoid a blank page.
  if (!post) {
    return {
      title: "Blog post not found",
      description: "The requested blog entry could not be located.",
    };
  }

  // Build full metadata from the retrieved post.
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
                {post.category}
              </Badge>
              {tags.map((tag: string) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-slate-500 border-slate-200 dark:border-slate-800"
                >
                  #{tag}
                </Badge>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight tracking-tight text-slate-900 dark:text-slate-50">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground border-y border-slate-100 dark:border-slate-900 py-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {post.author?.name || "Anonymous"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{format(new Date(post.createdAt), "MMMM d, yyyy")}</span>
              </div>
              {post.readingTime && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{post.readingTime} min read</span>
                </div>
              )}
            </div>
          </header>

          {/* Cover Image */}
          {post.coverImage && (
            <div className="mb-10 rounded-2xl overflow-hidden shadow-md max-h-96 w-full">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Body Content */}
          <div className="prose prose-blue dark:prose-invert max-w-none">
            <WysiwygEditor value={typeof post.body === 'string' ? post.body : ''} onChange={() => {}} height={500} />
          </div>
        </article>

        {/* Global FoxyLoader ensures FoxyCart intercept is fully active */}
        <FoxyLoader />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
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
            }).replace(/</g, '\\u003c'),
          }}
        />
      </div>
    </div>
  );
}
