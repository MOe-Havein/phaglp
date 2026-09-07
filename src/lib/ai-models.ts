/**
 * Client-safe AI model registry.
 *
 * This file has NO server-only imports so it can be used by both the browser
 * UI (model pickers) and server-side route handlers. Keep it free of
 * `prisma`, `node:*`, or provider SDK imports.
 *
 * The `provider` field tells the server dispatcher (src/lib/ai-client.ts)
 * which SDK to call. The `param` field is the exact model identifier the
 * provider expects.
 */

export const AI_PROVIDERS = {
  COHERE: "cohere",
  GOOGLE: "google",
} as const;

export type AIProvider = (typeof AI_PROVIDERS)[keyof typeof AI_PROVIDERS];

export interface AIModelOption {
  /** Stable key persisted on the user profile (User.aiModel). */
  id: string;
  /** Human-readable label for UI dropdowns. */
  label: string;
  /** Provider that serves this model. */
  provider: AIProvider;
  /** Exact model identifier passed to the provider SDK. */
  param: string;
  /** Short description shown in the UI. */
  description: string;
}

export const AI_MODEL_REGISTRY: AIModelOption[] = [
  {
    id: "cohere-command-a-reasoning",
    label: "Cohere Command A Reasoning",
    provider: AI_PROVIDERS.COHERE,
    param: "command-a-reasoning-08-2025",
    description: "Cohere's reasoning model (default). Requires COHERE_API_KEY.",
  },
  {
    id: "google-gemini-1.5-pro",
    label: "Google Gemini 1.5 Pro",
    provider: AI_PROVIDERS.GOOGLE,
    param: "gemini-1.5-pro",
    description: "Google Gemini Pro via the Vercel AI SDK. Requires GOOGLE_API_KEY.",
  },
  {
    id: "google-gemini-2.0-flash",
    label: "Google Gemini 2.0 Flash",
    provider: AI_PROVIDERS.GOOGLE,
    param: "gemini-2.0-flash",
    description: "Google Gemini Flash (faster). Requires GOOGLE_API_KEY.",
  },
];

/** Fast lookup by id. */
export const AI_MODEL_MAP: Record<string, AIModelOption> = Object.fromEntries(
  AI_MODEL_REGISTRY.map((m) => [m.id, m]),
);

export const DEFAULT_AI_MODEL_ID = "cohere-command-a-reasoning";

/**
 * Resolve a requested model id to a registry entry.
 * Falls back to the default when the id is missing or unknown, and
 * falls back to a model whose provider has a configured API key when the
 * resolved provider is unavailable at runtime.
 */
export function resolveAIModel(
  requestedId?: string | null,
  availableProviders?: AIProvider[],
): AIModelOption {
  const requested = requestedId ? AI_MODEL_MAP[requestedId] : undefined;
  const base: AIModelOption = requested ?? AI_MODEL_MAP[DEFAULT_AI_MODEL_ID]!;

  // If no availability hint is given, trust the resolution as-is.
  if (!availableProviders || availableProviders.length === 0) return base;

  // If the resolved model's provider is available, use it.
  if (availableProviders.includes(base.provider)) return base;

  // Otherwise pick the first available model so the request doesn't fail.
  const fallback = AI_MODEL_REGISTRY.find((m) =>
    availableProviders.includes(m.provider),
  );
  return fallback ?? base;
}

/** Only the fields the client UI needs (avoids leaking anything sensitive). */
export function getPublicModelOptions() {
  return AI_MODEL_REGISTRY.map(({ id, label, description, provider }) => ({
    id,
    label,
    description,
    provider,
  }));
}
