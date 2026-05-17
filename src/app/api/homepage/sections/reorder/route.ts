import { NextResponse } from "next/server"
import prisma from "@/lib/db/prisma"
import { requireRole } from "@/lib/rbac"
import { logger } from "@/lib/server/logger"

export async function PATCH(req: Request) {
  try {
    const session = await requireRole(["ADMIN", "EDITOR"])
    const body = await req.json()

    if (!body || !Array.isArray(body.orderedIds)) {
      return NextResponse.json(
        { error: "Validation Error: orderedIds array is required" },
        { status: 400 },
      )
    }

    const { orderedIds } = body

    // Transaction to update all orders
    await prisma.$transaction(
      orderedIds.map((id: string, index: number) =>
        prisma.homepageSection.update({
          where: { id },
          data: { order: index },
        }),
      ),
    )

    logger.info("SECTION_REORDERED", { orderedIds, userId: session.userId })

    return NextResponse.json({ success: true, message: "Sections reordered successfully" })
  } catch (error: any) {
    if (error.message === "UNAUTHENTICATED")
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 })
    if (error.message === "UNAUTHORIZED")
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

    logger.error("Failed to reorder sections", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
