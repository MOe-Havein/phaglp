import Link from "next/link";
import { getLatestLectures } from "@/lib/lecture-queries";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar } from "lucide-react";

/**
 * Truncates text to a specific length and adds an ellipsis.
 */
function truncate(text: string, length: number) {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + "...";
}

/**
 * Formats a date to a readable string.
 */
function formatDate(date: Date | string) {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(dateObj);
}

export default async function LatestLecturesCTA() {
  const lectures = await getLatestLectures(3);

  if (lectures.length === 0) {
    return null; // Gracefully hide if no lectures
  }

  return (
    <section className="py-24 px-4 bg-background">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-foreground tracking-tight">
              OUR LATEST MAGICAL LECTURES?!
            </h2>
            <p className="text-muted-foreground text-lg">
              Explore our newest insights on philosophy, science, and the wisdom
              of living.
            </p>
          </div>
          <Button
            variant="ghost"
            asChild
            className="group text-primary font-semibold hover:bg-primary/5"
          >
            <Link href="/lectures">
              View All Lectures
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {lectures.map((lecture) => (
            <Card
              key={lecture.id}
              className="flex flex-col border border-primary/5 shadow-sm hover:shadow-xl transition-all duration-300 bg-background group overflow-hidden"
            >
              <CardHeader className="pb-4">
                <div className="flex justify-between items-center mb-3">
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary border-none hover:bg-primary/20"
                  >
                    {lecture.category}
                  </Badge>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDate(lecture.createdAt)}
                  </div>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors leading-snug">
                  <Link href={`/lectures/${lecture.slug}`}>
                    {lecture.title}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground line-clamp-3 leading-relaxed">
                  {truncate(lecture.body.replace(/[#*`]/g, ""), 150)}
                </p>
              </CardContent>
              <CardFooter className="pt-4 border-t border-primary/5">
                <Button
                  variant="link"
                  asChild
                  className="p-0 h-auto text-primary font-semibold group-hover:underline"
                >
                  <Link
                    href={`/lectures/${lecture.slug}`}
                    className="flex items-center"
                  >
                    Read More <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <div className="ml-auto flex items-center text-xs text-muted-foreground italic">
                  by {lecture.author.name || "Anonymous"}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center md:hidden">
          <Button
            size="lg"
            className="bg-primary text-white hover:bg-primary/90 w-full"
            asChild
          >
            <Link href="/lectures">View All Lectures</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
