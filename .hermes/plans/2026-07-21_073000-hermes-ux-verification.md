# Concise Implementation Plan: Hermes UX Verification + Build Unblock

> **Plan mode:** No code changes in this turn. Execute only after explicit go-ahead.

**Goal:** Unblock build with required env, then verify and fix Hermes-first UX across chat, admin AI, course planner, and interactive concepts.

**Architecture:** Reuse `src/features/ai/src/providers/`; verify fallback UX; do not touch protected files.

**Tech Stack:** Next.js 15, TypeScript, TailwindCSS, Zod, React Hook Form, Shadcn UI.

---

## Context

- Provider refactor complete: Hermes primary, Cohere fallback.
- Typecheck passes.
- Full build blocked by missing `CLOUDINARY_URL`.
- UX review plan saved at `.hermes/plans/2026-07-21_070000-hermes-refactor-ux-review.md`.

---

## Tasks

### Task 1: Unblock build with required env

**Files:** `.env.local` or runtime env
**Steps:**

1. Export `CLOUDINARY_URL=cloudinary://177836185349364:kGyFPY5oQaHDtmBs8Jw0N9rzsKU@phaglp`
2. Run: `CLOUDINARY_URL=cloudinary://177836185349364:kGyFPY5oQaHDtmBs8Jw0N9rzsKU@phaglp npx next build`
3. If build passes, proceed. If it still fails, classify failure as infra/env and stop.
4. Commit env addition if approved.

### Task 2: Verify chat UX contract

**Files:** `src/app/api/chat/route.ts`, `src/components/chatbot/chatbot-widget.tsx`, `src/lib/chatbot.ts`
**Steps:**

1. Confirm widget shows loading and disables submit during provider calls.
2. Confirm fallback path shows generic message, not raw provider errors.
3. Run `npm run typecheck`.
4. List gaps only; no code changes yet.

### Task 3: Verify admin AI + course planner UX contract

**Files:** `src/components/control/ai-assistant-panel.tsx`, `src/lib/ai-assistant.ts`, `src/app/api/ai/generate/route.ts`, `src/app/api/courses/ai-planner/route.ts`, `src/app/api/ai-interactive-concepts/route.ts`
**Steps:**

1. Confirm actions return expected shapes: `outline`, `summary`, `fallacy-check`, `write-lecture`, `generate-quiz`, `generate-outline`.
2. Confirm JSON parse failures fall back to mock silently.
3. Run `npm run typecheck`.
4. List gaps only; no code changes yet.

### Task 4: Fix gaps from Tasks 2-3

**Files:** affected UI/API files only
**Steps:**

1. Add disabled submit state and generic fallback message if missing.
2. Normalize server-side error logging; keep user-facing text generic.
3. Ensure mock fallback is silent on parse failures.
4. Run `npm run typecheck` after each fix.
5. Commit with scope: `fix: hermes ux ...`.

### Task 5: Final verification + docs

**Files:** `.specify/specs/hermes-agent-integration.md`, any docs if behavior changed
**Steps:**

1. Run `npm run typecheck`.
2. Update Spec Kit spec if UX behavior differs.
3. Summarize refactor state and remaining blockers.

---

## Validation

- `npm run typecheck` after every task
- `next build` after Task 1 env addition
- Manual smoke test of affected routes/widgets if build passes

## Risks

- Credential exposure if env is committed. Keep local-only; do not commit `.env.local`.
- Build may still fail for unrelated reasons after env fix. Separate build result from refactor result.
