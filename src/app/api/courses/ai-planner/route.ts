import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { generateChatText, resolveModelForRequest } from "@/lib/ai-client";
import { DEFAULT_AI_MODEL_ID } from "@/lib/ai-models";

export const dynamic = "force-dynamic";

function stripJsonWrapper(text: string): string {
  let clean = text.trim();
  if (clean.startsWith("```json")) {
    clean = clean.substring(7, clean.length - 3).trim();
  } else if (clean.startsWith("```")) {
    clean = clean.substring(3, clean.length - 3).trim();
  }
  return clean;
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      action = "generate-outline",
      topic,
      description,
      moduleCount = 3,
      lessonsPerModule = 3,
      courseTitle,
      lessonTitle,
      currentContent = "",
      model,
    } = body;

    // Resolve the model to use: explicit request param > user default > global default.
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { aiModel: true },
    });
    const resolved = resolveModelForRequest(model, user?.aiModel ?? DEFAULT_AI_MODEL_ID);

    // Helper: ask the selected provider; return trimmed text or null on failure.
    async function askAI(
      system: string,
      userPrompt: string,
    ): Promise<string | null> {
      try {
        const { text } = await generateChatText({
          modelId: resolved.modelId,
          messages: [
            { role: "system", content: system },
            { role: "user", content: userPrompt },
          ],
        });
        return text?.trim() || null;
      } catch (err) {
        console.warn(`AI planner (${action}) failed, falling back:`, err);
        return null;
      }
    }

    // =========================================================================
    // ACTION: WRITE LECTURE
    // =========================================================================
    if (action === "write-lecture") {
      if (!lessonTitle) {
        return NextResponse.json(
          { error: "Lesson title is required" },
          { status: 400 },
        );
      }

      const cTitle = courseTitle || "Unified Philosophical Study";
      const lTitle = lessonTitle;

      const text = await askAI(
        `You are a Lead Academic Professor at PHAGLP Academy.
Write a comprehensive, professional, and highly educational textbook lecture.
Deconstruct key theoretical ideas, provide clear logical arguments, and focus on practical cognitive application.
Format the output in a clean, structured Markdown format. Start directly with the lecture body text. Do not include introductory conversation, headers, or metadata. Keep it around 250 to 400 words.`,
        `Write a comprehensive textbook lecture for the lesson session: "${lTitle}" in the course "${cTitle}".`,
      );

      if (text) {
        return NextResponse.json({
          success: true,
          content: text,
          source: resolved.provider,
          model: resolved.modelId,
        });
      }

      // Mock Fallback for Write Lecture
      const mockLecture = `### Educational Lecture: ${lTitle}

#### Overview & Conceptual Framework
In this session, we investigate the structural foundations of ${lTitle}. Understanding this topic requires a rigorous deconstruction of its primary axioms. By examining the logical boundaries and conceptual relationships, we establish an actionable framework for intentional life planning.

#### Deeper Inquiry
1. **First-Principles Reasoning:** We must analyze the fundamental premises that support this framework.
2. **Cognitive Re-routing:** Translating theoretical insights into practical mental tools for cognitive reframing.
3. **Synthesis & Integration:** Bridging classical methods with modern scientific inquiry to achieve unified insights.

#### Conclusion
By mastering the insights of ${lTitle}, scholars acquire the precise tools to resolve systemic cognitive discrepancies and live intentionally. Review these axioms, examine the logic, and prepare to apply them in daily discourse.`;

      return NextResponse.json({
        success: true,
        content: mockLecture,
        source: "mock",
        model: resolved.modelId,
      });
    }

    // =========================================================================
    // ACTION: GENERATE QUIZ
    // =========================================================================
    if (action === "generate-quiz") {
      if (!lessonTitle) {
        return NextResponse.json(
          { error: "Lesson title is required" },
          { status: 400 },
        );
      }

      const cTitle = courseTitle || "Unified Philosophical Study";
      const lTitle = lessonTitle;

      const text = await askAI(
        `You are an Academic Examiner at PHAGLP Academy.
Create an interactive practice review quiz consisting of exactly 3 multiple-choice questions.
Format each question with 4 options (A, B, C, D) and specify the correct answer and a brief logical explanation.
Return the output in clean, structured Markdown format to be appended to the lesson reading textbook. Start directly with the quiz header (e.g. "### Practice Quiz"). Do not include metadata or conversational text.`,
        `Create a practice review quiz for the lesson session: "${lTitle}" in the course "${cTitle}".`,
      );

      if (text) {
        const combinedContent = `${currentContent}\n\n${text.trim()}`;
        return NextResponse.json({
          success: true,
          content: combinedContent,
          source: resolved.provider,
          model: resolved.modelId,
        });
      }

      // Mock Fallback for Generate Quiz
      const mockQuiz = `

### Practice Review Quiz

**Question 1: What is the primary logical axiom underlying ${lTitle}?**
* A) External validation and social adaptation
* B) Deconstructing fundamental premises to action first principles (Correct)
* C) Ephemeral physical alignment
* D) Unsystematic emotional responses
* *Explanation: PHAGLP epistemology prioritizes first-principles reasoning to deconstruct external frameworks.*

**Question 2: Which methodology bridges classical philosophy with modern cognitive inquiry?**
* A) Cognitive reframing and deconstructive discourse (Correct)
* B) Arbitrary decision allocation
* C) Historical passivity
* D) None of the above
* *Explanation: Cognitive reframing is the core tool used to translate classical theory into practical mental habits.*

**Question 3: In implementing the insights of ${lTitle}, which of the following is required?**
* A) Rigid adherence to dogmatic instructions
* B) Continuous verification and intentional refinement (Correct)
* C) Ignoring external feedback entirely
* D) Relocating to a secluded environment
* *Explanation: Intentional refinement relies on constant empirical check and adjustment of life planning goals.*`;

      const combinedContent = `${currentContent}${mockQuiz}`;
      return NextResponse.json({
        success: true,
        content: combinedContent,
        source: "mock",
        model: resolved.modelId,
      });
    }

    // =========================================================================
    // ACTION: GENERATE OUTLINE (Default)
    // =========================================================================
    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const outlineText = await askAI(
      `You are a high-level curriculum architect at PHAGLP Academy.
Create a structured course outline.
Format the output strictly as a valid JSON object. Do not include markdown codeblocks or any additional text.
Strictly match this JSON schema:
{
  "title": "A premium academic title for the course based on the topic",
  "description": "A comprehensive 2-sentence description of the course.",
  "duration": "e.g., 4 weeks or 6 weeks",
  "durationMonths": 1,
  "modules": [
    {
      "title": "Title of Module 1",
      "order": 1,
      "lessons": [
        {
          "title": "Title of Lesson 1",
          "content": "A rich paragraph detailing what is covered in this lesson. Must be high-fidelity and educational.",
          "order": 1
        }
      ]
    }
  ]
}`,
      `Create a structured course outline about the topic "${topic}".
Description/Context: ${description || "General study"}
Number of Modules: ${moduleCount}
Lessons Per Module: ${lessonsPerModule}`,
    );

    if (outlineText) {
      try {
        const parsed = JSON.parse(stripJsonWrapper(outlineText));
        return NextResponse.json({
          success: true,
          data: parsed,
          source: resolved.provider,
          model: resolved.modelId,
        });
      } catch (parseErr) {
        console.warn("Failed to parse AI outline JSON, using mock:", parseErr);
      }
    }

    // High-fidelity Mock Generator fallback
    const capitalizedTopic = topic.charAt(0).toUpperCase() + topic.slice(1);

    const mockModules = Array.from({ length: moduleCount }).map((_, mIdx) => {
      const mNum = mIdx + 1;
      const lessons = Array.from({ length: lessonsPerModule }).map((_, lIdx) => {
        const lNum = lIdx + 1;
        return {
          title: `Lesson ${lNum}: Foundations of ${capitalizedTopic} - Level ${mNum}`,
          content: `In this section, we analyze the core structural paradigms, logical foundations, and historic impacts of ${capitalizedTopic}. By deconstructing primary source texts and validating premises, scholars gain actionable knowledge to address modern challenges.`,
          order: lNum,
        };
      });

      return {
        title: `Module ${mNum}: Core Principles of ${capitalizedTopic}`,
        order: mNum,
        lessons,
      };
    });

    const mockData = {
      title: `${capitalizedTopic}: Unified Theoretical & Practical Frameworks`,
      description: `A masterclass study addressing the logical boundaries, scientific structures, and philosophical dimensions of ${capitalizedTopic}.`,
      duration: `${moduleCount * 2} weeks`,
      durationMonths: Math.max(1, Math.round(moduleCount / 2)),
      modules: mockModules,
    };

    return NextResponse.json({
      success: true,
      data: mockData,
      source: "mock",
      model: resolved.modelId,
    });
  } catch (error: any) {
    console.error("AI Planner API Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
