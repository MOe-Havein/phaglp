import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, GraduationCap, Star } from "lucide-react"
import Link from "next/link"

interface CourseCardProps {
  id: string
  title: string
  instructor: string
  price: number
  rating: number
  category: string
  slug: string
  duration?: string | null
  description?: string | null
}

export function CourseCard({
  title,
  instructor,
  price,
  rating,
  category,
  slug,
  duration,
  description,
}: Omit<CourseCardProps, "id">) {
  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <div className="aspect-video w-full bg-slate-200 rounded-t-xl flex items-center justify-center overflow-hidden relative">
          <GraduationCap className="w-12 h-12 text-slate-400" />
          <Badge className="absolute top-2 right-2 bg-primary">{category}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <div className="flex items-center gap-1 text-yellow-500 mb-2">
          <Star className="w-4 h-4 fill-current" />
          <span className="text-sm font-medium">{rating}</span>
        </div>
        <CardTitle className="text-xl mb-2 line-clamp-2">{title}</CardTitle>
        <p className="text-sm text-muted-foreground mb-3">by {instructor}</p>

        {description && (
          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 italic">
            {description.replace(/[#*`]/g, "")}
          </p>
        )}

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{duration || "12 hours"}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t flex items-center justify-between">
        <span className="text-lg font-bold">${price}</span>
        <Button asChild size="sm" className="bg-primary text-white">
          <Link href={`/courses/${slug}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
