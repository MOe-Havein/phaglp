/**
 * Server-side AI dispatcher.
 *
 * Provides a single `generateChatText` entry point that routes a prompt to the
 * correct provider (Cohere or Google Gemini) based on the model id from the
 * registry (src/lib/ai-models.ts). This keeps the individual route handlers
 * free of provider-specific branching and makes adding new models a registry
 * change only.
 *
 * Server-only: imports the Cohere SDK and the Vercel AI SDK + Google provider.
 */

import "server-only";

import { CohereClient } from "cohere-ai";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import {
  AI_PROVIDERS,
  DEFAULT_AI_MODEL_ID,
  resolveAIModel,
  type AIProvider,
} from "@/lib/ai-models";
import type { ModelMessage } from "ai";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface GenerateChatTextParams {
  /** Registry id (e.g. "cohere-command-a-reasoning"). */
  modelId?: string | null;
  /** Ordered conversation. A `system` message, if present, is sent as the system prompt. */
  messages: ChatMessage[];
  /** Convenience single user prompt (ignored if `messages` contains a user/assistant turn). */
  prompt?: string;
}

export interface GenerateChatTextResult {
  text: string;
  provider: AIProvider;
  modelId: string;
  param: string;
}

// ---- Cohere singleton -------------------------------------------------------

let cohereInstance: CohereClient | null = null;

function getCohereClient(): CohereClient | null {
  const token = process.env.COHERE_API_KEY?.trim();
  if (!token) return null;
  if (!cohereInstance) {
    cohereInstance = new CohereClient({ token });
  }
  return cohereInstance;
}

export function cohereConfigured(): boolean {
  return Boolean(process.env.COHERE_API_KEY?.trim());
}

export function googleConfigured(): boolean {
  return Boolean(process.env.GOOGLE_API_KEY?.trim());
}

/** Which providers have credentials in the current environment. */
export function configuredProviders(): AIProvider[] {
  const providers: AIProvider[] = [];
  if (cohereConfigured()) providers.push(AI_PROVIDERS.COHERE);
  if (googleConfigured()) providers.push(AI_PROVIDERS.GOOGLE);
  return providers;
}

function buildMessageList(params: GenerateChatTextParams): ChatMessage[] {
  const msgs = [...params.messages];
  if (
    params.prompt &&
    !msgs.some((m) => m.role === "user" || m.role === "assistant")
  ) {
    msgs.push({ role: "user", content: params.prompt });
  }
  return msgs;
}

function splitSystem(messages: ChatMessage[]): {
  system: string | undefined;
  chat: { role: "user" | "assistant"; content: string }[];
} {
  const system = messages.find((m) => m.role === "system")?.content;
  const chat = messages
    .filter((m) => m.role !== "system")
    .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));
  return { system, chat };
}

/**
 * Resolve the model for this request, preferring `requestedId`, then falling
 * back to `userDefaultId` (the persisted profile default), then the global
 * default. If the chosen provider has no API key in this environment, it
 * falls back to the first configured provider so the request still works.
 */
export function resolveModelForRequest(
  requestedId?: string | null,
  userDefaultId?: string | null,
): { modelId: string; provider: AIProvider; param: string } {
  const candidate = requestedId || userDefaultId || DEFAULT_AI_MODEL_ID;
  const model = resolveAIModel(candidate, configuredProviders());
  return { modelId: model.id, provider: model.provider, param: model.param };
}

export async function generateChatText(
  params: GenerateChatTextParams,
): Promise<GenerateChatTextResult> {
  const messages = buildMessageList(params);
  const { modelId, provider, param } = resolveModelForRequest(
    params.modelId,
    null,
  );

  if (provider === AI_PROVIDERS.COHERE) {
    const cohere = getCohereClient();
    if (!cohere) {
      throw new Error(
        "Cohere model requested but COHERE_API_KEY is not configured.",
      );
    }
    // Cohere v2 chat accepts a top-level `system` param; non-system messages
    // go into the conversation. Drop any system role from the message list.
    const system = messages.find((m) => m.role === "system")?.content;
    const chatMessages = messages
      .filter((m) => m.role !== "system")
      .map((m) => ({ role: m.role, content: m.content }));
    const response = await cohere.v2.chat({
      model: param,
      ...(system ? { system } : {}),
      messages: chatMessages,
    });
    const textContent = response.message?.content?.find(
      (item: { type: string }) => item.type === "text",
    );
    const text = textContent?.type === "text" ? textContent.text : "";
    return { text, provider, modelId, param };
  }

  // Google Gemini via Vercel AI SDK
  const { system, chat } = splitSystem(messages);
  const { text } = await generateText({
    model: google(param),
    ...(system ? { system } : {}),
    messages: chat as ModelMessage[],
  });
  return { text, provider, modelId, param };
}
