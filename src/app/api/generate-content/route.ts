import { generateText } from "ai"
import { google } from "@ai-sdk/google"
import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { prompt, type } = await request.json()

    const systemPrompts = {
      hero: "You are a professional copywriter specializing in hero sections. Create compelling headlines and subheadings that grab attention and clearly communicate value propositions.",
      features:
        "You are a marketing expert who creates feature lists. Generate clear, benefit-focused feature descriptions that highlight value to customers.",
      about:
        "You are a brand storyteller. Create engaging company descriptions that build trust and communicate mission, values, and expertise.",
      cta: "You are a conversion optimization expert. Create compelling call-to-action text that motivates users to take action.",
      custom:
        "You are a professional marketing copywriter. Create high-converting website content based on the user's specific requirements.",
    }

    const { text } = await generateText({
      model: google("gemini-1.5-pro"),
      system: systemPrompts[type as keyof typeof systemPrompts] || systemPrompts.custom,
      prompt: `Create website content for: ${prompt}. 
      
      Return ONLY the content in JSON format with appropriate fields:
      - For hero: { "title": "...", "subtitle": "...", "description": "..." }
      - For features: { "features": ["feature1", "feature2", ...] }
      - For about: { "description": "..." }
      - For cta: { "ctaText": "...", "secondaryText": "..." }
      - For custom: Use appropriate fields based on the request
      
      Make the content professional, engaging, and conversion-focused. Do not include markdown code blocks or any other text.`,
    })

    // Parse the generated text as JSON
    let content
    try {
      content = JSON.parse(text)
    } catch {
      // Fallback if JSON parsing fails
      content = { text }
    }

    return NextResponse.json({ content, type })
  } catch (error) {
    console.error("Content generation error:", error)
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 })
  }
}
