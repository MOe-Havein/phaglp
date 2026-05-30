import React from "react"
import { prisma, safeDbQuery } from "@/lib/prisma"
import { LatestLecturesClient } from "./LatestLecturesClient"

// EXACT DATA SCHEMA REQUIRED BY THE SPECIFICATION
export interface LETURES {
  id: string
  title: string
  excerpt: string
  slug: string
  coverImage: string
  category: string
  readingTime: string
  createdAt: string // ISO string format
}

// Fallback Mock array using the exact LETURES interface
const FALLBACK_LECTURES: LETURES[] = [
  {
    id: "let-1",
    title: "Introduction to Cognitive Architectures and AI Alignment",
    excerpt:
      "Delve into the foundational mechanics of cognitive architectures, artificial general intelligence constraints, and alignment methodologies.",
    slug: "cognitive-architectures-and-ai-alignment",
    coverImage:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=200&auto=format&fit=crop&q=80",
    category: "Computer Science",
    readingTime: "12 min read",
    createdAt: "2026-05-15T08:00:00.000Z",
  },
  {
    id: "let-2",
    title: "Epistemology in the Digital Era: Socratic Inquiry & Neural Nets",
    excerpt:
      "Analyze how traditional Socratic search for universal truth translates to statistical representations in high-dimensional vector spaces.",
    slug: "epistemology-in-the-digital-era",
    coverImage:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=200&auto=format&fit=crop&q=80",
    category: "Philosophy",
    readingTime: "15 min read",
    createdAt: "2026-05-20T10:30:00.000Z",
  },
  {
    id: "let-3",
    title: "Quantum Information Theory: Gates, States, and Entanglement",
    excerpt:
      "A comprehensive introduction to qubit mathematics, state transformations, Bell states, and experimental quantum computational frameworks.",
    slug: "quantum-information-theory-gates-states",
    coverImage:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=200&auto=format&fit=crop&q=80",
    category: "Physics",
    readingTime: "18 min read",
    createdAt: "2026-05-24T14:15:00.000Z",
  },
]

interface LatestLETURESProps {
  title?: string | undefined
}

export async function LatestLETURES({ title = "Latest Lectures" }: LatestLETURESProps) {
  let lectures: LETURES[] = FALLBACK_LECTURES

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
      })
    })

    if (result.success && result.data && result.data.length > 0) {
      lectures = result.data.map((item: any) => ({
        id: item.id,
        title: item.title,
        excerpt: item.excerpt || item.body.replace(/[#*`]/g, "").substring(0, 150) + "...",
        slug: item.slug,
        coverImage:
          item.coverImage ||
          "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=600&auto=format&fit=crop",
        category: item.category,
        readingTime: `${item.readingTime || 5} min read`,
        createdAt:
          item.createdAt instanceof Date ? item.createdAt.toISOString() : String(item.createdAt),
      }))
    }
  } catch (error) {
    console.error("Error loading lectures on Server Component:", error)
  }

  return <LatestLecturesClient title={title} lectures={lectures} />
}
