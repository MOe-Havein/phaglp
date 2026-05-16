import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

// GET: Fetch all feature flags
export async function GET() {
  try {
    const features = await prisma.featureFlag.findMany({
      orderBy: { key: "asc" },
    })
    return NextResponse.json(features)
  } catch {
    return NextResponse.json({ error: "Failed to fetch feature flags" }, { status: 500 })
  }
}

// POST: Toggle or Update a feature flag
export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { id, isEnabled } = body

    const feature = await prisma.featureFlag.update({
      where: { id },
      data: { isEnabled },
    })

    return NextResponse.json(feature)
  } catch {
    return NextResponse.json({ error: "Failed to update feature flag" }, { status: 500 })
  }
}
