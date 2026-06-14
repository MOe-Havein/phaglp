import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { requireRole } from "@/lib/rbac";
import { auth } from "@/auth";
import { sectionSchema } from "@/lib/homepage/sectionSchema";
import { logger } from "@/lib/server/logger";
import { revalidatePath } from "next/cache";
import { HomepageSection } from "@/types/homepage"; // 🆕 Import your strict type array

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rawSections = await prisma.homepageSection.findMany({
      where: { visible: true },
      orderBy: { order: "asc" },
    });

    // 🆕 Cast generic prisma strings explicitly to your strict HomepageSection union
    const sections = rawSections as unknown as HomepageSection[];

    return NextResponse.json(sections);
  } catch (error: any) {
    logger.error("Failed to fetch homepage sections", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    // Protected route
    const session = await auth();
    const hasAccess = await requireRole(["ADMIN"]);
    if (!hasAccess) throw new Error("UNAUTHORIZED");

    const body = await req.json();
    const validatedData = sectionSchema.parse(body);

    // Strip undefined properties to comply with exactOptionalPropertyTypes
    const createData = Object.fromEntries(
      Object.entries(validatedData).filter(([_, v]) => v !== undefined),
    ) as any;

    const rawSection = await prisma.homepageSection.create({
      data: createData,
    });

    // 🆕 Typecast individual response item for mutation return integrity
    const section = rawSection as unknown as HomepageSection;

    revalidatePath("/");
    logger.info("SECTION_CREATED", {
      sectionId: section.id,
      userId: session?.user?.id,
    });

    return NextResponse.json(section, { status: 201 });
  } catch (error: any) {
    if (error.message === "UNAUTHENTICATED") {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation Error", details: error.errors },
        { status: 400 },
      );
    }

    logger.error("Failed to create homepage section", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
