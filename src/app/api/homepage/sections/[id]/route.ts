import { NextResponse } from "next/server"
import prisma from "@/lib/db/prisma"
import { requireRole } from "@/lib/rbac"
import { auth } from "@/auth"
import { updateSectionSchema } from "@/lib/homepage/sectionSchema"
import { logger } from "@/lib/server/logger"
import { revalidatePath } from "next/cache"

export const dynamic = "force-dynamic"

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
    const session = await auth()
    const hasAccess = await requireRole(["ADMIN"])
    if (!hasAccess) throw new Error("UNAUTHORIZED")
    const body = await req.json()
    const validatedData = updateSectionSchema.parse(body)

    // Strip undefined properties to comply with exactOptionalPropertyTypes
    const updateData = Object.fromEntries(
      Object.entries(validatedData).filter(([_, v]) => v !== undefined),
    ) as any

    const section = await prisma.homepageSection.update({
      where: { id: params.id },
      data: updateData,
    })

    revalidatePath("/")
    logger.info("SECTION_UPDATED", { sectionId: section.id, userId: session?.user?.id })

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
    const session = await auth()
    const hasAccess = await requireRole(["ADMIN"])
    if (!hasAccess) throw new Error("UNAUTHORIZED")

    await prisma.homepageSection.delete({
      where: { id: params.id },
    })

    revalidatePath("/")
    logger.info("SECTION_DELETED", { sectionId: params.id, userId: session?.user?.id })

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
