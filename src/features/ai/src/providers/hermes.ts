import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";

export type HermesChatOptions = {
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>;
  model?: string;
  temperature?: number;
  maxOutputTokens?: number;
};

export async function hermesChat(options: HermesChatOptions) {
  const baseUrl = process.env.HERMES_API_BASE?.trim();
  const apiKey = process.env.HERMES_API_KEY?.trim();
  const model =
    options.model?.trim() || process.env.HERMES_MODEL?.trim() || "gpt-4o-mini";

  if (!baseUrl || !apiKey) {
    throw new Error("HERMES_API_BASE and HERMES_API_KEY are required");
  }

  const client = createOpenAI({ baseURL: baseUrl, apiKey });

  const { text } = await generateText({
    model: client(model),
    messages: options.messages,
    temperature: options.temperature ?? 0.7,
    maxOutputTokens: options.maxOutputTokens ?? 700,
  });

  return text.trim();
}
