import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { AI_MODEL_MAP, DEFAULT_AI_MODEL_ID } from "@/lib/ai-models";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { lecturePreferences: true, aiModel: true },
    });

    const aiModel =
      user?.aiModel && AI_MODEL_MAP[user.aiModel]
        ? user.aiModel
        : DEFAULT_AI_MODEL_ID;

    return NextResponse.json({
      preferences: user?.lecturePreferences || [],
      aiModel,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { preferences, aiModel } = body;

    const data: {
      lecturePreferences?: Prisma.InputJsonValue;
      aiModel?: string;
    } = {};

    if (Array.isArray(preferences)) {
      data.lecturePreferences = preferences as Prisma.InputJsonValue;
    }

    if (typeof aiModel === "string") {
      // Only persist known model ids; ignore anything else.
      data.aiModel = AI_MODEL_MAP[aiModel] ? aiModel : DEFAULT_AI_MODEL_ID;
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data,
      select: { lecturePreferences: true, aiModel: true },
    });

    return NextResponse.json({
      success: true,
      preferences: updatedUser.lecturePreferences,
      aiModel: updatedUser.aiModel,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
