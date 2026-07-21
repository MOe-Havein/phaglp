import prisma, { safeDbQuery } from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import { auth } from "@/auth";
import { computeDiscount } from "@/lib/discount";
import { CourseType } from "@prisma/client";
import { CourseCard } from "@/components/cards/course-card";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  GraduationCap,
  Award,
  Sparkles,
  Percent,
  Clock,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

// Handle database states safely at runtime
export const dynamic = "force-dynamic";

// Next.js native engine automatically coordinates the 300s window memory layers
const getCachedCourses = unstable_cache(
  async () => {
    const result = await safeDbQuery(async () => {
      return prisma.course.findMany({
        where: {
          published: true,
        },
        include: {
          instructor: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }, []);

    return result?.data || [];
  },
  ["public-courses"],
  { tags: ["courses"], revalidate: 300 },
);

export default async function CoursesPage() {
  let courses: any[] = [];
  try {
    courses = await getCachedCourses();
  } catch (error) {
    console.error("Failed to fetch cached courses:", error);
  }

  // Calculate discount for logged-in user
  const session = await auth();
  let discountPct = 0;
  let userName = "";

  if (session?.user?.id) {
    userName = session.user.name || "Scholar";
    const result = await safeDbQuery(async () => {
      return prisma.user.findUnique({
        where: { id: session.user.id },
        select: { incomeLevel: true, worldTier: true },
      });
    });
    const dbUser = result?.data;
    if (dbUser) {
      discountPct = computeDiscount(dbUser.incomeLevel, dbUser.worldTier);
    }
  }

  // Predefined programs
  const predefinedPrograms = [
    {
      title: "GP COURSE",
      description:
        "A comprehensive deep-dive into advanced global philosophical models and integration methodologies.",
      originalPrice: 300,
      duration: "2 years",
      type: CourseType.GP_GENERAL,
      gradient: "from-blue-600 to-indigo-600",
      icon: GraduationCap,
      features: [
        "Full Core Integration",
        "Personal Mentoring",
        "Official Certificate",
      ],
    },
    {
      title: "GP GROUPS COURSES",
      description:
        "Interactive peer cohort learning program bridging structured logic, discourse, and real-world application.",
      originalPrice: 200,
      duration: "8 months",
      type: CourseType.GP_GROUPS,
      gradient: "from-purple-600 to-pink-600",
      icon: BookOpen,
      features: [
        "Peer Discussion Cohorts",
        "Guided Workshops",
        "Specialist Reviews",
      ],
    },
    {
      title: "GP SUBJECTS COURSES",
      description:
        "Accelerated course focusing intensely on highly specialized individual branches of classic and modern thought.",
      originalPrice: 100,
      duration: "2 months",
      type: CourseType.GP_SUBJECTS,
      gradient: "from-emerald-600 to-teal-600",
      icon: Award,
      features: [
        "Syllabus-focused study",
        "Quizzes & Feedback",
        "Expert Lectures",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/20 py-16">
      <div className="container mx-auto px-4">
        {/* Stunning Premium Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16 relative p-6 rounded-lg">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-primary/10 rounded-full blur-3xl opacity-50 dark:opacity-30" />
          <Badge className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white border-0 px-4 py-1.5 rounded-full mb-6 font-semibold tracking-wide uppercase">
            OUR ELITE COURSES
          </Badge>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-400 bg-clip-text text-transparent leading-none">
            ELITE COURSES
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed font-medium">
            Elite Courses, these are the scientific modules of The General
            Program of Life Planning for geniuses, gifted, and talented, young
            and adult. They are presented here as advanced, specialized academic
            courses, characterized by their luxury, uniqueness, and
            exclusivity—unavailable anywhere else.
          </p>

          {/* Discount Promotion Banner */}
          {discountPct > 0 && (
            <div className="mt-8 inline-flex items-center gap-3 bg-red-500/10 dark:bg-red-500/20 border border-red-500/30 rounded-2xl px-6 py-3 text-red-700 dark:text-red-300 font-semibold text-sm shadow-sm">
              <Percent className="w-5 h-5 shrink-0" />
              <span>
                Welcome, {userName}! You qualify for a{" "}
                <strong className="text-red-600 dark:text-red-400">
                  {discountPct}% discount
                </strong>{" "}
                based on your profile status.
              </span>
            </div>
          )}
        </div>

        {/* Section 1: Predefined GP Programs */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-10 border-b pb-4">
            <div>
              <h2 className="text-3xl font-extrabold flex items-center gap-3">
                <Sparkles className="text-primary w-8 h-8" />
                Core GP Programs
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                Predefined high-level certification pathways optimized for
                comprehensive excellence.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {predefinedPrograms.map((prog) => {
              const IconComponent = prog.icon;
              const finalPrice = Math.round(
                prog.originalPrice * (1 - discountPct / 100),
              );
              return (
                <Card
                  key={prog.type}
                  className="group relative border border-slate-200/60 dark:border-slate-800/80 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 rounded-2xl overflow-hidden bg-white/70 dark:bg-slate-900/60 backdrop-blur-md flex flex-col justify-between"
                >
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      {/* Program Header Gradient Banner */}
                      <div
                        className={`h-2 bg-gradient-to-r ${prog.gradient}`}
                      />

                      <CardHeader className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div
                            className={`p-3 rounded-xl bg-gradient-to-br ${prog.gradient} text-white shadow-md`}
                          >
                            <IconComponent className="w-6 h-6" />
                          </div>
                          <Badge
                            variant="outline"
                            className="text-xs font-semibold px-3 py-1 bg-slate-50 dark:bg-slate-800 border-slate-200/80 dark:border-slate-700"
                          >
                            GP Certified
                          </Badge>
                        </div>
                        <CardTitle className="text-2xl font-bold tracking-tight">
                          {prog.title}
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="p-6 pt-0 space-y-4">
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {prog.description}
                        </p>

                        <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                          <Clock className="w-4 h-4" />
                          <span>{prog.duration}</span>
                        </div>

                        <ul className="space-y-2 pt-2">
                          {prog.features.map((feature, i) => (
                            <li
                              key={i}
                              className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300"
                            >
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </div>

                    <CardFooter className="p-6 border-t bg-slate-50/50 dark:bg-slate-900/20 flex items-center justify-between">
                      <div className="flex flex-col">
                        {discountPct > 0 && (
                          <span className="text-xs text-muted-foreground line-through">
                            ${prog.originalPrice}
                          </span>
                        )}
                        <span className="text-2xl font-black text-slate-900 dark:text-white">
                          ${finalPrice}
                        </span>
                      </div>
                      <Button asChild size="sm">
                        <Link href={`/courses?type=${prog.type}`}>
                          Explore Program
                        </Link>
                      </Button>
                    </CardFooter>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Section 2: Other Courses */}
        <div>
          <div className="flex items-center justify-between mb-10 border-b pb-4">
            <div>
              <h2 className="text-3xl font-extrabold flex items-center gap-3">
                <BookOpen className="text-primary w-8 h-8" />
                Others / Custom Modules
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                Browse student-instructor driven philosophical focus modules and
                elective courses.
              </p>
            </div>
          </div>

          {courses.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-white/50 dark:bg-slate-900/30 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 backdrop-blur-sm max-w-xl mx-auto shadow-sm">
              <GraduationCap className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg font-medium">
                No custom courses published yet.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Check back later for newly approved curriculum.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {courses.map((course: any) => (
                <CourseCard
                  key={course.id}
                  title={course.title}
                  slug={course.slug}
                  instructor={course.instructor.name || "Anonymous"}
                  price={course.price}
                  duration={course.duration}
                  description={course.description}
                  rating={4.8}
                  category="Philosophical"
                  courseType={course.courseType}
                  discountPct={discountPct}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
