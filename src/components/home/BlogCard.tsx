"use client";

import { useState } from "react";
import { Clock, ArrowUpRight, Calendar } from "lucide-react";
import { CldImage } from "next-cloudinary";

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  coverImage: string;
  category: string;
  readingTime: string;
  createdAt: string; // ISO String format
}

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

interface BlogCardProps {
  post: Post;
}

export function BlogCard({ post }: BlogCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <article className="group flex flex-col bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background">
      {/* Cover Image */}
      <a
        href={`/blog/${post.slug}`}
        className="block relative aspect-video overflow-hidden bg-muted focus:outline-none"
        tabIndex={-1}
        aria-hidden="true"
      >
        {/* Skeleton placeholder */}
        {!imageLoaded && !imageError && (
          <div
            className="absolute inset-0 bg-muted animate-pulse"
            aria-hidden="true"
          />
        )}

        {!imageError && post.coverImage ? (
          <CldImage
            src={post.coverImage}
            alt={post.title}
            fill
            format="auto"
            quality="auto"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={[
              "object-cover transition-transform duration-500 ease-out group-hover:scale-105",
              imageLoaded ? "opacity-100" : "opacity-0",
            ].join(" ")}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true);
              setImageLoaded(true);
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-secondary flex items-center justify-center">
            <span className="text-muted-foreground text-sm font-sans">
              No image
            </span>
          </div>
        )}

        {/* Category badge overlay */}
        <span className="absolute top-3 left-3 inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold font-sans tracking-wide bg-primary/10 text-primary border border-primary/20 backdrop-blur-sm select-none">
          {post.category}
        </span>
      </a>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Meta row */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground font-sans">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
          </span>
          <span className="text-border" aria-hidden="true">
            ·
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>{post.readingTime}</span>
          </span>
        </div>

        {/* Title */}
        <h3 className="font-serif text-lg font-bold leading-snug text-card-foreground group-hover:text-primary transition-colors duration-200 text-balance">
          <a
            href={`/blog/${post.slug}`}
            className="focus:outline-none focus-visible:underline"
          >
            {post.title}
          </a>
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 font-sans flex-1">
          {post.excerpt}
        </p>

        {/* Read more link */}
        <a
          href={`/blog/${post.slug}`}
          className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold font-sans text-foreground hover:text-primary active:opacity-70 transition-colors duration-200 focus:outline-none focus-visible:underline w-fit"
          aria-label={`Read article: ${post.title}`}
        >
          Read article
          <ArrowUpRight
            className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </a>
      </div>
    </article>
  );
}
