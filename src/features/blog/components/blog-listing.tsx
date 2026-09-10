"use client";

import { useState } from "react";
import { LectureCard } from "@/components/cards/lecture-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Sparkles } from "lucide-react";
import { format } from "date-fns";

interface BlogListingProps {
  lectures: any[];
}

export function BlogListing({ lectures }: BlogListingProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Dynamically extract unique categories present in the articles
  const categories = [
    "All",
    ...Array.from(new Set(lectures.map((l) => l.category))),
  ];

  // Filter lectures based on search query and selected category
  const filteredLectures = lectures.filter((lecture) => {
    const matchesSearch =
      lecture.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lecture.excerpt &&
        lecture.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (lecture.body &&
        lecture.body.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === "All" || lecture.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-10 relative">
      {/* Background Radial Light Effect */}
      <div className="absolute top-10 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl opacity-40 dark:opacity-20 pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl opacity-40 dark:opacity-20 pointer-events-none" />

      {/* Search & Filter Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white/50 dark:bg-slate-900/30 backdrop-blur-md shadow-sm">
        {/* Search Bar */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search lectures, topics, concepts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 rounded-xl bg-slate-50/50 dark:bg-slate-950/20 border-slate-200 dark:border-slate-800 focus-visible:ring-primary focus-visible:ring-offset-0 text-sm font-medium"
          />
        </div>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-2 w-full">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <Button
                key={cat}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 text-xs font-bold transition-all duration-300 ${
                  isActive
                    ? "bg-primary text-white shadow-sm shadow-primary/20 scale-105"
                    : "bg-white/60 dark:bg-slate-950/20 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                {cat}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Articles Listing Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredLectures.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-slate-50/50 dark:bg-slate-900/10 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-8">
            <Sparkles className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground font-semibold italic text-base">
              No matching lectures found. Try revising your query or category
              filters.
            </p>
          </div>
        ) : (
          filteredLectures.map((lecture) => (
            <div
              key={lecture.id}
              className="transform transition-transform hover:-translate-y-1.5 duration-300"
            >
              <LectureCard
                title={lecture.title}
                slug={lecture.slug}
                author={lecture.author?.name || "Anonymous"}
                category={lecture.category}
                excerpt={
                  lecture.excerpt || lecture.body.substring(0, 150) + "..."
                }
                publishedAt={format(
                  new Date(lecture.createdAt),
                  "MMMM d, yyyy",
                )}
                tags={lecture.tags}
                coverImage={lecture.coverImage || undefined}
                isFeatured={lecture.isFeatured}
                readingTime={lecture.readingTime || undefined}
                basePath="/blog"
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
