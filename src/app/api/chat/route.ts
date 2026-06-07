import { NextRequest, NextResponse } from "next/server";
import { answerQuestion } from "@/lib/chatbot";
import { auth } from "@/auth";
import { nanoid } from "nanoid";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const body = await request.json();
    const { question, sessionId: providedSessionId, contextType } = body;

    if (!question || typeof question !== "string") {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 },
      );
    }

    // Use provided session ID or generate a new one
    const sessionId = providedSessionId || nanoid();

    const result = await answerQuestion(question, {
      sessionId,
      userId: session?.user?.id,
      contextType,
    });

    if (!result.success || !result.data) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to process question" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      sessionId,
      answer: result.data.answer,
      sources: result.data.sources,
    });
  } catch (error: any) {
    console.error("Error in chat:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process question" },
      { status: 500 },
    );
  }
}
