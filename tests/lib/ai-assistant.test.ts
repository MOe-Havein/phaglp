import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/features/ai/src/providers", () => ({
  hermesChat: vi.fn(),
  cohereChat: vi.fn(),
}));

import { hermesChat, cohereChat } from "@/features/ai/src/providers";
import { generateOutline } from "@/lib/ai-assistant";

describe("ai-assistant provider fallback behavior", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("falls back to Cohere when Hermes returns empty text", async () => {
    (hermesChat as any).mockResolvedValueOnce("");
    (cohereChat as any).mockResolvedValueOnce("cohere lecture outline");

    const result = await generateOutline({
      title: "Test Lecture",
      category: "Philosophy",
    });

    expect(result.success).toBe(true);
    if (result.success && result.data) {
      expect(result.data).toBe("cohere lecture outline");
    }
    expect(cohereChat).toHaveBeenCalledTimes(1);
  });

  it("returns failure when Cohere fallback also throws", async () => {
    (hermesChat as any).mockRejectedValueOnce(new Error("hermes down"));
    (cohereChat as any).mockRejectedValueOnce(new Error("cohere down"));

    const result = await generateOutline({
      title: "Test Lecture",
      category: "Philosophy",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeTruthy();
    }
  });
});
