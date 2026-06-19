import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { requireRole } from "@/lib/rbac";
import { auth } from "@/auth";
import { logger } from "@/lib/server/logger";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// 🆕 Runtime Zod validation block protecting parameter boundaries
const reorderSchema = z.object({
  orderedIds: z.array(z.string().min(1, "Section ID cannot be empty string")),
});

export async function PATCH(req: Request) {
  try {
    // 1. Authorization Safeguard Interceptor
    const session = await auth();
    const hasAccess = await requireRole(["ADMIN"]);
    if (!hasAccess) throw new Error("UNAUTHORIZED");

    // 2. Parse and Validate Inbound Request Payload JSON
    const body = await req.json();
    const parsedPayload = reorderSchema.safeParse(body);

    if (!parsedPayload.success) {
      return NextResponse.json(
        {
          error: "Validation Error",
          details: parsedPayload.error.errors.map((err) => err.message),
        },
        { status: 400 },
      );
    }

    const { orderedIds } = parsedPayload.data;

    // 3. Database Execution: Batch Atomic Mutation Transaction Block
    // Updates layout sequences cleanly in a single transaction path
    await prisma.$transaction(
      orderedIds.map((id: string, index: number) =>
        prisma.homepageSection.update({
          where: { id },
          data: { order: index },
        }),
      ),
    );

    // 4. Invalidation: Purge edge layouts dynamically
    revalidatePath("/", "layout"); // 🆕 Explicitly purges down nested tree structural elements

    // 5. Activity Telemetry Audit Log
    logger.info("SECTION_REORDERED", {
      count: orderedIds.length,
      userId: session?.user?.id,
    });

    return NextResponse.json({
      success: true,
      message: "Sections reordered successfully",
    });
  } catch (error: any) {
    if (error.message === "UNAUTHENTICATED") {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    logger.error("Failed to reorder sections", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
