import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, GraduationCap, BookOpen } from "lucide-react";
import { MarkdownViewer } from "@/components/editor/markdown-viewer";
import { auth } from "@/auth";
import { EnrollButton } from "@/features/courses/components/enroll-button";
import { getFoxyCartUrl } from "@/lib/foxy";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      instructor: {
        select: {
          name: true,
          image: true,
        },
      },
      modules: {
        include: {
          lessons: true,
        },
        orderBy: {
          order: "asc",
        },
      },
      enrollments: session?.user?.id
        ? {
            where: {
              userId: session.user.id,
            },
          }
        : false,
      _count: {
        select: {
          enrollments: true,
        },
      },
    },
  });

  if (!course) {
    notFound();
  }

  const isEnrolled = course.enrollments?.length > 0;

  const foxyUrl =
    course.price > 0
      ? getFoxyCartUrl({
          code: course.id,
          name: course.title,
          price: course.price,
          userId: session?.user?.id || undefined,
          userEmail: session?.user?.email || undefined,
        })
      : undefined;

  return (
    <div className="bg-background">
      {/* ... existing hero header content ... */}

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">About this course</h2>
              <div className="prose prose-slate dark:prose-invert max-w-none bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                <MarkdownViewer
                  value={
                    course.description || "No detailed description provided."
                  }
                />
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">What you'll learn</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "Deep understanding of core principles",
                  "Practical application techniques",
                  "Historical context and evolution",
                  "Critical analysis and reasoning",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 p-3 rounded-lg border border-slate-50 bg-slate-50/30"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Course Content</h2>
              <div className="space-y-3">
                {course.modules.length === 0 ? (
                  <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/50 rounded-xl border-2 border-dashed">
                    <BookOpen className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-20" />
                    <p className="text-muted-foreground italic">
                      Course curriculum is currently being finalized.
                    </p>
                  </div>
                ) : (
                  course.modules.map((module, i) => (
                    <div
                      key={module.id}
                      className="border rounded-xl p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-primary font-bold font-mono">
                          {(i + 1).toString().padStart(2, "0")}
                        </span>
                        <span className="font-semibold text-lg">
                          {module.title}
                        </span>
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-none"
                      >
                        {module.lessons.length} lessons
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </section>

            <div className="mt-12 p-8 bg-blue-50/50 dark:bg-blue-950/10 rounded-2xl border border-blue-100 dark:border-blue-900/30">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-primary" />
                Your Instructor
              </h3>
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center border-2 border-primary/20">
                  <GraduationCap className="w-10 h-10 text-primary" />
                </div>
                <div>
                  <div className="font-bold text-xl">
                    {course.instructor.name}
                  </div>
                  <p className="text-muted-foreground">
                    Lead Academic Instructor at PHAGLP
                  </p>
                  <p className="text-sm mt-2 text-slate-600 dark:text-slate-400 max-w-md">
                    Dedicated to bringing rigorous philosophical inquiry and
                    scientific methodology to modern life planning.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Action */}
          <div className="lg:col-span-1">
            <div className="border rounded-2xl p-8 sticky top-24 shadow-sm bg-background border-slate-200 dark:border-slate-800">
              <div className="text-4xl font-bold mb-8 text-primary dark:text-blue-400">
                {course.price === 0 ? "Free" : `$${course.price.toFixed(2)}`}
              </div>
              <EnrollButton
                courseId={course.id}
                isEnrolled={isEnrolled}
                price={course.price}
                courseSlug={course.slug}
                foxyUrl={foxyUrl}
              />
              <Button variant="outline" size="lg" className="w-full mb-8 h-12">
                Preview Course
              </Button>
              <div className="space-y-4">
                <h4 className="font-semibold text-sm uppercase tracking-wider text-slate-500">
                  Includes:
                </h4>
                <div className="text-sm text-slate-600 dark:text-slate-400 space-y-3">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-4 h-4 text-emerald-500" />
                    <span>Full lifetime access</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>Certificate of completion</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-emerald-500" />
                    <span>{course.duration || "Self-paced"} learning</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Course",
            name: course.title,
            description: course.shortDescription || course.title,
            provider: {
              "@type": "Organization",
              name: "PHAGLP",
              sameAs: "https://phaglp.com"
            },
            hasCourseInstance: {
              "@type": "CourseInstance",
              courseMode: "online",
              courseWorkload: "PT10H"
            },
            offers: {
              "@type": "Offer",
              price: course.price,
              priceCurrency: "USD",
              category: "Paid"
            }
          }).replace(/</g, "\\u003c"),
        }}
      />
    </div>
  );
}
