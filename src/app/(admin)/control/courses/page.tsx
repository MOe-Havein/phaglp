import { Suspense } from "react"
import { BookOpen, Plus } from "lucide-react"
import Link from "next/link"
import { prisma, serializePrisma } from "@/lib/prisma"

export const metadata = {
  title: "Courses — PHAGLP Control",
}

async function getCourses() {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        instructor: { select: { id: true, name: true, email: true } },
        _count: { select: { enrollments: true, modules: true } },
      },
    })
    return serializePrisma(courses)
  } catch {
    return []
  }
}

async function CoursesTable() {
  const courses = await getCourses()
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-900">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-700">
              <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">Title</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">Instructor</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">Type</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600 dark:text-gray-400">Price</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600 dark:text-gray-400">Enrolled</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">Status</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600 dark:text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-16 text-center text-gray-400">
                  <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No courses yet</p>
                </td>
              </tr>
            ) : (
              courses.map((course: any) => (
                <tr
                  key={course.id}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white max-w-[220px] truncate">
                    {course.title}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    {course.instructor?.name ?? course.instructor?.email ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {course.courseType?.replace(/_/g, " ")}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-gray-700 dark:text-gray-300">
                    ${Number(course.price).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-gray-700 dark:text-gray-300">
                    {course._count?.enrollments ?? 0}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                      course.published
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                        : "bg-gray-100 text-gray-500 dark:bg-gray-800"
                    }`}>
                      {course.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/control/courses/${course.id}`}
                      className="text-xs text-blue-500 hover:text-blue-600 font-medium transition-colors"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {courses.length > 0 && (
        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800/60 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500">{courses.length} course{courses.length !== 1 ? "s" : ""}</p>
        </div>
      )}
    </div>
  )
}

export default async function CoursesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Curriculum</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Courses</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Academy courses and their enrollment stats.
          </p>
        </div>
        <Link
          href="/control/courses/new"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-violet-600 hover:bg-violet-700 text-white transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Course
        </Link>
      </div>

      <Suspense
        fallback={
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-12 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
            ))}
          </div>
        }
      >
        <CoursesTable />
      </Suspense>
    </div>
  )
}
