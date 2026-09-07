import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import {
  generateOutline,
  summarizeContent,
  checkLogicalFallacies,
  writeLecture,
} from "@/lib/ai-assistant";
import { DEFAULT_AI_MODEL_ID } from "@/lib/ai-models";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { type, data, model } = body;

    // Resolve the model: explicit request param > user's persisted default > global default.
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { aiModel: true },
    });
    const modelId = model || user?.aiModel || DEFAULT_AI_MODEL_ID;

    if (!type) {
      return NextResponse.json(
        { error: "Type parameter is required" },
        { status: 400 },
      );
    }

    let result;

    switch (type) {
      case "outline":
        if (!data?.title) {
          return NextResponse.json(
            { error: "Title is required for outline generation" },
            { status: 400 },
          );
        }
        result = await generateOutline(data.title, data.category, modelId);
        break;

      case "summary":
        if (!data?.content) {
          return NextResponse.json(
            { error: "Content is required for summarization" },
            { status: 400 },
          );
        }
        result = await summarizeContent(data.content, modelId);
        break;

      case "fallacy-check":
        if (!data?.content) {
          return NextResponse.json(
            { error: "Content is required for fallacy checking" },
            { status: 400 },
          );
        }
        result = await checkLogicalFallacies(data.content, modelId);
        break;

      case "write-lecture":
        if (!data?.title) {
          return NextResponse.json(
            { error: "Title is required for lecture writing" },
            { status: 400 },
          );
        }
        result = await writeLecture(data.title, data.category, modelId);
        break;

      default:
        return NextResponse.json(
          { error: `Unknown type: ${type}` },
          { status: 400 },
        );
    }

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      content: result.data,
      model: modelId,
    });
  } catch (error) {
    console.error("Error in AI generation endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
