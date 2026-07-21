# Hermes Agent Refactor UX Verification & Completion Plan

> **For Hermes:** Do not execute implementation during this turn. This is plan mode only.

**Goal:** Verify the Hermes-first integration UX across chatbot, admin AI assistant, course planner, and interactive concepts surfaces, then complete any remaining refactor work needed for consistent user-facing behavior.

**Architecture:** Reuse the existing provider abstraction in `src/features/ai/src/providers/`, verify fallback UX, preserve existing JSON/markdown response shapes, and avoid touching protected files.

**Tech Stack:** Next.js 15 App Router, React Server Components, TailwindCSS, Zod validation, Shadcn UI, existing Hermes/Cohere provider layer.

---

## Current Context

### Completed integration work

- Provider layer added at `src/features/ai/src/providers/{hermes,cohere,cohere-client,index}.ts`
- `src/lib/chatbot.ts` migrated to Hermes-primary with Cohere fallback
- `src/lib/ai-assistant.ts` migrated to provider-backed actions
- `src/app/api/ai/generate/route.ts` updated to new signatures
- `src/app/api/courses/ai-planner/route.ts` refactored to shared providers and safe JSON parsing
- `src/app/api/ai-interactive-concepts/route.ts` refactored to provider-backed generation with mock fallback

### Likely UX risk areas

- Chat widget fallback messaging and loading state
- Admin AI panel UX after provider swap
- API response shape compatibility after JSON parsing/mocking
- Error surface consistency between Hermes failure and Cohere failure
- Type/route compatibility in `src/app/api/chat/route.ts`

---

### Task 1: Verify chat API contract compatibility

**Objective:** Ensure the public chat route and widget still receive the same shape after provider migration.

**Files:**

- Read: `src/app/api/chat/route.ts`
- Read: `src/components/chatbot/chatbot-widget.tsx`
- Read: `src/lib/chatbot.ts`
- Test: manual API call or curl against `/api/chat`

**Step 1: Inspect route/chat output shape**

Confirm `src/app/api/chat/route.ts` calls `answerQuestion()` and returns `{ reply, source? }` or whatever shape the widget expects. If the widget expects a different key, note mismatch.

**Step 2: Inspect widget state handling**

Confirm `src/components/chatbot/chatbot-widget.tsx` handles:

- Loading state while Hermes is called
- Fallback from Hermes to Cohere without exposing provider errors
- Empty or error responses gracefully

**Step 3: Run verification**

```bash
npm run typecheck
```

Expected: no TS errors.

**Step 4: Report UX gaps**

List any widget UX gaps:

- missing loading indicator,
- duplicate error banners,
- inconsistent button disabled state,
- message rendering for empty assistant text.

---

### Task 2: Verify admin AI assistant panel UX

**Objective:** Confirm the admin AI panel still works after moving to `src/lib/ai-assistant.ts` provider abstraction.

**Files:**

- Read: `src/components/control/ai-assistant-panel.tsx`
- Read: `src/lib/ai-assistant.ts`
- Read: `src/app/api/ai/generate/route.ts`

**Step 1: Map panel actions to provider calls**

Verify these actions still return expected display text:

- `outline`
- `summary`
- `fallacy-check`
- `write-lecture`

**Step 2: Check fallback visibility**

Ensure panel does not show raw provider error details when Hermes fails and Cohere succeeds.

**Step 3: Run verification**

```bash
npm run typecheck
```

Expected: no TS errors.

---

### Task 3: Verify course planner UX shape

**Objective:** Ensure course planner responses remain usable after Hermes-first refactor.

**Files:**

- Read: `src/app/api/courses/ai-planner/route.ts`
- Read: any client-side consumer of `src/app/api/courses/ai-planner/route.ts`

**Step 1: Compare response schemas**

These actions must still return compatible shapes:

- `write-lecture`: `{ success, content, source? }`
- `generate-quiz`: `{ success, content: combinedContent, source? }`
- `generate-outline`: `{ success, data: parsedCourse, source? }` or mock `{ success, data, source: "mock" }`

**Step 2: Verify JSON sanitization UX**

Confirm invalid Hermes JSON falls back cleanly to mock instead of returning a parse error to the user.

**Step 3: Run verification**

```bash
npm run typecheck
```

Expected: no TS errors.

---

### Task 4: Verify interactive concepts UX shape

**Objective:** Confirm interactive concepts behavior is coherent with the rest of the refactor.

**Files:**

- Read: `src/app/api/ai-interactive-concepts/route.ts`

**Step 1: Verify provider call shape**

Confirm GPT/Cohere response is normalized to plain text and then parsed as JSON.

**Step 2: Verify fallback UX**

Confirm failed generation returns mock content in the same structure as before.

**Step 3: Run verification**

```bash
npm run typecheck
```

Expected: no TS errors.

---

### Task 5: Capture UX fixes as concrete follow-up tasks

**Objective:** Convert any UX gaps discovered in Tasks 1-4 into implementation-ready fixes.

**Files:**

- Modify: `.hermes/plans/YYYY-MM-DD_HHMMSS-hermes-agent-refactor-ux-fixes.md` if created for next execution
- Modify: relevant UI files only for UX polish, limited to small state/render changes

**Step 1: Document fixes**

If widgets show loading inconsistently, create a follow-up plan task to add:

- disabled submit state during provider calls
- standardized error toast helper for AI actions

If admin panel exposes provider details, create task to:

- normalize response source logging to server-only telemetry
- keep user-facing text generic on fallback

**Step 2: Validation**

```bash
npm run typecheck
```

Expected: no TS errors.

## Tests / Validation

- `npm run typecheck` after each review task
- Manual curl or UI smoke test against affected routes if possible
- No new env vars required for verification of existing Hermes/Cohere paths

## Risks, Tradeoffs, and Open Questions

- **Risk:** Full production build cannot run in this environment because `CLOUDINARY_URL` is missing; this is unrelated to the Hermes refactor.
  - **Mitigation:** Plan uses `npm run typecheck` as the verification gate for code-path correctness.
- **Risk:** Client-side widgets may depend on exact fallback banner wording from the previous implementation.
  - **Mitigation:** Review widget text during Task 1 before changing user-facing copy.
- **Tradeoff:** Deep Playwright/RTL coverage is out of scope for this verification pass; plan focuses on contract and provider UX reviews only.
