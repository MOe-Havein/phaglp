import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Clock } from "lucide-react"
import Link from "next/link"

interface LectureCardProps {
  title: string
  slug: string
  author: string
  category: string
  excerpt: string
  publishedAt: string
  tags: string[]
  coverImage?: string
  isFeatured?: boolean
  readingTime?: number
  basePath?: string
}

// Category color mappings
const categoryColors: Record<string, { bg: string; text: string; imageBg: string }> = {
  Education: { bg: "bg-blue-50", text: "text-blue-700", imageBg: "bg-blue-200" },
  Marriage: { bg: "bg-green-50", text: "text-green-700", imageBg: "bg-green-200" },
  "E-Commerce": { bg: "bg-pink-50", text: "text-pink-700", imageBg: "bg-pink-200" },
  Philosophy: { bg: "bg-purple-50", text: "text-purple-700", imageBg: "bg-purple-200" },
  Technology: { bg: "bg-indigo-50", text: "text-indigo-700", imageBg: "bg-indigo-200" },
  Science: { bg: "bg-cyan-50", text: "text-cyan-700", imageBg: "bg-cyan-200" },
  default: { bg: "bg-slate-50", text: "text-slate-700", imageBg: "bg-slate-200" },
}

export function LectureCard({
  title,
  slug,
  author,
  category,
  excerpt,
  publishedAt,
  tags,
  coverImage,
  isFeatured = false,
  readingTime,
  basePath = "/lectures",
}: LectureCardProps) {
  const colors = categoryColors[category] ||
    categoryColors["default"] || {
      bg: "bg-slate-50",
      text: "text-slate-700",
      imageBg: "bg-slate-200",
    }

  const safeTags = Array.isArray(tags) ? tags : []

  // Generate initials from title for placeholder
  const getInitials = (text: string) => {
    if (!text) return "LE"
    const words = text.split(" ")
    const firstWord = words[0]
    const secondWord = words[1]
    if (firstWord && secondWord) {
      const firstChar = firstWord[0] || ""
      const secondChar = secondWord[0] || ""
      return firstChar + secondChar
    }
    return text.substring(0, 2)
  }

  return (
    <Card
      className={`flex flex-col h-full hover:shadow-lg transition-all duration-300 ${colors.bg} border-0 overflow-hidden`}
    >
      <CardContent className="p-6 flex flex-col h-full">
        {/* Header with Featured Badge and Category */}
        <div className="flex justify-between items-start mb-6">
          {isFeatured && (
            <Badge className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-semibold border-0 px-3 py-1">
              Featured
            </Badge>
          )}
          <span className={`ml-auto text-sm font-medium ${colors.text}`}>{category}</span>
        </div>

        {/* Cover Image or Placeholder */}
        <div className="flex justify-center mb-6">
          {coverImage ? (
            <div className="relative w-32 h-32 rounded-full overflow-hidden">
              <img src={coverImage} alt={title} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div
              className={`w-32 h-32 rounded-full ${colors.imageBg} flex items-center justify-center`}
            >
              <span className={`text-2xl font-bold ${colors.text}`}>{getInitials(title)}</span>
            </div>
          )}
        </div>

        {/* Title */}
        <Link href={`${basePath}/${slug}`} className="block mb-3">
          <h3 className="text-xl font-bold line-clamp-2 hover:underline transition-all">{title}</h3>
        </Link>

        {/* Excerpt */}
        <p className="text-sm text-slate-600 line-clamp-2 mb-4 flex-grow">{excerpt}</p>

        {/* Meta Information */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <User className="w-3 h-3" />
            <span className="font-medium">{author}</span>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500">
            {readingTime && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{readingTime} min read</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{publishedAt}</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {safeTags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-medium uppercase tracking-wide text-slate-600 bg-white/70 px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
          {safeTags.length > 3 && (
            <span className="text-[10px] font-medium uppercase tracking-wide text-slate-600 bg-white/70 px-2 py-1 rounded">
              +{safeTags.length - 3} more
            </span>
          )}
        </div>

        {/* Read Lecture Button */}
        <Link
          href={`${basePath}/${slug}`}
          className="block w-full text-center py-2 border border-slate-300 rounded-md hover:bg-white hover:shadow-sm transition-all text-sm font-medium"
        >
          Read Lecture
        </Link>
      </CardContent>
    </Card>
  )
}
