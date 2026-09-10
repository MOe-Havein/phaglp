import { prisma } from "@/lib/prisma";

/**
 * Pure Data Access Layer for Lectures
 */
export const LectureRepository = {
  async getLatestPublished(limit: number) {
    return prisma.lecture.findMany({
      where: {
        published: true,
      },
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        slug: true,
        body: true,
        category: true,
        createdAt: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    });
  },

  async findBySlug(slug: string) {
    return prisma.lecture.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });
  },
};
