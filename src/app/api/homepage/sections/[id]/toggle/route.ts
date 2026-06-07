import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { requireRole } from "@/lib/rbac";
import { auth } from "@/auth";
import { logger } from "@/lib/server/logger";

export async function PATCH(
  _req: Request,
  props: { params: Promise<{ id: string }> },
) {
  try {
    const params = await props.params;
    const session = await auth();
    const hasAccess = await requireRole(["ADMIN"]);
    if (!hasAccess) throw new Error("UNAUTHORIZED");

    // First fetch the current section to get its visibility status
    const currentSection = await prisma.homepageSection.findUnique({
      where: { id: params.id },
      select: { visible: true },
    });

    if (!currentSection) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 });
    }

    const updatedSection = await prisma.homepageSection.update({
      where: { id: params.id },
      data: { visible: !currentSection.visible },
    });

    logger.info("SECTION_VISIBILITY_CHANGED", {
      sectionId: params.id,
      visible: updatedSection.visible,
      userId: session?.user?.id,
    });

    return NextResponse.json(updatedSection);
  } catch (error: any) {
    if (error.message === "UNAUTHENTICATED")
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    if (error.message === "UNAUTHORIZED")
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    if (error.code === "P2025")
      return NextResponse.json({ error: "Section not found" }, { status: 404 });

    logger.error("Failed to toggle section visibility", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
