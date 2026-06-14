import { prisma, safeDbQuery } from "@/lib/prisma";
import { unstable_cache, revalidateTag } from "next/cache";

export interface LectureSummary {
  id: string;
  title: string;
  slug: string;
  body: string;
  category: string;
  createdAt: string;
  author: {
    name: string | null;
  };
}

export interface MutationResult {
  success: boolean;
  error?: string;
}

/**
 * Fetches the latest published lectures from the database.
 * Optimized for performance and intended for use in Server Components.
 * Uses safeDbQuery to prevent serialization issues and handle outages.
 *
 * @param limit Number of lectures to fetch (default 3)
 * @returns Array of lectures with basic info
 */
export async function getLatestLectures(
  limit: number = 3,
): Promise<LectureSummary[]> {
  const fetcher = unstable_cache(
    async () => {
      const result = await safeDbQuery(async () => {
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
      }, []);

      return (result.data as any) || [];
    },
    [`latest-lectures-${limit}`],
    { tags: ["lectures"], revalidate: 300 },
  );

  return fetcher();
}

/**
 * Permanently deletes a lecture by its unique identifier.
 * Wraps execution inside safeDbQuery to prevent catastrophic engine failures.
 * Automatically clears the 'lectures' cache tag upon successful operations.
 *
 * @param id The unique identifier string of the lecture targeted for deletion
 * @returns An object indicating operational status and optional error feedback strings
 */
export async function deleteLecture(id: string): Promise<MutationResult> {
  if (!id) {
    return { success: false, error: "Lecture ID is strictly required." };
  }

  const result = await safeDbQuery(async () => {
    return prisma.lecture.delete({
      where: {
        id,
      },
    });
  }, null);

  if (!result.success) {
    return {
      success: false,
      error: result.error?.message || "Failed to successfully delete the target lecture entry.",
    };
  }

  // Purge the unstable_cache instances bound to the 'lectures' tag across all routes
  revalidateTag("lectures");

  return { success: true };
}
