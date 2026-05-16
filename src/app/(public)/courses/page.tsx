import prisma, { safeDbQuery } from "@/lib/prisma"
import { CourseCard } from "@/components/cards/course-card"
import { unstable_cache } from "next/cache"

// Handle database states safely at runtime
export const dynamic = "force-dynamic"

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
      })
    }, [])
    return result.data || []
  },
  ["public-courses"],
  { tags: ["courses"], revalidate: 300 },
)

export default async function CoursesPage() {
  let courses: any[] = []
  try {
    courses = await getCachedCourses()
  } catch (error) {
    console.error("Failed to fetch cached courses:", error)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mb-12">
        <h1 className="text-4xl font-bold mb-4">Philosophical Courses</h1>
        <p className="text-lg text-muted-foreground">
          Discover our curated selection of courses designed to bridge ancient wisdom with modern
          scientific thought.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {courses.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed">
            <p className="text-muted-foreground">No courses have been published yet.</p>
          </div>
        ) : (
          courses.map((course: any) => (
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
            />
          ))
        )}
      </div>
    </div>
  )
}
