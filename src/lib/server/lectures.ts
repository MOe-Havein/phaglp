import "server-only";
import { prisma, safeDbQuery } from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import { slugify } from "@/lib/utils";
import readingTime from "reading-time";

export interface LectureData {
  title: string;
  body: string;
  excerpt?: string;
  category: string;
  tags: string[];
  authorId: string;
  published?: boolean;
  coverImage?: string | null;
  isFeatured?: boolean;
}

export async function getLectureBySlug(slug: string) {
  return unstable_cache(
    async () => {
      const result = await safeDbQuery(async () => {
        return prisma.lecture.findUnique({
          where: { slug },
          include: { author: true },
        });
      });
      return result.data;
    },
    [`lecture-${slug}`],
    { tags: ["lectures"], revalidate: 300 },
  )();
}

export async function createLecture(data: LectureData) {
  const slug = await generateUniqueSlug(data.title);
  const stats = readingTime(data.body);

  return prisma.lecture.create({
    data: {
      ...data,
      slug,
      readingTime: Math.ceil(stats.minutes),
    },
  });
}

export async function updateLecture(id: string, data: Partial<LectureData>) {
  const existing = await prisma.lecture.findUnique({ where: { id } });
  if (!existing) throw new Error("Lecture not found");

  // Create revision
  await prisma.lectureRevision.create({
    data: {
      lectureId: existing.id,
      title: existing.title,
      body: existing.body,
      authorId: existing.authorId,
    },
  });

  const updateData: any = { ...data };
  if (data.body) {
    const stats = readingTime(data.body);
    updateData.readingTime = Math.ceil(stats.minutes);
  }

  if (data.title && data.title !== existing.title) {
    updateData.slug = await generateUniqueSlug(data.title);
  }

  return prisma.lecture.update({
    where: { id },
    data: updateData,
  });
}

async function generateUniqueSlug(title: string) {
  let slug = slugify(title);
  let counter = 1;

  const MAX_ATTEMPTS = 100;

  while (counter < MAX_ATTEMPTS) {
    const existing = await prisma.lecture.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!existing) return slug;

    slug = `${slugify(title)}-${counter}`;
    counter++;
  }

  throw new Error("Could not generate a unique slug after 100 attempts");
}
