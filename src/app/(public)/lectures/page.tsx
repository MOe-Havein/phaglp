import prisma, { safeDbQuery } from "@/lib/prisma";
import { LectureCard } from "@/components/cards/lecture-card";
import { format } from "date-fns";
import { unstable_cache } from "next/cache";

// Handle database states safely at runtime
export const dynamic = "force-dynamic";

// Next.js unstable_cache completely handles the 300s cache window natively
const getCachedLectures = unstable_cache(
  async () => {
    const result = await safeDbQuery(async () => {
      return prisma.lecture.findMany({
        where: {
          published: true,
        },
        include: {
          author: {
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

    return result.data || [];
  },
  ["public-lectures"],
  { tags: ["lectures"], revalidate: 300 }, // Refreshes automatically every 300 seconds
);

export default async function LecturesPage() {
  let lectures: any[] = [];
  try {
    lectures = await getCachedLectures();
  } catch (error) {
    console.error("Failed to fetch cached lectures:", error);
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mb-12">
        <h1 className="text-4xl font-bold mb-4">Lectures & Research</h1>
        <p className="text-lg text-muted-foreground">
          Explore deep philosophical insights, scientific research, and
          educational updates from the PHAGLP community.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {lectures.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed">
            <p className="text-muted-foreground">
              No lectures have been published yet.
            </p>
          </div>
        ) : (
          lectures.map((lecture: any) => (
            <LectureCard
              key={lecture.id}
              title={lecture.title}
              slug={lecture.slug}
              author={lecture.author?.name || "Anonymous"}
              category={lecture.category}
              excerpt={
                lecture.excerpt || lecture.body.substring(0, 150) + "..."
              }
              publishedAt={format(new Date(lecture.createdAt), "MMMM d, yyyy")}
              tags={lecture.tags}
              coverImage={lecture.coverImage || undefined}
              isFeatured={lecture.isFeatured}
              readingTime={lecture.readingTime || undefined}
            />
          ))
        )}
      </div>
    </div>
  );
}
