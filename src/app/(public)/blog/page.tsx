import prisma, { safeDbQuery } from "@/lib/prisma";
import { BlogListing } from "@/features/blog/components/blog-listing";
import { unstable_cache } from "next/cache";
import { redis } from "@/lib/redis";

// Ensure dynamic rendering to handle database state safely
export const dynamic = "force-dynamic";

const getCachedBlogPosts = unstable_cache(
  async () => {
    const cacheKey = "blog-posts";
    const cached = await redis.get<any[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const result = await safeDbQuery(async () => {
      return prisma.post.findMany({
        where: {
          published: true,
        },
        include: {
          author: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }, []);

    const data = result.data || [];

    await redis.set(cacheKey, data, { ex: 300 });
    return data;
  },
  ["blog-posts"],
  { tags: ["blog-posts"], revalidate: 300 },
);

export default async function BlogPage() {
  let posts: any[] = [];
  try {
    posts = await getCachedBlogPosts();
  } catch (error) {
    console.error("Failed to fetch cached blog posts:", error);
  }

  return (
    <div className="container mx-auto px-4 py-12 bg-background text-foreground transition-colors duration-300">
      <div className="max-w-3xl mb-12">
        <h1 className="text-4xl font-black mb-4 tracking-tight text-slate-900 dark:text-slate-50">
          Latest Insights & Blog
        </h1>
        <p className="text-lg font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
          Explore articles, news, and community insights from the PHAGLP
          ecosystem.
        </p>
      </div>

      <BlogListing lectures={posts} />
    </div>
  );
}
