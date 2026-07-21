# Hermes UX Verification + Env Fix Implementation Plan

> **For Hermes:** Plan-only mode. Do not execute without explicit go-ahead.

**Goal:** Unblock project builds by adding the required `CLOUDINARY_URL`, then complete the Hermes-first UX verification and fix any remaining user-facing regressions in chat, admin AI, course planner, and interactive concepts.

**Architecture:** Use existing provider layer `src/features/ai/src/providers/`; verify fallback UX; keep protected files untouched.

**Tech Stack:** Next.js 15, TypeScript, TailwindCSS, Prisma, React Hook Form + Zod, Shadcn UI, Hermes/Cohere providers.

---

## Current Context

- Hermes-first provider refactor is in place.
- Full build is currently blocked by missing `CLOUDINARY_URL`.
- Earlier UX review plan exists at `.hermes/plans/2026-07-21_070000-hermes-refactor-ux-review.md`.
- Typecheck passes; build has not been verified yet.

---

### Task 1: Add required Cloudinary env var

**Objective:** Unblock `next build`/build-time env validation by adding `CLOUDINARY_URL`.

**Files:**

- Modify: `.env.local` or CI environment config
- Verify: `next build` in test mode

**Step 1:** Add `CLOUDINARY_URL=cloudinary://177836185349364:kGyFPY5oQaHDtmBs8Jw0N9rzsKU@phaglp` to the local env file if this is a dev/unprotected environment.

**Step 2:** Run:

```bash
CLOUDINARY_URL=cloudinary://177836185349364:kGyFPY5oQaHDtmBs8Jw0N9rzsKU@phaglp npx next build
```

Expected: build proceeds past current Cloudinary env validation failure.

**Step 3:** If Cloudinary is not reachable/configured elsewhere, expect build-time validation failure unrelated to this refactor; in that case, mark the build blocker as infra/env rather than code.

---

### Task 2: Re-run UX contract review for chat surfaces

**Objective:** Confirm widget + route UX after provider migration.

**Files:**

- Read: `src/app/api/chat/route.ts`
- Read: `src/components/chatbot/chatbot-widget.tsx`
- Read: `src/lib/chatbot.ts`
- Read: `src/lib/ai-assistant.ts`
- Read: `src/app/api/ai/generate/route.ts`
- Read: `src/app/api/courses/ai-planner/route.ts`
- Read: `src/app/api/ai-interactive-concepts/route.ts`

**Step 1:** Verify loading state in widget is visible and submit is disabled during provider call.

**Step 2:** Verify fallback path does not expose provider error text to end users.

**Step 3:** Run:

```bash
npm run typecheck
```

Expected: no TS errors.

---

### Task 3: Fix UX gaps found in Task 2

**Objective:** Apply minimal UI/route fixes only if Task 2 reveals clear regressions.

**Files:**

- Modify: affected UI/API files only
- Test: same files as Task 2

**Step 1:** If chat widget lacks fallback UX, add:

- disabled submit during call
- generic fallback message on provider failure

**Step 2:** If admin AI panel surfaces raw provider errors, normalize to generic messages and keep source logging server-side.

**Step 3:** If course planner/interactive concepts JSON parsing exposes parse errors, ensure mock fallback is used silently.

**Step 4:** Run:

```bash
npm run typecheck
```

Expected: no TS errors.

---

### Task 4: Final verification + docs alignment

**Objective:** Confirm refactor state and keep Spec Kit aligned.

**Files:**

- Modify: `.specify/specs/hermes-agent-integration.md` if behavior changed
- Modify: docs if needed

**Step 1:** Run:

```bash
npm run typecheck
```

Expected: no TS errors.

**Step 2:** Update spec if provider UX behavior differs from planned.

**Step 3:** Commit and summarize exact refactor state and remaining blockers.

---

## Tests / Validation

- `npm run typecheck`
- `CLOUDINARY_URL=... npx next build` if env is approved for use
- Manual smoke check of affected routes/widgets if build passes

## Risks, Tradeoffs, and Open Questions

- **Risk:** Using the provided Cloudinary URL may expose credentials in local env if committed.
  - **Mitigation:** Treat as local-only; do not commit `.env.local`; remove after build verification if needed.
- **Risk:** Build may still fail for unrelated reasons once Cloudinary is available.
  - **Mitigation:** Separate build results from Hermes refactor results.
- **Open Question:** Should Cloudinary credentials stay in repo env permanently, or be replaced by CI secrets?
