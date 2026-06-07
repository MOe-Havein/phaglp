# PHAGLP AI Agent Rules (Antigravity + Gemini Engine)

This document defines the strict operational boundaries, engineering constraints, and programmatic guardrails for AI Agents running inside the PHAGLP application ecosystem using the **Antigravity** framework powered by **Google Gemini** models.

---

## 🏛️ Architectural Mandate

All AI interactions must remain deterministic, fully type-safe, and isolated from executing raw infrastructure-level mutations.

[User Input] ──> [Antigravity Agent + Gemini] ──> [Zod Validation] ──> [Next.js Server Action] ──> [Prisma DB]

## 🛡️ Core Engineering Rules

### 1. Zero Free-Text Execution (Strict Schema Mode)

- **Rule:** The Gemini model must _never_ return unvalidated free-form strings or markdown blocks for backend logic consumption.
- **Constraint:** You must use Gemini's structured JSON output mode wrapped inside Antigravity's schema definitions.
- **Enforcement:** Reject any agent output at runtime that fails immediate validation.

### 2. Prisma Enum & Type Synchronization

- **Rule:** The agent is completely forbidden from creating or hallucinating categories, statuses, or conditions.
- **Constraint:** Map native Prisma enums (`AssetCategory`, `AssetCondition`, `AssetStatus`) directly into the agent's Zod tool definitions.
- **Enforcement:** Use `z.nativeEnum()` transformations to throw early system errors before operations invoke database traffic.

### 3. Complete Server Action Isolation

- **Rule:** Antigravity agents are strictly prohibited from writing or invoking direct `prisma.query` blocks.
- **Constraint:** Agents can only alter system state by invoking designated Next.js Server Actions located within `@/lib/server/actions/*`.
- **Enforcement:** This maintains your atomic transaction state (`prisma.$transaction`) and verifies JWT httpOnly sessions natively.

### 4. Deterministic Error Trapping

- **Rule:** The agent must never bubble up raw Google Gemini or Antigravity runtime errors directly to the client UI.
- **Constraint:** All agent actions must be wrapped in your standardized client response signature: `ActionResponseState = { success: false, error: string }`.

---

## 🧠 Memory & Context Injection Rules

To prevent hallucinations, the agent must be heavily grounded using your application state:

- **Context Ingestion:** Never pass the entire database payload to Gemini. Instead, pre-filter data using specific Prisma query selections, then pass it to the agent inside the `systemInstruction` or user prompt.
- **Token Optimization:** Keep context inputs concise by stripping unneeded metadata columns (like `createdAt`, `updatedAt`) before presenting JSON strings to the model.

---

## 🛠️ Tool Calling & Function Execution Guardrails

When configuring Antigravity tools for Gemini to execute functions:

1.  **Read-Only Safe Tools:** Direct data lookups (e.g., checking asset availability) can be called automatically by the agent.
2.  **State-Mutating Tools:** Any action that creates, updates, or deletes records (e.g., creating an academy asset or updating a marriage profile) **must require explicit user confirmation** or a verified Next.js form state wrapper.

---

## 💻 Technical Blueprint Example

Add this implementation blueprint code block to your runtime files when binding your Antigravity workflows with Gemini:

```typescript
import { GoogleGenAI } from "@google/genai"; // Gemini SDK
import { AssetCategory } from "@prisma/client";
import { z } from "zod";
import type { ActionResponseState } from "@/types";

// Define strict structural rules matching the Prisma layer
export const InventoryClassificationSchema = z.object({
  category: z.nativeEnum(AssetCategory),
  justification: z.string().min(5),
  confidenceScore: z.number().min(0).max(1),
});

export type InventoryClassification = z.infer<
  typeof InventoryClassificationSchema
>;

/**
 * Antigravity Agent Task Execution Wrapper using Gemini
 */
export async function executeAntigravityInventoryAgent(
  userInput: string,
): Promise<ActionResponseState & { data?: InventoryClassification }> {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // Force Gemini into a structured JSON configuration using system instructions
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: userInput,
      config: {
        systemInstruction: `You are an operational inventory parsing agent for PHAGLP. 
                            Classify data exactly matching the validation schemas. 
                            Never hallucinate fields. Return strict JSON data.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            category: {
              type: "STRING",
              enum: Object.values(AssetCategory),
            },
            justification: { type: "STRING" },
            confidenceScore: { type: "NUMBER" },
          },
          required: ["category", "justification", "confidenceScore"],
        },
      },
    });

    const rawText = response.text;
    if (!rawText) throw new Error("Empty agent payload returned");

    // Enforce our local Next.js validation rules
    const parsedData = InventoryClassificationSchema.parse(JSON.parse(rawText));

    return {
      success: true,
      data: parsedData,
    };
  } catch (error) {
    // Graceful fallback prevents full app crashes if Upstash or Gemini experiences lag
    return {
      success: false,
      error:
        "The inventory agent timed out or returned invalid structural properties.",
    };
  }
}
```

---

## 🧪 Verification & Evals

To keep your application bug-free:

1.  **Strict Mode:** Ensure your TypeScript target configuration does not permit implicit `any` assignments within your agent setup loops.
2.  **Playwright Framework Integration:** Write a dedicated integration test suite tracking automated input sequences to ensure the structured parsing behaves reliably over updates.
