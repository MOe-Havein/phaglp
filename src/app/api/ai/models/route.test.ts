import { describe, it, expect, vi, beforeEach } from "vitest";
import type { AIProvider } from "@/lib/ai-models";

type AuthSession = { user?: { id?: string } } | null;

const mockModels = [
  {
    id: "cohere-command-a-reasoning",
    label: "Cohere Command A Reasoning",
    provider: "cohere" as AIProvider,
    description: "Cohere reasoning model.",
  },
  {
    id: "google-gemini-2.0-flash",
    label: "Google Gemini 2.0 Flash",
    provider: "google" as AIProvider,
    description: "Google Gemini Flash.",
  },
];

const mockProviders: AIProvider[] = ["cohere", "google"];

const mocked = vi.hoisted(() => ({
  auth: vi.fn<() => Promise<AuthSession>>(),
  getPublicModelOptions: vi.fn<() => typeof mockModels>(),
  configuredProviders: vi.fn<() => typeof mockProviders>(),
}));

vi.mock("@/auth", () => ({ auth: mocked.auth }));
vi.mock("@/lib/ai-models", () => ({
  getPublicModelOptions: mocked.getPublicModelOptions,
}));
vi.mock("@/lib/ai-client", () => ({
  configuredProviders: mocked.configuredProviders,
}));

import { GET } from "./route";

describe("GET /api/ai/models", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocked.getPublicModelOptions.mockReturnValue(mockModels);
    mocked.configuredProviders.mockReturnValue(mockProviders);
  });

  it("returns 401 when unauthenticated", async () => {
    mocked.auth.mockResolvedValue(null);

    const res = await GET();
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body).toEqual({ error: "Unauthorized" });
  });

  it("returns 401 when session has no user id", async () => {
    mocked.auth.mockResolvedValue({ user: {} } as AuthSession);

    const res = await GET();
    expect(res.status).toBe(401);
  });

  it("returns 200 with models and configuredProviders when authenticated", async () => {
    mocked.auth.mockResolvedValue({ user: { id: "user_123" } } as AuthSession);

    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({
      models: mockModels,
      configuredProviders: mockProviders,
    });
    expect(Array.isArray(body.models)).toBe(true);
    expect(Array.isArray(body.configuredProviders)).toBe(true);
  });
});
