import { describe, it, expect, vi, beforeEach } from "vitest";
import { answerQuestion } from "@/lib/chatbot";

vi.mock("@/lib/embeddings", () => ({
  generateTextEmbedding: vi.fn(() => Promise.resolve(new Array(1536).fill(0))),
  cosineSimilarity: vi.fn(() => 0.5),
}));

vi.mock("@/features/ai/src/providers", () => ({
  hermesChat: vi.fn(),
  cohereChat: vi.fn(),
}));

import { hermesChat, cohereChat } from "@/features/ai/src/providers";

describe("answerQuestion fallback UX", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("falls back to Cohere when Hermes throws", async () => {
    (hermesChat as any).mockRejectedValueOnce(new Error("hermes down"));
    (cohereChat as any).mockResolvedValueOnce("fallback answer");

    const result = await answerQuestion("What is PHAGLP?", {
      sessionId: "test-session",
    });

    expect(result.success).toBe(true);
    if (result.success && result.data) {
      expect(result.data.answer).toBe("fallback answer");
    }
    expect(hermesChat).toHaveBeenCalledTimes(1);
    expect(cohereChat).toHaveBeenCalledTimes(1);
  });

  it("returns failure when both providers fail", async () => {
    (hermesChat as any).mockRejectedValueOnce(new Error("hermes down"));
    (cohereChat as any).mockRejectedValueOnce(new Error("cohere down"));

    const result = await answerQuestion("What is PHAGLP?");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeTruthy();
    }
  });
});
