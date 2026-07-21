import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { hermesChat } from "@/features/ai/src/providers/hermes";

describe("hermesChat", () => {
  const originalBase = process.env.HERMES_API_BASE;
  const originalKey = process.env.HERMES_API_KEY;
  const originalModel = process.env.HERMES_MODEL;

  beforeEach(() => {
    process.env.HERMES_API_BASE = "http://localhost:11434/v1";
    process.env.HERMES_API_KEY = "test-key";
    process.env.HERMES_MODEL = "";
    vi.resetModules();
  });

  afterEach(() => {
    process.env.HERMES_API_BASE = originalBase;
    process.env.HERMES_API_KEY = originalKey;
    process.env.HERMES_MODEL = originalModel;
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it("throws when HERMES_API_BASE is missing", async () => {
    process.env.HERMES_API_BASE = "";

    await expect(
      hermesChat({
        messages: [{ role: "user", content: "hi" }],
      }),
    ).rejects.toThrow("HERMES_API_BASE and HERMES_API_KEY are required");
  });

  it("throws when HERMES_API_KEY is missing", async () => {
    process.env.HERMES_API_KEY = "";

    await expect(
      hermesChat({
        messages: [{ role: "user", content: "hi" }],
      }),
    ).rejects.toThrow("HERMES_API_BASE and HERMES_API_KEY are required");
  });
});
