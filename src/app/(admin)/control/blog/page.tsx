import { Suspense } from "react"
import { BookOpen, Plus } from "lucide-react"
import Link from "next/link"
import { prisma, serializePrisma } from "@/lib/prisma"

export const metadata = {
  title: "Blog — PHAGLP Control",
}

async function getBlogPosts() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: { author: { select: { id: true, name: true, email: true } } },
    })
    return serializePrisma(posts)
  } catch (error) {
    console.error("Failed to fetch admin blog posts:", error)
    return []
  }
}

async function BlogPostsTable() {
  const posts = await getBlogPosts()
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-900">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-700">
              <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">
                Title
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">
                Category
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">
                Author
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">
                Status
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">
                Date
              </th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600 dark:text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16 text-center text-gray-400">
                  <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No blog posts yet</p>
                </td>
              </tr>
            ) : (
              posts.map((post: any) => (
                <tr
                  key={post.id}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white max-w-[240px] truncate">
                    {post.title}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{post.category}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    {post.author?.name ?? post.author?.email ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                        post.published
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                          : "bg-gray-100 text-gray-500 dark:bg-gray-800"
                      }`}
                    >
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/control/blog/${post.id}`}
                      className="text-xs text-blue-500 hover:text-blue-600 font-medium transition-colors"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {posts.length > 0 && (
        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800/60 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500">
            {posts.length} post{posts.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}
    </div>
  )
}

export default async function BlogPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Content</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Blog Posts
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your standalone community articles and announcements.
          </p>
        </div>
        <Link
          href="/control/blog/new"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Blog Post
        </Link>
      </div>

      <Suspense
        fallback={
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-12 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
            ))}
          </div>
        }
      >
        <BlogPostsTable />
      </Suspense>
    </div>
  )
}
