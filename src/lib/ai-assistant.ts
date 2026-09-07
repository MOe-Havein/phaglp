import {
  generateChatText,
  resolveModelForRequest,
  configuredProviders,
} from "@/lib/ai-client";
import { DEFAULT_AI_MODEL_ID } from "@/lib/ai-models";

type ChatMessage = Parameters<typeof generateChatText>[0]["messages"][number];

function promptMessages(
  system: string,
  user: string,
): ChatMessage[] {
  return [
    { role: "system", content: system },
    { role: "user", content: user },
  ];
}

async function runGeneration(
  system: string,
  user: string,
  modelId?: string | null,
): Promise<{ success: boolean; data?: string; error?: string }> {
  try {
    const resolved = resolveModelForRequest(modelId, DEFAULT_AI_MODEL_ID);
    const { text } = await generateChatText({
      modelId: resolved.modelId,
      messages: promptMessages(system, user),
    });
    return { success: true, data: text?.trim() || "No content generated" };
  } catch (error: any) {
    console.error("AI generation error:", error);
    return {
      success: false,
      error: error.message || "Failed to generate. Please try again.",
    };
  }
}

export async function generateOutline(
  title: string,
  category?: string,
  modelId?: string | null,
) {
  const system = `You are a high-level curriculum architect at PHAGLP Academy.
Create a detailed outline for a lecture. The outline should:
- Have 3-5 main sections
- Include 2-3 subsections per main section
- Be focused on philosophical or intellectual depth
- Provide clear, hierarchical structure

Format the outline using Markdown with proper heading levels (##, ###).`;
  const user = `Create a detailed outline for a lecture titled "${title}"${
    category ? ` in the category of ${category}` : ""
  }.`;
  return runGeneration(system, user, modelId);
}

export async function summarizeContent(
  content: string,
  modelId?: string | null,
) {
  if (!content || content.trim().length === 0) {
    return { success: false, error: "No content provided to summarize." };
  }
  const system = `You are a professional academic editor. Summarize the following lecture content in 2-3 concise paragraphs. Focus on the main ideas, key arguments, and conclusions.`;
  return runGeneration(system, content, modelId);
}

export async function checkLogicalFallacies(
  content: string,
  modelId?: string | null,
) {
  if (!content || content.trim().length === 0) {
    return { success: false, error: "No content provided to analyze." };
  }
  const system = `You are a logic professor. Analyze the following text for logical fallacies. For each fallacy found:
1. Name the fallacy
2. Quote the specific passage
3. Explain why it's a fallacy
4. Suggest how to improve the argument

If no fallacies are found, explain why the argumentation is sound.`;
  return runGeneration(system, content, modelId);
}

export async function writeLecture(
  topic: string,
  category?: string,
  modelId?: string | null,
) {
  if (!topic || topic.trim().length === 0) {
    return { success: false, error: "No topic provided for lecture writing." };
  }
  const system = `You are a Lead Academic Professor at PHAGLP Academy.
Write a comprehensive, engaging lecture. The lecture should:
- Have a clear, logical structure with an engaging introduction, well-organized body, and conclusive ending
- Use proper heading hierarchy (## for main sections, ### for subsections)
- Be informative, actionable, and deliver clear value to readers
- Directly address the topic with depth and expertise
- Be formatted in clean Markdown

Do NOT include SEO metadata sections, closing paragraphs about SEO, or meta-commentary.
Just write the lecture content naturally, starting with the title as an H1, followed by the introduction and body sections.`;
  const user = `Write a comprehensive, engaging lecture on "${topic}"${
    category ? ` in the category of ${category}` : ""
  }.`;
  return runGeneration(system, user, modelId);
}

/** Exposed for UIs that want to show which providers are currently usable. */
export function availableAIProviders() {
  return configuredProviders();
}
