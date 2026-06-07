import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  GraduationCap,
  PlayCircle,
  Trophy,
  Sparkles,
  Calendar,
  BookOpenCheck,
  Camera,
  ListTodo,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { auth } from "@/auth";
import { SubscriptionTier } from "@prisma/client";
import prisma from "@/lib/prisma";
import { CustomizeModal } from "@/components/dashboard/customize-modal";
import { format } from "date-fns";
import { getUserCertificates } from "@/lib/certificate-actions";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  const user = session?.user;

  if (!user || !user.id) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 dark:bg-slate-950/20 px-4">
        <Card className="max-w-md w-full border-slate-200 dark:border-slate-800 shadow-xl rounded-3xl p-6 text-center">
          <GraduationCap className="w-16 h-16 text-primary mx-auto mb-4 animate-bounce" />
          <h2 className="text-2xl font-bold mb-2">Access Portal</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Please log in or register to access your customized learning and
            philosophical research dashboard.
          </p>
          <Button
            asChild
            className="w-full bg-primary text-white rounded-xl shadow-md font-semibold"
          >
            <Link href="/login">Log In to Dashboard</Link>
          </Button>
        </Card>
      </div>
    );
  }

  // Fetch dbUser preferences and dynamic platform content
  const [dbUser, allLectures, certificatesResult] = await Promise.all([
    prisma.user.findUnique({
      where: { id: user.id },
      select: {
        name: true,
        email: true,
        image: true,
        role: true,
        lecturePreferences: true,
        tier: true,
      },
    }),
    prisma.lecture.findMany({
      where: { published: true },
      include: {
        author: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    getUserCertificates(user.id),
  ]);

  const certificates = certificatesResult.success
    ? certificatesResult.data || []
    : [];

  const tier = dbUser?.tier || SubscriptionTier.BASIC;
  const preferences = Array.isArray(dbUser?.lecturePreferences)
    ? (dbUser.lecturePreferences as string[])
    : [];

  // Extract unique categories from published lectures
  const availableCategories = Array.from(
    new Set(allLectures.map((l) => l.category)),
  );

  // Filter lectures based on preference settings
  const customizedLectures =
    preferences.length > 0
      ? allLectures.filter((l) => preferences.includes(l.category))
      : allLectures; // Show all if no preference is chosen yet

  const ongoingCourses = [
    {
      id: 1,
      name: "Foundations of Stoicism",
      progress: 65,
      lastLesson: "The Dichotomy of Control",
      instructor: "Marcus Aurelius",
    },
    {
      id: 2,
      name: "Modern Ethics in Technology",
      progress: 30,
      lastLesson: "Algorithmic Bias",
      instructor: "Dr. Jane Doe",
    },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100/40 via-slate-50/50 to-slate-100/40 dark:from-slate-950/40 dark:via-slate-950/20 dark:to-slate-950/40 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Facebook Style Profile Header with Glassmorphism */}
        <div className="mb-12 rounded-3xl overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 shadow-xl shadow-slate-100/10 dark:shadow-slate-950/50 transition-all duration-500 hover:border-slate-300/60 dark:hover:border-slate-700/60">
          {/* Cover Photo */}
          <div className="relative h-56 md:h-72 w-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-950 via-slate-950 to-slate-950 overflow-hidden">
            {/* Ambient Background Lights */}
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-16 left-1/4 w-80 h-48 bg-indigo-500/10 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-10 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />

            {/* High-Tech Grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)]" />

            {/* Add Cover Photo Label / Decorative Badge */}
            <Badge className="absolute bottom-6 right-6 bg-white/10 dark:bg-black/40 backdrop-blur-md text-white border border-white/10 text-[9px] uppercase font-bold tracking-widest py-1.5 px-4 hover:bg-white/20 dark:hover:bg-black/60 cursor-default">
              PHAGLP Scholar Campus
            </Badge>
          </div>

          {/* Profile Area */}
          <div className="relative p-6 pt-24 md:pt-8 pb-10 flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
            {/* Overlapping Avatar with Glowing Ring */}
            <div className="absolute -top-20 md:-top-28 left-1/2 -translate-x-1/2 md:left-10 md:translate-x-0 group">
              <div className="relative rounded-full border-4 border-white dark:border-slate-900 shadow-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 transition-all duration-500 hover:scale-105 hover:shadow-primary/20">
                <Avatar className="w-36 h-36 md:w-40 md:h-40 rounded-full">
                  <AvatarImage
                    src={dbUser?.image || ""}
                    alt={dbUser?.name || "User Avatar"}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-gradient-to-tr from-primary via-indigo-600 to-purple-600 text-white text-4xl font-black uppercase flex items-center justify-center">
                    {dbUser?.name
                      ? dbUser.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                      : "US"}
                  </AvatarFallback>
                </Avatar>

                {/* Decorative Camera Icon overlay */}
                <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 cursor-pointer">
                  <Camera className="w-7 h-7 text-white animate-bounce" />
                </div>
              </div>
            </div>

            {/* Profile Info Details */}
            <div className="text-center md:text-left md:pl-48 flex-1">
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2 justify-center md:justify-start">
                <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight flex items-center gap-2 justify-center md:justify-start">
                  <span>{dbUser?.name || "Academic Scholar"}</span>
                  <span
                    className="inline-flex items-center justify-center w-5 h-5 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full text-white shadow-md shadow-blue-500/20"
                    title="Verified Scholar"
                  >
                    <svg
                      className="w-3.5 h-3.5 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293l-4 4a1 1 0 01-1.414 0l-2-2a1 1 0 111.414-1.414L9 10.586l3.293-3.293a1 1 0 111.414 1.414z" />
                    </svg>
                  </span>
                </h1>

                {/* User Role Badge */}
                <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-extrabold py-0.5 px-3 rounded-full uppercase w-fit mx-auto md:mx-0 tracking-wider">
                  {dbUser?.role || "USER"}
                </Badge>
              </div>

              {/* Email & Tier Status details */}
              <div className="text-muted-foreground text-xs font-semibold mb-4 flex flex-wrap items-center justify-center md:justify-start gap-x-2.5 gap-y-1">
                <span className="hover:text-primary transition-colors cursor-pointer">
                  {dbUser?.email}
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="flex items-center gap-1">
                  {tier === SubscriptionTier.PRO && (
                    <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 shadow-sm font-extrabold text-[9px] py-0.5 px-2.5 tracking-wider">
                      PRO MEMBER
                    </Badge>
                  )}
                  {tier === SubscriptionTier.ENTERPRISE && (
                    <Badge className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-0 shadow-sm font-extrabold text-[9px] py-0.5 px-2.5 tracking-wider">
                      ENTERPRISE
                    </Badge>
                  )}
                  {tier === SubscriptionTier.BASIC && (
                    <Badge
                      variant="secondary"
                      className="bg-slate-100 dark:bg-slate-800 text-[9px] font-extrabold py-0.5 px-2.5 tracking-wider"
                    >
                      BASIC SCHOLAR
                    </Badge>
                  )}
                </span>
              </div>

              <p className="text-muted-foreground/90 text-sm leading-relaxed max-w-xl">
                Continue your intellectual journey through unified philosophical
                frameworks and scientific research.
              </p>
            </div>

            {/* Profile Action Buttons */}
            <div className="flex items-center gap-3 shrink-0 self-center md:self-end mt-6 md:mt-0">
              <CustomizeModal
                initialPreferences={preferences}
                availableCategories={availableCategories}
              />
              {tier === SubscriptionTier.BASIC && (
                <Button
                  asChild
                  size="sm"
                  className="bg-gradient-to-r from-primary to-indigo-600 text-white hover:from-primary/95 hover:to-indigo-650 rounded-2xl shadow-lg shadow-primary/20 font-bold px-5"
                >
                  <Link href="/pricing">Upgrade Platform</Link>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats Grid with Interactive Glows */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-slate-200/60 dark:border-slate-800/80 shadow-sm hover:shadow-md hover:shadow-primary/5 hover:-translate-y-1 hover:border-primary/30 dark:hover:border-primary/40 transition-all duration-300 rounded-2xl group">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">
                Enrolled Courses
              </CardTitle>
              <GraduationCap className="w-5 h-5 text-primary group-hover:scale-110 transition-transform duration-300" />
            </CardHeader>
            <CardContent>
              <div className="text-3.5xl font-black text-foreground tracking-tight">
                4
              </div>
              <p className="text-xs text-muted-foreground mt-1.5 font-medium">
                2 active learning modules this week
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-slate-200/60 dark:border-slate-800/80 shadow-sm hover:shadow-md hover:shadow-indigo-500/5 hover:-translate-y-1 hover:border-indigo-500/30 dark:hover:border-indigo-500/40 transition-all duration-300 rounded-2xl group">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">
                Completed Lessons
              </CardTitle>
              <BookOpen className="w-5 h-5 text-indigo-500 group-hover:scale-110 transition-transform duration-300" />
            </CardHeader>
            <CardContent>
              <div className="text-3.5xl font-black text-foreground tracking-tight">
                24
              </div>
              <p className="text-xs text-muted-foreground mt-1.5 font-medium">
                Across all global disciplines
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-slate-200/60 dark:border-slate-800/80 shadow-sm hover:shadow-md hover:shadow-amber-500/5 hover:-translate-y-1 hover:border-amber-500/30 dark:hover:border-amber-500/40 transition-all duration-300 rounded-2xl group">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">
                Lecture Feed Filters
              </CardTitle>
              <Sparkles className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform duration-300 animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="text-3.5xl font-black text-foreground tracking-tight">
                {preferences.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1.5 font-medium">
                {preferences.length > 0
                  ? "Personalized focus active"
                  : "Displaying all categories"}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-slate-200/60 dark:border-slate-800/80 shadow-sm hover:shadow-md hover:shadow-yellow-500/5 hover:-translate-y-1 hover:border-yellow-500/30 dark:hover:border-yellow-500/40 transition-all duration-300 rounded-2xl group">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">
                Active Platform Tier
              </CardTitle>
              <Trophy className="w-5 h-5 text-yellow-500 group-hover:scale-110 transition-transform duration-300" />
            </CardHeader>
            <CardContent>
              <div className="text-3.5xl font-black text-foreground tracking-tight capitalize">
                {tier.toLowerCase()}
              </div>
              <p className="text-xs text-muted-foreground mt-1.5 font-medium">
                Full curriculum accessible
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Personalized Lecture Focus Feed */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="space-y-1.5">
              <h2 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2.5">
                <Sparkles className="text-primary w-6 h-6 animate-pulse shrink-0" />
                My Customized Research & Lectures
              </h2>
              <p className="text-muted-foreground text-sm font-medium">
                Curated insights automatically aligned with your dashboard focus
                settings.
              </p>
            </div>
            {preferences.length > 0 && (
              <Badge className="bg-primary/10 text-primary border-primary/20 text-xs py-1 px-4 rounded-full font-bold tracking-wider w-fit shrink-0">
                Filtered Feed
              </Badge>
            )}
          </div>

          {customizedLectures.length === 0 ? (
            <Card className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white/30 dark:bg-slate-900/10 rounded-2xl shadow-sm">
              <BookOpen className="w-14 h-14 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
              <CardTitle className="text-xl font-bold mb-1.5">
                No matching lectures found
              </CardTitle>
              <CardDescription className="max-w-md mx-auto text-sm px-4 leading-relaxed">
                No lectures are currently published under your customized
                categories. Try editing your focus topics or writing a new one.
              </CardDescription>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {customizedLectures.slice(0, 6).map((lec) => (
                <Card
                  key={lec.id}
                  className="group hover:border-primary/45 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1.5 transition-all duration-300 rounded-3xl overflow-hidden flex flex-col justify-between bg-white dark:bg-slate-900 border-slate-200/60 dark:border-slate-800/80"
                >
                  <div>
                    <CardHeader className="pb-3.5">
                      <div className="flex items-center justify-between mb-3.5">
                        <Badge className="bg-primary/10 text-primary border-0 text-[10px] px-3 py-1 font-extrabold tracking-wider uppercase">
                          {lec.category}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {format(new Date(lec.createdAt), "MMM d, yyyy")}
                        </span>
                      </div>
                      <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                        {lec.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                        {lec.excerpt ||
                          lec.body.replace(/[#*`]/g, "").substring(0, 120) +
                            "..."}
                      </p>
                    </CardContent>
                  </div>
                  <CardFooter className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold">
                    <span className="text-muted-foreground">
                      by {lec.author?.name || "Anonymous"}
                    </span>
                    <Button
                      asChild
                      size="sm"
                      variant="ghost"
                      className="text-primary hover:text-primary/80 hover:bg-transparent p-0 h-auto font-extrabold flex items-center gap-1.5 transition-transform group-hover:translate-x-1 duration-300"
                    >
                      <Link href={`/lectures/${lec.slug}`}>Read Lecture →</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Interactive Technological Concepts Hub Banner */}
        <div className="mb-12 bg-gradient-to-r from-indigo-900/90 via-slate-900 to-blue-900/90 dark:from-indigo-950/80 dark:via-slate-950 dark:to-blue-950/80 border border-indigo-500/30 rounded-3xl p-8 relative overflow-hidden shadow-2xl shadow-indigo-500/5 group">
          <div className="absolute top-0 right-0 -mt-6 -mr-6 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-colors duration-500 animate-pulse" />
          <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors duration-500 animate-pulse" />
          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-extrabold uppercase tracking-widest text-[9px] px-3 py-1">
                  Exclusive Hub
                </Badge>
                <span className="text-[10px] text-indigo-400 font-extrabold flex items-center gap-1.5 tracking-wider">
                  <Sparkles
                    className="w-4 h-4 animate-spin text-indigo-400"
                    style={{ animationDuration: "5s" }}
                  />
                  Next-Gen Integration
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
                Interactive Competitive Technological Concepts
              </h2>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                Review and interact with our active integrations of Generative
                AI, Adaptive Pathing, Academic Digital Twins, Cryptographic
                Ledger Verification, VR/AR lectures, and Low Connectivity
                realignments.
              </p>
            </div>
            <Button
              asChild
              className="bg-gradient-to-r from-indigo-500 via-indigo-600 to-blue-600 text-white hover:from-indigo-600 hover:to-blue-700 font-bold rounded-2xl shadow-xl shadow-indigo-500/20 py-6 px-8 lg:shrink-0 transition-all duration-300 hover:scale-[1.02] active:scale-98 group-hover:translate-x-1"
            >
              <Link
                href="/dashboard/tech-concepts"
                className="flex items-center gap-2 tracking-wide text-sm font-extrabold"
              >
                Explore Tech Playground →
              </Link>
            </Button>
          </div>
        </div>

        {/* Interactive Implementation Plan Showcase Banner */}
        <div className="mb-12 bg-gradient-to-r from-emerald-900/90 via-slate-900 to-teal-900/90 dark:from-emerald-950/80 dark:via-slate-950 dark:to-teal-950/80 border border-emerald-500/30 rounded-3xl p-8 relative overflow-hidden shadow-2xl shadow-emerald-500/5 group">
          <div className="absolute top-0 right-0 -mt-6 -mr-6 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-colors duration-500 animate-pulse" />
          <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl group-hover:bg-teal-500/20 transition-colors duration-500 animate-pulse" />
          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-extrabold uppercase tracking-widest text-[9px] px-3 py-1">
                  System Roadmap
                </Badge>
                <span className="text-[10px] text-emerald-400 font-extrabold flex items-center gap-1.5 tracking-wider">
                  <ListTodo className="w-4 h-4 text-emerald-400" />
                  Interactive Progress Tracker
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
                PHAGLP — Interactive Implementation Plan
              </h2>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                Track our detailed structural engineering progress. Check off
                key tasks dynamically across Security, Core features, Quality
                Assurance, and visual Polish with local persistence.
              </p>
            </div>
            <Button
              asChild
              className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 font-bold rounded-2xl shadow-xl shadow-emerald-500/20 py-6 px-8 lg:shrink-0 transition-all duration-300 hover:scale-[1.02] active:scale-98 group-hover:translate-x-1"
            >
              <Link
                href="/implementation-plan"
                className="flex items-center gap-2 tracking-wide text-sm font-extrabold"
              >
                View Interactive Plan →
              </Link>
            </Button>
          </div>
        </div>

        {/* Ongoing Courses */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <h2 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2.5">
                <BookOpenCheck className="text-indigo-500 w-6 h-6 shrink-0" />
                Active Curriculums
              </h2>
              <p className="text-muted-foreground text-sm font-medium">
                Progress updates across your currently enrolled academy courses.
              </p>
            </div>
            <Button
              asChild
              size="sm"
              variant="outline"
              className="rounded-xl font-bold border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 px-4"
            >
              <Link href="/courses">Explore Catalog</Link>
            </Button>
          </div>

          <div className="grid gap-8">
            {ongoingCourses.map((course) => (
              <Card
                key={course.id}
                className="hover:shadow-lg hover:border-slate-300/50 dark:hover:border-slate-700/50 transition-all duration-300 rounded-3xl bg-white dark:bg-slate-900 border-slate-200/60 dark:border-slate-800/80 overflow-hidden"
              >
                <CardHeader className="pb-4 pt-6 px-6 md:px-8">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      <CardTitle className="flex flex-wrap items-center gap-2 text-xl font-extrabold text-foreground">
                        {course.name}
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-0 font-bold py-0.5 px-3 rounded-full text-xs tracking-wider">
                          {course.progress}% Complete
                        </Badge>
                      </CardTitle>
                      <CardDescription className="font-semibold text-xs text-muted-foreground/80">
                        Instructor: {course.instructor}
                      </CardDescription>
                    </div>
                    <Button
                      size="sm"
                      asChild
                      className="bg-primary text-white hover:bg-primary/95 rounded-2xl shadow-md font-bold px-5 shrink-0 transition-transform active:scale-95 duration-200"
                    >
                      <Link
                        href={`/courses`}
                        className="flex items-center gap-2"
                      >
                        <PlayCircle className="w-4 h-4" />
                        Resume Module
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pb-6 px-6 md:px-8">
                  {/* Glowing dynamic progress bar */}
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden relative shadow-inner">
                    <div
                      className="bg-gradient-to-r from-primary via-indigo-500 to-purple-600 h-full rounded-full transition-all duration-700 animate-pulse"
                      style={{
                        width: `${course.progress}%`,
                        animationDuration: "8s",
                      }}
                    />
                  </div>
                  <div className="mt-3.5 text-xs text-muted-foreground font-semibold flex items-center justify-between">
                    <span>
                      Next topic:{" "}
                      <strong className="text-foreground">
                        {course.lastLesson}
                      </strong>
                    </span>
                    <span className="tracking-wide uppercase font-bold text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-500 py-0.5 px-2 rounded-md">
                      Self-paced
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Achievements & Certifications */}
        <div className="mb-12 mt-16">
          <div className="flex items-center gap-2.5 mb-8">
            <Trophy className="text-amber-500 w-7 h-7 shrink-0 animate-bounce" />
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
                Academic Achievements & Certifications
              </h2>
              <p className="text-muted-foreground text-sm font-medium">
                Verify, print, and share your calligraphic completion
                credentials.
              </p>
            </div>
          </div>

          {certificates.length === 0 ? (
            <Card className="text-center py-16 border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white/30 dark:bg-slate-900/10 rounded-3xl">
              <Trophy className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
              <CardTitle className="text-lg font-bold mb-1">
                No certificates issued yet
              </CardTitle>
              <CardDescription className="max-w-md mx-auto text-xs px-4 leading-relaxed">
                Complete all course modules and pass review examinations to
                unlock your calligraphic credential certifications here.
              </CardDescription>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {certificates.map((cert: any) => (
                <Card
                  key={cert.id}
                  className="hover:shadow-lg hover:border-amber-500/30 transition-all duration-300 rounded-3xl bg-white dark:bg-slate-900 border-slate-200/60 dark:border-slate-800/80 overflow-hidden flex flex-col justify-between group"
                >
                  <CardHeader className="pb-4 pt-6 px-6 md:px-8 flex flex-row items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      <CardTitle className="text-lg font-extrabold text-foreground line-clamp-1">
                        {cert.course.title}
                      </CardTitle>
                      <CardDescription className="text-xs font-semibold text-muted-foreground">
                        Issued:{" "}
                        {format(new Date(cert.issueDate), "MMM d, yyyy")}
                      </CardDescription>
                    </div>
                    <div className="w-10 h-10 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500 shrink-0">
                      <Sparkles className="w-5 h-5 animate-pulse" />
                    </div>
                  </CardHeader>
                  <CardContent className="pb-6 px-6 md:px-8 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-4">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                        Verification Code
                      </span>
                      <p className="text-sm font-bold text-foreground font-mono">
                        {cert.certificateCode}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      asChild
                      className="bg-emerald-650 hover:bg-emerald-700 text-white rounded-xl shadow-sm font-bold px-4"
                    >
                      <Link href={`/certificates/${cert.certificateCode}`}>
                        Verify Certificate
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
