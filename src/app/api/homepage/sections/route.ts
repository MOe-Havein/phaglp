import { NextResponse } from "next/server"
import prisma from "@/lib/db/prisma"
import { requireRole } from "@/lib/rbac"
import { sectionSchema } from "@/lib/homepage/sectionSchema"
import { logger } from "@/lib/server/logger"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const sections = await prisma.homepageSection.findMany({
      where: { visible: true },
      orderBy: { order: "asc" },
    })
    return NextResponse.json(sections)
  } catch (error: any) {
    logger.error("Failed to fetch homepage sections", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    // Protected route
    const session = await requireRole(["ADMIN", "EDITOR"])

    const body = await req.json()
    const validatedData = sectionSchema.parse(body)

    const section = await prisma.homepageSection.create({
      data: validatedData,
    })

    logger.info("SECTION_CREATED", { sectionId: section.id, userId: session.userId })

    return NextResponse.json(section, { status: 201 })
  } catch (error: any) {
    if (error.message === "UNAUTHENTICATED") {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 })
    }
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation Error", details: error.errors },
        { status: 400 },
      )
    }

    logger.error("Failed to create homepage section", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
