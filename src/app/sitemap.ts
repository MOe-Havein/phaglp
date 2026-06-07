import { MetadataRoute } from "next";
import { prisma, safeDbQuery } from "@/lib/prisma";
import { siteConfig } from "@/config/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.siteUrl;

  // Base routes
  const routes = [
    "",
    "/courses",
    "/lectures",
    "/blog",
    "/pricing",
    "/contact",
    "/login",
    "/register",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // Dynamic routes from DB
  const lecturesResult = await safeDbQuery(async () => {
    return prisma.lecture.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    });
  }, []);

  const pagesResult = await safeDbQuery(async () => {
    return prisma.page.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    });
  }, []);

  const coursesResult = await safeDbQuery(async () => {
    return prisma.course.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    });
  }, []);

  const lectureUrls = (lecturesResult.data || []).map((lecture: any) => ({
    url: `${baseUrl}/lectures/${lecture.slug}`,
    lastModified: new Date(lecture.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const blogUrls = (lecturesResult.data || []).map((lecture: any) => ({
    url: `${baseUrl}/blog/${lecture.slug}`,
    lastModified: new Date(lecture.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const pageUrls = (pagesResult.data || []).map((page: any) => ({
    url: `${baseUrl}/${page.slug}`,
    lastModified: new Date(page.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  const courseUrls = (coursesResult.data || []).map((course: any) => ({
    url: `${baseUrl}/courses/${course.slug}`,
    lastModified: new Date(course.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...routes, ...lectureUrls, ...blogUrls, ...pageUrls, ...courseUrls];
}
