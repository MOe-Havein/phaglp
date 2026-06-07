"use server";

import { prisma, safeDbQuery } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function enrollInCourse(courseId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      error: "You must be logged in to enroll in a course.",
    };
  }

  const userId = session.user.id;

  return await safeDbQuery(async () => {
    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new Error("Course not found.");
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      throw new Error("You are already enrolled in this course.");
    }

    // Create enrollment
    await prisma.enrollment.create({
      data: {
        userId,
        courseId,
      },
    });

    revalidatePath(`/courses/${course.slug}`);
    revalidatePath("/dashboard");

    return { success: true };
  });
}

export async function getEnrolledCourses() {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: true, data: [] };
  }

  const result = await safeDbQuery(async () => {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: session.user.id },
      include: {
        course: {
          include: {
            instructor: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return enrollments.map((e) => e.course);
  }, []);

  return result;
}
