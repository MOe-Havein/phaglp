import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { cohereChat } from "@/features/ai/src/providers";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

function safeResponseText(raw: string): string {
  let clean = raw.trim();
  if (clean.startsWith("```json")) clean = clean.slice(7).trim();
  else if (clean.startsWith("```")) clean = clean.slice(3).trim();
  if (clean.endsWith("```")) clean = clean.slice(0, -3).trim();
  return clean;
}

// GET: Fetch recent analytics logged under the Tech Concepts Dashboard
export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const logs = await prisma.analytics.findMany({
      where: {
        userId: session.user.id,
        path: "/dashboard/tech-concepts",
      },
      orderBy: { createdAt: "desc" },
      take: 15,
    });

    return NextResponse.json({ success: true, logs });
  } catch (error: any) {
    console.error("GET Analytics Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch logs" },
      { status: 500 },
    );
  }
}

// POST: Add new analytics log or generate interactive AI lesson & quiz
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action, eventName, metadata, topic, goal } = body;

    // Route 1: Logging database analytics event
    if (action === "log") {
      if (!eventName) {
        return NextResponse.json(
          { error: "eventName is required" },
          { status: 400 },
        );
      }

      const log = await prisma.analytics.create({
        data: {
          event: eventName,
          path: "/dashboard/tech-concepts",
          userId: session.user.id,
          metadata: metadata || {},
        },
      });

      return NextResponse.json({ success: true, log });
    }

    // Route 2: Content generation (Generative AI Playground)
    if (action === "generate") {
      if (!topic) {
        return NextResponse.json(
          { error: "topic is required" },
          { status: 400 },
        );
      }

      const prompt = `You are a high-level academic instructor at PHAGLP Academy. 
Create educational material about the topic "${topic}".
Goal: ${goal || "generate explanation, quiz, or both"}.

Format the output strictly as a valid JSON object. Do not include markdown codeblocks or any additional text.
Strictly match this JSON schema:
{
  "title": "${topic}",
  "explanation": "Write a 3-paragraph rich-text overview of the topic. Use structured paragraphs, clear philosophical depth, and mention key historic figures if applicable.",
  "keyTakeaways": [
    "Takeaway 1 detailing logical concepts",
    "Takeaway 2 detailing scientific relevance",
    "Takeaway 3 detailing practical application"
  ],
  "quiz": [
    {
      "question": "Insert challenging multiple choice question here",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answerIndex": 0,
      "explanation": "Provide a brief explanation of why this answer is correct."
    },
    {
      "question": "Second challenging multiple choice question",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answerIndex": 1,
      "explanation": "Explanation here."
    },
    {
      "question": "Third challenging multiple choice question",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answerIndex": 2,
      "explanation": "Explanation here."
    }
  ]
}`;

      const messages = [{ role: "user", content: prompt } as const];

      let text: string;
      try {
        text = await cohereChat({
          messages,
          model: "command-a-reasoning-08-2025",
        });
      } catch (cohereError) {
        console.warn(
          "Cohere interactive concepts generation failed:",
          cohereError,
        );
        text = "";
      }

      if (text) {
        try {
          const parsed = JSON.parse(safeResponseText(text));
          return NextResponse.json({
            success: true,
            data: parsed,
            source: "cohere",
          });
        } catch (parseError) {
          console.warn(
            "Interactive concepts JSON parse failed, falling back to mock:",
            parseError,
          );
        }
      }

      // High-fidelity Mock Generator
      const lowerTopic = (topic || "").toLowerCase();
      let mockTitle = topic || "Interactive Concept";
      let mockExplanation = "";
      let mockTakeaways: string[] = [];
      let mockQuiz: any[] = [];

      if (
        lowerTopic.includes("stoic") ||
        lowerTopic.includes("stoicism") ||
        lowerTopic.includes("marcus")
      ) {
        mockTitle = "Stoicism: Cognitive Control & Virtue Ethics";
        mockExplanation =
          "Stoicism is an ancient Greco-Roman philosophy founded in Athens by Zeno of Citium. It asserts that virtue (specifically wisdom, courage, justice, and temperance) is the sole good, and that we cannot control external circumstances—only our internal reactions to them. Through practices like the 'Dichotomy of Control' popularized by Epictetus and Marcus Aurelius, Stoicism trains the intellect to distinguish objective facts from emotional projections. In modern cognitive behavioral therapy (CBT), Stoic principles form the primary foundations for logical reframing and resilient mental health models.";
        mockTakeaways = [
          "The Dichotomy of Control: Focus exclusively on your own thoughts and actions, accepting externals.",
          "Premeditatio Malorum: Mentally rehearsing potential setbacks to reduce their sudden emotional disruption.",
          "Amor Fati: Enthusiastically embracing whatever fate brings, framing obstacles as active pathways to virtue.",
        ];
        mockQuiz = [
          {
            question:
              "Which Roman emperor authored the personal philosophical diary 'Meditations' representing Stoic practice?",
            options: ["Seneca", "Epictetus", "Marcus Aurelius", "Nero"],
            answerIndex: 2,
            explanation:
              "Marcus Aurelius wrote 'Meditations' to himself as a guide for self-improvement and emotional control during military campaigns.",
          },
          {
            question:
              "According to the Stoic Dichotomy of Control, which of the following is entirely within our control?",
            options: [
              "Our reputation among peers",
              "Our internal judgments and actions",
              "The physical health of our body",
              "The outcome of a planned project",
            ],
            answerIndex: 1,
            explanation:
              "Reputation, physical health, and project outcomes are ultimately subject to external forces; only our own thoughts, intentions, and reactions are within our control.",
          },
          {
            question: "What is the meaning of the Stoic concept 'Amor Fati'?",
            options: [
              "Rebelling against unfair circumstances",
              "A passive fear of death",
              "The loving acceptance of one's destiny",
              "Living solely for sensory pleasure",
            ],
            answerIndex: 2,
            explanation:
              "'Amor Fati' translates to 'love of fate'—welcoming adversity as an opportunity to build resilience and display moral virtue.",
          },
        ];
      } else if (
        lowerTopic.includes("logic") ||
        lowerTopic.includes("syllogism") ||
        lowerTopic.includes("fallacy")
      ) {
        mockTitle = "Formal Logic & Syllogistic Inference";
        mockExplanation =
          "Formal logic is the systematic study of structural validity. Originally codified by Aristotle in the 'Organon', logical systems verify arguments based on syntax rather than empirical content. A standard categorical syllogism comprises a major premise, minor premise, and conclusion (e.g., 'All humans are mortal; Socrates is human; therefore, Socrates is mortal'). Unification of these classic semantics with modern Boolean logic allows systems to map complex premises onto valid truth values, identifying structural fallacies—such as affirming the consequent or ad hominem attacks—automatically.";
        mockTakeaways = [
          "Deductive Validity: An argument is structurally valid if the truth of its premises guarantees the truth of its conclusion.",
          "Aristotelian Syllogisms: Classic rule systems utilizing major/minor premises and middle terms to yield undeniable proofs.",
          "Cognitive Fallacy Auditing: Identifying logical slips, such as strawman arguments or circular reasoning, to refine active discourse.",
        ];
        mockQuiz = [
          {
            question:
              "What logical fallacy is committed when an argument assumes the very conclusion it is trying to prove?",
            options: [
              "Ad Hominem",
              "Begging the Question (Circular Reasoning)",
              "Affirming the Consequent",
              "False Dilemma",
            ],
            answerIndex: 1,
            explanation:
              "'Begging the question' occurs when the premises assume the truth of the conclusion instead of supporting it.",
          },
          {
            question:
              "In standard deduction, if 'P implies Q' is true, and 'P' is true, what rule allows us to conclude 'Q'?",
            options: [
              "Modus Tollens",
              "Syllogistic Fallacy",
              "Modus Ponens",
              "Disjunctive Syllogism",
            ],
            answerIndex: 2,
            explanation:
              "Modus Ponens is the classic rule of inference: if a conditional statement and its antecedent are both true, the consequent must be true.",
          },
          {
            question:
              "Which fallacy occurs in 'If it rains, the grass is wet. The grass is wet, therefore it rained'?",
            options: [
              "Denying the Antecedent",
              "Affirming the Consequent",
              "Post Hoc Ergo Propter Hoc",
              "Red Herring",
            ],
            answerIndex: 1,
            explanation:
              "Affirming the consequent assumes that because the result (wet grass) occurred, the specific trigger (rain) must have caused it, ignoring other possibilities (like a sprinkler).",
          },
        ];
      } else if (
        lowerTopic.includes("epistemology") ||
        lowerTopic.includes("knowledge") ||
        lowerTopic.includes("socrates")
      ) {
        mockTitle = "Epistemology: The Architecture of True Belief";
        mockExplanation =
          "Epistemology is the division of philosophy addressing the nature, scope, and validation of knowledge. Historically defined by Plato as 'justified true belief' (JTB), the concept was fundamentally challenged in 1963 by Edmund Gettier, who demonstrated that a person can hold a justified, true belief that still fails to qualify as genuine knowledge due to accidental luck. Epistemological structures examine rationalist models (deducing reality through pure reason, such as Descartes) alongside empiricist modules (building understanding through sensory experience, such as Locke and Hume).";
        mockTakeaways = [
          "The Gettier Problem: Proving that justified true belief is not a sufficient definition for absolute knowledge.",
          "Rationalism vs Empiricism: Deciding whether truth is unlocked via internal mental deduction or external empirical testing.",
          "Socratic Inquiry: Systematically dissecting definitions through structured dialogue to expose hidden contradictions.",
        ];
        mockQuiz = [
          {
            question:
              "Who famously challenged the classical definition of knowledge as 'Justified True Belief' in 1963?",
            options: [
              "René Descartes",
              "Immanuel Kant",
              "Edmund Gettier",
              "David Hume",
            ],
            answerIndex: 2,
            explanation:
              "Edmund Gettier published a 3-page paper presenting counterexamples where individuals held justified true beliefs that were only true by chance, shaking epistemology.",
          },
          {
            question:
              "Which philosophical camp claims that all knowledge is ultimately derived from sensory experience?",
            options: [
              "Rationalism",
              "Existentialism",
              "Empiricism",
              "Solipsism",
            ],
            answerIndex: 2,
            explanation:
              "Empiricism (championed by Locke, Berkeley, and Hume) asserts that the mind begins as a blank slate ('tabula rasa') and gathers knowledge through observation.",
          },
          {
            question:
              "What is René Descartes' core epistemological conclusion in 'Meditations on First Philosophy'?",
            options: [
              "All senses are reliable sources of truth",
              "I think, therefore I am (Cogito, ergo sum)",
              "Absolute truth is impossible to attain",
              "The physical world is an illusion",
            ],
            answerIndex: 1,
            explanation:
              "Descartes sought absolute certainty by doubting everything; he realized that the very act of doubting proved his own existence as a thinking entity.",
          },
        ];
      } else {
        const capitalized = topic.charAt(0).toUpperCase() + topic.slice(1);
        mockTitle = `Integrated Discourse: ${capitalized}`;
        mockExplanation = `This custom interactive lecture explores the core dimensions of "${topic}". By examining this concept from both historical and modern perspectives, we unlock how semantic frameworks influence active learning and institutional structure. In aligning "${topic}" with general philosophical analysis, we study its structural premises, logical consistencies, and ethical implications. Practical implementations of this knowledge provide actionable methods to improve logical reasoning and critical problem-solving skills across the entire PHAGLP academic ecosystem.`;
        mockTakeaways = [
          `Conceptual Structure: Investigating the underlying frameworks that define ${topic}.`,
          `Analytical Unification: Integrating this topic with logical reasoning and modern empirical tools.`,
          `Practical Application: Utilizing these insights to resolve complex cognitive challenges in daily research.`,
        ];
        mockQuiz = [
          {
            question: `Which approach is most critical when performing a philosophical analysis of '${topic}'?`,
            options: [
              "Accepting standard definitions without question",
              "Deconstructing premises to examine logical consistency",
              "Ignoring historical context",
              "Focusing solely on subjective opinion",
            ],
            answerIndex: 1,
            explanation:
              "Rigorous philosophical analysis requires identifying underlying premises and evaluating their logical connections for consistency.",
          },
          {
            question: `In what way does the study of '${topic}' enrich adaptive learning in technology?`,
            options: [
              "It enforces rigid memorization",
              "It replaces the instructor entirely",
              "It fosters critical thinking and cognitive framework mapping",
              "It has no practical value",
            ],
            answerIndex: 2,
            explanation:
              "Engaging with structured academic concepts enables learners to map cognitive frameworks, optimizing their pace and problem-solving depth.",
          },
          {
            question: `To verify an argument concerning '${topic}', what must we check?`,
            options: [
              "The volume of the speaker's voice",
              "The popularity of the claim",
              "The structural validity of the premises and truth values",
              "The number of pages in the text",
            ],
            answerIndex: 2,
            explanation:
              "Argument verification relies strictly on examining logical validity and confirming that premises lead logically to the conclusion.",
          },
        ];
      }

      return NextResponse.json({
        success: true,
        data: {
          title: mockTitle,
          explanation: mockExplanation,
          keyTakeaways: mockTakeaways,
          quiz: mockQuiz,
        },
        source: "mock",
      });
    }

    return NextResponse.json(
      { error: "Invalid action parameters" },
      { status: 400 },
    );
  } catch (error: any) {
    console.error("POST Interactive Concepts Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
