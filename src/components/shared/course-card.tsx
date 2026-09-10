import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, BookOpen, Star } from "lucide-react";

export interface CourseCardProps {
  title: string;
  description: string;
  imageUrl: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  lessons: number;
  rating: number;
  price?: string;
}

export function CourseCard({
  title,
  description,
  imageUrl,
  level,
  duration,
  lessons,
  rating,
  price = "Free",
}: CourseCardProps) {
  return (
    <Card className="group overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-300">
      {/* Course Image */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        <img
          src={imageUrl}
          alt={title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge variant="default" className="shadow-sm">
            {level}
          </Badge>
        </div>
      </div>

      <CardContent className="flex flex-col flex-grow p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-sans text-xl font-bold tracking-tight text-foreground line-clamp-2">
            {title}
          </h3>
        </div>

        <p className="text-text-muted text-sm mb-6 line-clamp-3 flex-grow">
          {description}
        </p>

        {/* Course Meta Info */}
        <div className="flex items-center gap-4 text-sm font-medium text-slate-500 mb-6">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" />
            <span>{lessons} Lessons</span>
          </div>
          <div className="flex items-center gap-1.5 ml-auto text-amber-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-slate-700 font-bold">{rating}</span>
          </div>
        </div>

        {/* Action Row */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
          <span className="text-lg font-black text-primary">{price}</span>
          <Button variant="default" size="sm" className="font-bold">
            Enroll Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
