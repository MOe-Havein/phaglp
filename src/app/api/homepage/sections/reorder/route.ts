import { NextResponse } from "next/server"
import prisma from "@/lib/db/prisma"
import { requireRole } from "@/lib/rbac"
import { auth } from "@/auth"
import { logger } from "@/lib/server/logger"
import { revalidatePath } from "next/cache"

export async function PATCH(req: Request) {
  try {
    const session = await auth()
    const hasAccess = await requireRole(["ADMIN"])
    if (!hasAccess) throw new Error("UNAUTHORIZED")
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

    revalidatePath("/")
    logger.info("SECTION_REORDERED", { orderedIds, userId: session?.user?.id })

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
