"use server"

import { CohereClient } from "cohere-ai"

let cohereInstance: CohereClient | null = null

function getCohereClient() {
  if (cohereInstance) return cohereInstance

  const token = process.env.COHERE_API_KEY?.trim()
  if (!token) {
    throw new Error("COHERE_API_KEY environment variable is required")
  }

  cohereInstance = new CohereClient({
    token,
  })
  return cohereInstance
}

export async function generateOutline(title: string, category?: string) {
  try {
    const cohere = getCohereClient()
    const prompt = `Create a detailed outline for a lecture titled "${title}"${category ? ` in the category of ${category}` : ""}. 
    
The outline should:
- Have 3-5 main sections
- Include 2-3 subsections per main section
- Be focused on philosophical or intellectual depth
- Provide clear, hierarchical structure

Format the outline using Markdown with proper heading levels (##, ###).`

    const response = await cohere.v2.chat({
      model: "command-a-reasoning-08-2025",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    })

    const textContent = response.message?.content?.find((item) => item.type === "text")
    const generatedText = textContent?.type === "text" ? textContent.text : "No content generated"

    return {
      success: true,
      data: generatedText,
    }
  } catch (error: any) {
    console.error("Error generating outline:", error)
    return {
      success: false,
      error: error.message || "Failed to generate outline. Please try again.",
    }
  }
}

export async function summarizeContent(content: string) {
  try {
    if (!content || content.trim().length === 0) {
      return {
        success: false,
        error: "No content provided to summarize.",
      }
    }

    const cohere = getCohereClient()
    const prompt = `Summarize the following lecture content in 2-3 concise paragraphs. Focus on the main ideas, key arguments, and conclusions:

${content}`

    const response = await cohere.v2.chat({
      model: "command-a-reasoning-08-2025",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    })

    const textContent = response.message?.content?.find((item) => item.type === "text")
    const generatedText = textContent?.type === "text" ? textContent.text : "No content generated"

    return {
      success: true,
      data: generatedText,
    }
  } catch (error: any) {
    console.error("Error summarizing content:", error)
    return {
      success: false,
      error: error.message || "Failed to summarize content. Please try again.",
    }
  }
}

export async function checkLogicalFallacies(content: string) {
  try {
    if (!content || content.trim().length === 0) {
      return {
        success: false,
        error: "No content provided to analyze.",
      }
    }

    const cohere = getCohereClient()
    const prompt = `Analyze the following text for logical fallacies. For each fallacy found:
1. Name the fallacy
2. Quote the specific passage
3. Explain why it's a fallacy
4. Suggest how to improve the argument

If no fallacies are found, explain why the argumentation is sound.

Text to analyze:
${content}`

    const response = await cohere.v2.chat({
      model: "command-a-reasoning-08-2025",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    })

    const textContent = response.message?.content?.find((item) => item.type === "text")
    const generatedText = textContent?.type === "text" ? textContent.text : "No content generated"

    return {
      success: true,
      data: generatedText,
    }
  } catch (error: any) {
    console.error("Error checking logical fallacies:", error)
    return {
      success: false,
      error: error.message || "Failed to analyze content. Please try again.",
    }
  }
}

export async function writeLecture(topic: string, category?: string) {
  try {
    if (!topic || topic.trim().length === 0) {
      return {
        success: false,
        error: "No topic provided for lecture writing.",
      }
    }

    const cohere = getCohereClient()
    const prompt = `Write a comprehensive, engaging lecture on "${topic}"${category ? ` in the category of ${category}` : ""}. 

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

Just write the lecture content naturally, starting with the title as an H1, followed by the introduction and body sections.`

    const response = await cohere.v2.chat({
      model: "command-a-reasoning-08-2025",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    })

    const textContent = response.message?.content?.find((item) => item.type === "text")
    const generatedText = textContent?.type === "text" ? textContent.text : "No content generated"

    return {
      success: true,
      data: generatedText,
    }
  } catch (error: any) {
    console.error("Error writing lecture:", error)
    return {
      success: false,
      error: error.message || "Failed to write lecture. Please try again.",
    }
  }
}
