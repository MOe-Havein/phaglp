import React from "react";
import { prisma, safeDbQuery } from "@/lib/prisma";
import { LatestLecturesClient } from "./LatestLecturesClient";

// EXACT DATA SCHEMA REQUIRED BY THE SPECIFICATION
export interface LETURES {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  coverImage: string;
  category: string;
  readingTime: string;
  createdAt: string; // ISO string format
}


interface LatestLETURESProps {
  title?: string | undefined;
}

export async function LatestLETURES({
  title = "Latest Lectures",
}: LatestLETURESProps) {
  let lectures: LETURES[] = [];

  try {
    // Direct server-side SQLite query using safeDbQuery helper
    const result = await safeDbQuery(async () => {
      return prisma.lecture.findMany({
        where: {
          published: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    });

    if (result.success && result.data && result.data.length > 0) {
      lectures = result.data.map((item: any) => ({
        id: item.id,
        title: item.title,
        excerpt:
          item.excerpt ||
          item.body.replace(/[#*`]/g, "").substring(0, 150) + "...",
        slug: item.slug,
        coverImage: item.coverImage || "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=600&auto=format&fit=crop",
        category: item.category,
        readingTime: `${item.readingTime || 5} min read`,
        createdAt:
          item.createdAt instanceof Date
            ? item.createdAt.toISOString()
            : String(item.createdAt),
      }));
    }
  } catch (error) {
    console.error("Error loading lectures on Server Component:", error);
  }

  return <LatestLecturesClient title={title} lectures={lectures} />;
}
