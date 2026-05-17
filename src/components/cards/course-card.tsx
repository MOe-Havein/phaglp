import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, GraduationCap, Star, Percent } from "lucide-react"
import Link from "next/link"
import { CourseType } from "@prisma/client"
import { applyDiscount } from "@/lib/discount"

interface CourseCardProps {
  id?: string
  title: string
  instructor: string
  price: number
  rating: number
  category: string
  slug: string
  duration?: string | null
  description?: string | null
  courseType?: CourseType | null
  discountPct?: number
}

const getCourseTypeLabel = (type?: CourseType | null) => {
  switch (type) {
    case CourseType.GP_GENERAL:
      return "General Program"
    case CourseType.GP_GROUPS:
      return "Groups"
    case CourseType.GP_SUBJECTS:
      return "Subjects"
    default:
      return "Other Program"
  }
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
  courseType,
  discountPct = 0,
}: CourseCardProps) {
  const finalPrice = applyDiscount(price, discountPct)

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow relative overflow-hidden">
      {discountPct > 0 && (
        <div className="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-br-lg z-10 flex items-center gap-0.5 animate-pulse">
          <Percent className="w-3 h-3" />
          <span>{discountPct}% OFF</span>
        </div>
      )}
      <CardHeader className="p-0">
        <div className="aspect-video w-full bg-slate-200 rounded-t-xl flex items-center justify-center overflow-hidden relative">
          <GraduationCap className="w-12 h-12 text-slate-400" />
          <Badge className="absolute top-2 right-2 bg-primary">{category}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1 text-yellow-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-medium">{rating}</span>
          </div>
          {courseType && (
            <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
              {getCourseTypeLabel(courseType)}
            </Badge>
          )}
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
        <div className="flex flex-col">
          {discountPct > 0 ? (
            <>
              <span className="text-xs text-muted-foreground line-through">${price}</span>
              <span className="text-lg font-bold text-red-600 dark:text-red-400">${finalPrice}</span>
            </>
          ) : (
            <span className="text-lg font-bold">${price}</span>
          )}
        </div>
        <Button asChild size="sm" className="bg-primary text-white hover:bg-primary/90">
          <Link href={`/courses/${slug}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
