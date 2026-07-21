"use server";

import { hermesChat, cohereChat } from "@/features/ai/src/providers";

type GenerateOutlineOptions = {
  title: string;
  category?: string;
  model?: string;
};

export async function generateOutline({
  title,
  category,
  model,
}: GenerateOutlineOptions) {
  try {
    const prompt = `Create a detailed outline for a lecture titled "${title}"${category ? ` in the category of ${category}` : ""}. 

The outline should:
- Have 3-5 main sections
- Include 2-3 subsections per main section
- Be focused on philosophical or intellectual depth
- Provide clear, hierarchical structure

Format the outline using Markdown with proper heading levels (##, ###).`;

    const messages = [{ role: "user", content: prompt } as const];

    let text: string;
    try {
      text = await hermesChat({
        messages,
        model: model || "gpt-4o-mini",
        temperature: 0.7,
        maxOutputTokens: 700,
      });
      if (!text || !text.trim()) {
        throw new Error("Hermes returned empty text");
      }
    } catch (hermesErr) {
      console.error(
        "Hermes outline failed, falling back to Cohere:",
        hermesErr,
      );
      text = await cohereChat({
        messages,
        model: "command-a-reasoning-08-2025",
      });
    }

    return { success: true, data: text };
  } catch (error: any) {
    console.error("Error generating outline:", error);
    return {
      success: false,
      error: error.message || "Failed to generate outline. Please try again.",
    };
  }
}

type SummarizeContentOptions = {
  content: string;
  model?: string;
};

export async function summarizeContent({
  content,
  model,
}: SummarizeContentOptions) {
  try {
    if (!content || content.trim().length === 0) {
      return { success: false, error: "No content provided to summarize." };
    }

    const prompt = `Summarize the following lecture content in 2-3 concise paragraphs. Focus on the main ideas, key arguments, and conclusions:\n\n${content}`;

    const messages = [{ role: "user", content: prompt } as const];

    let text: string;
    try {
      text = await hermesChat({
        messages,
        model: model || "gpt-4o-mini",
        temperature: 0.7,
        maxOutputTokens: 700,
      });
      if (!text || !text.trim()) {
        throw new Error("Hermes returned empty text");
      }
    } catch (hermesErr) {
      console.error(
        "Hermes summarize failed, falling back to Cohere:",
        hermesErr,
      );
      text = await cohereChat({
        messages,
        model: "command-a-reasoning-08-2025",
      });
    }

    return { success: true, data: text };
  } catch (error: any) {
    console.error("Error summarizing content:", error);
    return {
      success: false,
      error: error.message || "Failed to summarize content. Please try again.",
    };
  }
}

type CheckLogicalFallaciesOptions = {
  content: string;
  model?: string;
};

export async function checkLogicalFallacies({
  content,
  model,
}: CheckLogicalFallaciesOptions) {
  try {
    if (!content || content.trim().length === 0) {
      return { success: false, error: "No content provided to analyze." };
    }

    const prompt = `Analyze the following text for logical fallacies. For each fallacy found:\n1. Name the fallacy\n2. Quote the specific passage\n3. Explain why it's a fallacy\n4. Suggest how to improve the argument\n\nIf no fallacies are found, explain why the argumentation is sound.\n\nText to analyze:\n${content}`;

    const messages = [{ role: "user", content: prompt } as const];

    let text: string;
    try {
      text = await hermesChat({
        messages,
        model: model || "gpt-4o-mini",
        temperature: 0.7,
        maxOutputTokens: 700,
      });
      if (!text || !text.trim()) {
        throw new Error("Hermes returned empty text");
      }
    } catch (hermesErr) {
      console.error(
        "Hermes fallacy check failed, falling back to Cohere:",
        hermesErr,
      );
      text = await cohereChat({
        messages,
        model: "command-a-reasoning-08-2025",
      });
    }

    return { success: true, data: text };
  } catch (error: any) {
    console.error("Error checking logical fallacies:", error);
    return {
      success: false,
      error: error.message || "Failed to analyze content. Please try again.",
    };
  }
}

type WriteLectureOptions = {
  title: string;
  category?: string;
  model?: string;
};

export async function writeLecture({
  title,
  category,
  model,
}: WriteLectureOptions) {
  try {
    if (!title || title.trim().length === 0) {
      return {
        success: false,
        error: "No title provided for lecture writing.",
      };
    }

    const prompt = `Write a comprehensive, engaging lecture on "${title}"${category ? ` in the category of ${category}` : ""}. 

The lecture should:
- Have a clear, logical structure with an engaging introduction, well-organized body, and conclusive ending
- Use proper heading hierarchy (## for main sections, ### for subsections)
- Be informative, actionable, and deliver clear value to readers
- Directly address the topic with depth and expertise
- Be formatted in clean Markdown

Do NOT include:
- SEO metadata sections (no "SEO Title:" or "Meta Description:" labels)
- Closing paragraphs about SEO optimization or best practices
- Any meta-commentary about the lecture itself

Just write the lecture content naturally, starting with the title as an H1, followed by the introduction and body sections.`;

    const messages = [{ role: "user", content: prompt } as const];

    let text: string;
    try {
      text = await hermesChat({
        messages,
        model: model || "gpt-4o-mini",
        temperature: 0.7,
        maxOutputTokens: 1200,
      });
    } catch (hermesErr) {
      console.error(
        "Hermes lecture write failed, falling back to Cohere:",
        hermesErr,
      );
      text = await cohereChat({
        messages,
        model: "command-a-reasoning-08-2025",
      });
    }

    return { success: true, data: text };
  } catch (error: any) {
    console.error("Error writing lecture:", error);
    return {
      success: false,
      error: error.message || "Failed to write lecture. Please try again.",
    };
  }
}
