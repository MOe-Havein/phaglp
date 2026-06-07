import { NextResponse } from "next/server";
import { prisma, safeDbQuery } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = await safeDbQuery(async () => {
    return prisma.lecture.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 6,
      include: {
        author: true,
      },
    });
  }, []);

  if (!result.success) {
    return NextResponse.json(
      { success: false, error: result.error || "Failed to fetch posts" },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
    data: result.data || [],
  });
}
