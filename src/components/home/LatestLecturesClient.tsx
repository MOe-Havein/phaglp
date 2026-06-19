"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CldImage } from "next-cloudinary";
import { Calendar, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LETURES } from "./LatestLETURES";

function formatDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  } catch {
    return isoString;
  }
}

interface LatestLecturesClientProps {
  title: string;
  lectures: LETURES[];
}

export function LatestLecturesClient({
  title,
  lectures,
}: LatestLecturesClientProps) {
  const [visibleCount, setVisibleCount] = useState<number>(4);

  const showMore = () => {
    if (visibleCount < lectures.length) {
      setVisibleCount((prev) => Math.min(prev + 2, lectures.length));
    } else {
      setVisibleCount(4);
    }
  };

  return (
    <section className="w-full py-16 px-4 bg-background border-t border-border/40">
      <div className="container mx-auto max-w-7xl">
        {/* 1. Section Header: Left-aligned title, right-aligned primary CTA button */}
        <div className="flex flex-row justify-between items-center mb-8 pb-4 border-b border-border">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
              {title}
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground mt-1 hidden sm:block">
              Gain top-tier knowledge from international academic and
              professional fields.
            </p>
          </div>
          <Button
            asChild
            className="shrink-0 bg-primary text-primary-foreground hover:bg-primary/95 text-xs sm:text-sm font-semibold h-9 sm:h-10 px-4 sm:px-5"
          >
            <Link href="/register">Start Free Trial</Link>
          </Button>
        </div>

        {/* 2. Grid Layout: 1-column on mobile, 2-column on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {lectures.slice(0, visibleCount).map((lecture, index) => (
            // Clickable card container wrapping the contents
            <Link
              key={lecture.id}
              href={`/lectures/${lecture.slug}`}
              className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl transition-transform duration-200 active:scale-[0.99]"
            >
              {/* 3. Card Design (Horizontal Layout) using semantic Tailwind classes */}
              <div className="flex flex-row gap-4 p-4 rounded-xl border border-border bg-card text-foreground hover:bg-accent/5 hover:border-primary/30 dark:hover:border-primary/30 transition-all duration-200 shadow-sm hover:shadow-md h-full">
                {/* Left: 80x80px square thumbnail using coverImage */}
                <div className="relative w-20 h-20 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                  <CldImage
                    src={lecture.coverImage}
                    alt={lecture.title}
                    width={80}
                    height={80}
                    format="auto"
                    quality="auto"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    priority={index === 0}
                  />
                </div>

                {/* Right: Content Stack */}
                <div className="flex flex-col flex-grow min-w-0 justify-between">
                  {/* Top: Small avatar/icon next to category text */}
                  <div className="flex items-center gap-1.5 mb-1 shrink-0">
                    <div className="flex items-center justify-center w-4 h-4 rounded-full bg-primary/10 text-primary border border-primary/20 shrink-0">
                      <User className="w-2.5 h-2.5" aria-hidden="true" />
                    </div>
                    <span className="text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground font-bold truncate">
                      {lecture.category}
                    </span>
                  </div>

                  {/* Middle: title and excerpt */}
                  <div className="min-w-0">
                    <h3 className="font-bold text-foreground text-sm sm:text-base leading-snug group-hover:underline line-clamp-1 mb-0.5">
                      {lecture.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
                      {lecture.excerpt}
                    </p>
                  </div>

                  {/* Bottom: Metadata row combining readingTime and formatted createdAt */}
                  <div className="flex items-center gap-2 text-[10px] sm:text-xs text-muted-foreground mt-2 pt-1 border-t border-border/10">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 shrink-0" aria-hidden="true" />
                      <span>{lecture.readingTime}</span>
                    </span>
                    <span className="text-border" aria-hidden="true">
                      •
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar
                        className="w-3 h-3 shrink-0"
                        aria-hidden="true"
                      />
                      <time dateTime={lecture.createdAt}>
                        {formatDate(lecture.createdAt)}
                      </time>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 4. Section Footer: Centered Show more outline button */}
        {lectures.length > 4 && (
          <div className="flex justify-center mt-10">
            <Button
              variant="outline"
              onClick={showMore}
              className="hover:bg-accent font-semibold transition-all duration-200 border-border text-foreground hover:text-foreground"
            >
              {visibleCount < lectures.length ? "Show more" : "Show less"}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
