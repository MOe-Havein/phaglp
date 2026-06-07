import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { getCourseProgress } from "@/lib/certificate-actions";
import { CoursePlayer } from "@/components/courses/course-player";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface PlayerPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CoursePlayerPage({ params }: PlayerPageProps) {
  const { slug } = await params;
  const session = await auth();
  const user = session?.user;

  // 1. Authenticate user
  if (!user || !user.id) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-950 px-4">
        <Card className="max-w-md w-full border-slate-800 bg-slate-900 shadow-xl rounded-3xl p-6 text-center text-slate-100">
          <GraduationCap className="w-16 h-16 text-primary mx-auto mb-4 animate-bounce" />
          <h2 className="text-2xl font-bold mb-2">Scholar Classroom Access</h2>
          <p className="text-slate-400 text-sm mb-6">
            Please log in or register to access this classroom, review lessons,
            and earn certificates.
          </p>
          <Button
            asChild
            className="w-full bg-primary text-white hover:bg-primary/95 rounded-xl shadow-md font-semibold"
          >
            <Link href="/login">Log In to Access Classroom</Link>
          </Button>
        </Card>
      </div>
    );
  }

  // 2. Fetch course details
  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      modules: {
        include: {
          lessons: {
            orderBy: { order: "asc" },
          },
        },
        orderBy: { order: "asc" },
      },
      enrollments: {
        where: { userId: user.id },
      },
    },
  });

  if (!course) {
    notFound();
  }

  // 3. Security Gate: Verify enrollment
  const isEnrolled = course.enrollments.length > 0;
  if (!isEnrolled) {
    // Redirect to normal course detail page
    redirect(`/courses/${slug}`);
  }

  // 4. Retrieve course progress
  const progressResult = await getCourseProgress(user.id, course.id);
  const percent =
    progressResult.success && progressResult.data
      ? progressResult.data.percent
      : 0;
  const completedLessonIds =
    progressResult.success && progressResult.data
      ? progressResult.data.completedLessonIds || []
      : [];

  return (
    <CoursePlayer
      userId={user.id}
      course={{
        id: course.id,
        title: course.title,
        slug: course.slug,
      }}
      modules={course.modules}
      initialCompletedLessonIds={completedLessonIds}
      initialPercent={percent}
    />
  );
}
