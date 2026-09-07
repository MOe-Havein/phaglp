import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// server-only throws when imported outside a React Server Component
// environment, so stub it out for the node test runtime.
vi.mock("server-only", () => ({}));

// Hoist the spies so they are available inside the hoisted vi.mock factories.
const { mockChat, mockGenerateText, mockGoogle } = vi.hoisted(() => ({
  mockChat: vi.fn(),
  mockGenerateText: vi.fn(),
  mockGoogle: vi.fn(),
}));

vi.mock("cohere-ai", () => ({
  CohereClient: class {
    v2 = { chat: mockChat };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(_opts: unknown) {}
  },
}));

vi.mock("ai", () => ({
  generateText: mockGenerateText,
}));

vi.mock("@ai-sdk/google", () => ({
  google: mockGoogle,
}));

import {
  resolveModelForRequest,
  generateChatText,
} from "@/lib/ai-client";
import { AI_PROVIDERS } from "@/lib/ai-models";

const ORIGINAL_ENV = { ...process.env };

beforeEach(() => {
  // Start each test with a clean, deterministic environment.
  delete process.env.COHERE_API_KEY;
  delete process.env.GOOGLE_API_KEY;
  vi.clearAllMocks();
});

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

describe("resolveModelForRequest", () => {
  it("resolves a google model id to provider google with the correct param", () => {
    process.env.GOOGLE_API_KEY = "test-google-key";
    const result = resolveModelForRequest("google-gemini-2.0-flash", null);
    expect(result).toEqual({
      modelId: "google-gemini-2.0-flash",
      provider: AI_PROVIDERS.GOOGLE,
      param: "gemini-2.0-flash",
    });
  });

  it("falls back to the default cohere model when no ids are provided", () => {
    process.env.COHERE_API_KEY = "test-cohere-key";
    const result = resolveModelForRequest(null, null);
    expect(result.provider).toBe(AI_PROVIDERS.COHERE);
    expect(result.modelId).toBe("cohere-command-a-reasoning");
  });
});

describe("generateChatText", () => {
  it("routes to Google Gemini and returns its text", async () => {
    process.env.GOOGLE_API_KEY = "test-google-key";
    mockGoogle.mockReturnValue("fake-google-model");
    mockGenerateText.mockResolvedValue({ text: "gemini-output" });

    const result = await generateChatText({
      modelId: "google-gemini-1.5-pro",
      messages: [{ role: "user", content: "hello" }],
    });

    expect(result.text).toBe("gemini-output");
    expect(result.provider).toBe(AI_PROVIDERS.GOOGLE);
    expect(mockGoogle).toHaveBeenCalledWith("gemini-1.5-pro");
    expect(mockGenerateText).toHaveBeenCalledOnce();
  });

  it("routes to Cohere and returns its text", async () => {
    process.env.COHERE_API_KEY = "test-cohere-key";
    mockChat.mockResolvedValue({
      message: {
        content: [{ type: "text", text: "cohere-output" }],
      },
    });

    const result = await generateChatText({
      modelId: "cohere-command-a-reasoning",
      messages: [{ role: "user", content: "hello" }],
    });

    expect(result.text).toBe("cohere-output");
    expect(result.provider).toBe(AI_PROVIDERS.COHERE);
    expect(mockChat).toHaveBeenCalledOnce();
  });
});
