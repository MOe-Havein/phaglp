import { NextResponse } from "next/server"
import prisma from "@/lib/db/prisma"
import { requireRole } from "@/lib/rbac"
import { updateSectionSchema } from "@/lib/homepage/sectionSchema"
import { logger } from "@/lib/server/logger"

export async function GET(_req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params
    const section = await prisma.homepageSection.findUnique({
      where: { id: params.id },
    })

    if (!section) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 })
    }

    return NextResponse.json(section)
  } catch (error: any) {
    logger.error("Failed to fetch section", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params
    const session = await requireRole(["ADMIN", "EDITOR"])
    const body = await req.json()
    const validatedData = updateSectionSchema.parse(body)

    const section = await prisma.homepageSection.update({
      where: { id: params.id },
      data: validatedData,
    })

    logger.info("SECTION_UPDATED", { sectionId: section.id, userId: session.userId })

    return NextResponse.json(section)
  } catch (error: any) {
    if (error.message === "UNAUTHENTICATED")
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 })
    if (error.message === "UNAUTHORIZED")
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    if (error.name === "ZodError")
      return NextResponse.json(
        { error: "Validation Error", details: error.errors },
        { status: 400 },
      )
    if (error.code === "P2025")
      return NextResponse.json({ error: "Section not found" }, { status: 404 })

    logger.error("Failed to update section", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(_req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params
    const session = await requireRole(["ADMIN"])

    await prisma.homepageSection.delete({
      where: { id: params.id },
    })

    logger.info("SECTION_DELETED", { sectionId: params.id, userId: session.userId })

    return new NextResponse(null, { status: 204 })
  } catch (error: any) {
    if (error.message === "UNAUTHENTICATED")
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 })
    if (error.message === "UNAUTHORIZED")
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    if (error.code === "P2025")
      return NextResponse.json({ error: "Section not found" }, { status: 404 })

    logger.error("Failed to delete section", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
