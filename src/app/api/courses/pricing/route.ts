import { NextResponse } from "next/server";
import { prisma, safeDbQuery } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = await safeDbQuery(async () => {
    return prisma.course.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      include: {
        instructor: {
          select: {
            name: true,
          },
        },
      },
    });
  }, []);

  if (!result.success) {
    return NextResponse.json(
      { success: false, error: result.error || "Failed to fetch courses" },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
    data: result.data || [],
  });
}
