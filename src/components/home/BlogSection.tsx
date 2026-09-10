"use client";

import { ArrowRight, BookOpen } from "lucide-react";
import { BlogCard, type Post } from "@/components/home/BlogCard";

interface BlogSectionProps {
  posts?: Post[];
}

export function BlogSection({ posts }: BlogSectionProps) {
  const safePosts = Array.isArray(posts) && posts.length > 0 ? posts : [];

  return (
    <section
      aria-labelledby="blog-section-heading"
      className="w-full px-4 py-16 sm:py-20 sm:px-6 lg:px-8 bg-background border-t border-border/40"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="max-w-xl">
            <p className="text-xs font-semibold font-sans tracking-[0.18em] uppercase text-primary mb-3 select-none">
              From the blog
            </p>
            <h2
              id="blog-section-heading"
              className="font-serif text-4xl sm:text-5xl font-bold text-foreground tracking-tight text-balance leading-tight"
            >
              Latest Articles
            </h2>
            <p className="mt-3 text-base text-muted-foreground font-sans leading-relaxed text-pretty max-w-md">
              Perspectives on design, engineering, and the craft of building
              things that last.
            </p>
          </div>

          {/* Desktop "View All" link beside heading */}
          {safePosts.length > 0 && (
            <a
              href="/blog"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold font-sans text-foreground border border-border rounded-lg px-4 py-2.5 hover:bg-secondary hover:border-foreground active:opacity-70 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 whitespace-nowrap shrink-0"
            >
              View all posts
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
          )}
        </div>

        {/* Posts grid or Empty state */}
        {safePosts.length > 0 ? (
          <>
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
              role="list"
              aria-label="Blog post cards"
            >
              {safePosts.map((post) => (
                <div key={post.id} role="listitem">
                  <BlogCard post={post} />
                </div>
              ))}
            </div>

            {/* Mobile + bottom CTA button */}
            <div className="mt-12 flex justify-center">
              <a
                href="/blog"
                className="inline-flex sm:hidden items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold font-sans border-2 border-foreground text-foreground hover:bg-foreground hover:text-primary-foreground active:opacity-80 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                View all posts
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          </>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary border border-border mb-5">
              <BookOpen
                className="w-7 h-7 text-muted-foreground"
                aria-hidden="true"
              />
            </div>
            <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
              No articles yet
            </h3>
            <p className="text-sm text-muted-foreground font-sans max-w-xs leading-relaxed">
              We&apos;re working on some great content. Check back soon for our
              first articles.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
