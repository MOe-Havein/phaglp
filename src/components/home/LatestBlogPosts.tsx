"use client"

import React, { useState, useEffect } from "react"
import { BlogSection } from "@/components/home/BlogSection"
import type { Post } from "@/components/home/BlogCard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { AlertTriangle, RefreshCw } from "lucide-react"

export function LatestBlogPosts() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPosts = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/posts")
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`)
      }
      const payload = await response.json()
      if (payload.success) {
        // Safely map database Lecture model to Post schema
        const mapped: Post[] = (payload.data || []).map((item: any) => ({
          id: item.id,
          title: item.title,
          excerpt: item.excerpt || item.body.replace(/[#*`]/g, "").substring(0, 150) + "...",
          slug: item.slug,
          coverImage: item.coverImage || "",
          category: item.category,
          readingTime: `${item.readingTime || 5} min read`,
          createdAt: item.createdAt,
        }))
        setPosts(mapped)
      } else {
        throw new Error(payload.error || "Failed to load blog posts.")
      }
    } catch (err: any) {
      console.error("Error fetching latest blog posts:", err)
      setError(err?.message || "An unexpected error occurred while loading posts.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  if (loading) {
    return <LatestBlogPostsSkeleton />
  }

  if (error) {
    return (
      <section className="py-24 px-4 bg-background border-t border-border/40">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-center py-16 px-6 bg-rose-50/50 dark:bg-rose-950/10 rounded-3xl border border-rose-200/50 dark:border-rose-900/30 text-center max-w-xl mx-auto shadow-inner">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950 flex items-center justify-center mb-4 text-rose-600 dark:text-rose-400 shadow-sm animate-bounce">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Could Not Load Latest Insights</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              We encountered a temporary disruption while retrieving our database updates.
            </p>
            <Button
              onClick={fetchPosts}
              className="inline-flex items-center gap-2 px-5 py-2 hover:shadow-md transition-all active:scale-95 animate-pulse"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
          </div>
        </div>
      </section>
    )
  }

  // Gracefully handle empty states using the BlogSection's semantic empty layout
  return <BlogSection posts={posts} />
}

function LatestBlogPostsSkeleton() {
  return (
    <section className="py-24 px-4 bg-background border-t border-border/40 animate-pulse relative">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl w-full space-y-4">
            <div className="h-6 bg-muted rounded-full w-1/4"></div>
            <div className="h-12 bg-muted rounded-2xl w-3/4"></div>
            <div className="h-6 bg-muted rounded-lg w-full"></div>
          </div>
          <div className="h-10 bg-muted rounded-xl w-32 hidden md:block"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="flex flex-col border border-border/50 bg-card/60 h-[400px] rounded-2xl overflow-hidden">
              <div className="w-full h-48 bg-muted"></div>
              <CardHeader className="pb-3 pt-5 px-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-4 bg-muted rounded w-20"></div>
                  <div className="h-4 bg-muted rounded w-16"></div>
                </div>
                <div className="h-7 bg-muted rounded w-full"></div>
                <div className="h-7 bg-muted rounded w-2/3"></div>
              </CardHeader>
              <CardContent className="flex-grow px-6 pb-5 space-y-2">
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </CardContent>
              <CardFooter className="pt-4 pb-5 px-6 border-t border-border/40 flex justify-between items-center">
                <div className="h-5 bg-muted rounded w-24"></div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-muted"></div>
                  <div className="h-4 bg-muted rounded w-16"></div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
