import { NextRequest, NextResponse } from "next/server";
import {
  generateOutline,
  summarizeContent,
  checkLogicalFallacies,
  writeLecture,
} from "@/lib/ai-assistant";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

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
        result = await generateOutline(data.title, data.category);
        break;

      case "summary":
        if (!data?.content) {
          return NextResponse.json(
            { error: "Content is required for summarization" },
            { status: 400 },
          );
        }
        result = await summarizeContent(data.content);
        break;

      case "fallacy-check":
        if (!data?.content) {
          return NextResponse.json(
            { error: "Content is required for fallacy checking" },
            { status: 400 },
          );
        }
        result = await checkLogicalFallacies(data.content);
        break;

      case "write-lecture":
        if (!data?.title) {
          return NextResponse.json(
            { error: "Title is required for lecture writing" },
            { status: 400 },
          );
        }
        result = await writeLecture(data.title, data.category);
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
    });
  } catch (error) {
    console.error("Error in AI generation endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
