import { describe, it, expect } from "vitest";
import {
  AI_PROVIDERS,
  DEFAULT_AI_MODEL_ID,
  resolveAIModel,
  getPublicModelOptions,
  type AIModelOption,
} from "@/lib/ai-models";

describe("resolveAIModel", () => {
  it("returns the default model when called with no args", () => {
    const model = resolveAIModel();
    expect(model.id).toBe(DEFAULT_AI_MODEL_ID);
    expect(model.provider).toBe(AI_PROVIDERS.COHERE);
  });

  it("returns a google model when given a valid google id", () => {
    const model = resolveAIModel("google-gemini-1.5-pro");
    expect(model.provider).toBe(AI_PROVIDERS.GOOGLE);
    expect(model.id).toBe("google-gemini-1.5-pro");
  });

  it("falls back to the default (no throw) for an invalid id", () => {
    const model = resolveAIModel("totally-invalid-id");
    expect(model.id).toBe(DEFAULT_AI_MODEL_ID);
    expect(model.provider).toBe(AI_PROVIDERS.COHERE);
  });

  it("falls back to the first available provider model when requested provider is unavailable", () => {
    const model = resolveAIModel("cohere-command-a-reasoning", [
      AI_PROVIDERS.GOOGLE,
    ]);
    expect(model.provider).toBe(AI_PROVIDERS.GOOGLE);
    expect(model.id).toBe("google-gemini-1.5-pro");
  });
});

describe("getPublicModelOptions", () => {
  it("returns public options without leaking the internal param field", () => {
    const options = getPublicModelOptions();
    expect(Array.isArray(options)).toBe(true);
    expect(options.length).toBeGreaterThan(0);

    for (const option of options as AIModelOption[]) {
      expect(option).toHaveProperty("id");
      expect(option).toHaveProperty("label");
      expect(option).toHaveProperty("provider");
      expect(option).toHaveProperty("description");
      expect(option).not.toHaveProperty("param");
    }
  });
});
