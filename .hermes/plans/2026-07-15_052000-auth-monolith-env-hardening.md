# Auth Hardening, Monolith Split, and Env Validation Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Harden authentication, split large server action monoliths into domain-scoped files, and centralize env validation to eliminate unsafe fallbacks.

**Architecture:** Introduce a single typed env module, consolidate duplicated DB/RBAC/auth utilities, then migrate select pages/actions from `src/lib/control-actions.ts` and `src/lib/cms-actions.ts` into domain directories under `src/server/actions/*` while keeping backward-compatible re-exports.

**Tech Stack:** Next.js 15, React 19, TypeScript 5.x, Prisma 6, NextAuth v5, Zod, pnpm.

---

## Assumptions

- The workspace is at `D:\phaglp\testa-phaglp2`.
- All changes stay read-only outside new plan/task artifacts unless explicitly implemented by the execution phase.
- `tsc --noEmit` runs cleanly or can be made cleanable during implementation.
- We preserve existing public routes and backward-compatible imports during refactor.

---

## Phase A: Env Validation First

### Task A1: Audit all direct `process.env` usages and create typed env module

**Objective:** Document every env reference so later tasks target exact files.

**Files:**

- Audit only: read `src/**/*.ts`, `src/**/*.tsx`, `src/middleware.ts`, `src/auth.ts`

**Step 1:** Search usages:

```bash
rg -n "process\.env\." src src/middleware.ts src/auth.ts > env_usage_audit.txt
```

**Step 2:** Record counts by variable. Expected key variables include:

- `NEXTAUTH_SECRET` / `AUTH_SECRET`
- `NODE_ENV`
- `DATABASE_URL` / `TURSO_AUTH_TOKEN`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_URL` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET`
- `COHERE_API_KEY`
- `VERCEL_API_TOKEN`
- `NEXT_PUBLIC_STATSIG_CLIENT_KEY`
- `CONVERTKIT_API_KEY` / `CONVERTKIT_FORM_ID`
- `NEXT_RUNTIME`

**Verification:** `wc -l env_usage_audit.txt`; no fixing code here.

---

### Task A2: Add zod-based env schema

**Objective:** Fail fast in non-production if critical vars are missing.

**Files:**

- Create: `src/env.ts`
- Modify: `src/lib/prisma.ts:1-20`, `src/lib/db/prisma.ts:1-20`, `src/auth.config.ts:1-10`, `src/app/api/upload/route.ts:1-30`, `src/app/api/sign-cloudinary-params/route.ts:1-30`, `src/app/api/vercel-monitor/route.ts`, `src/app/api/courses/ai-planner/route.ts`, `src/app/api/ai-interactive-concepts/route.ts`, `src/lib/embeddings.ts`, `src/lib/chatbot.ts`, `src/lib/ai-assistant.ts`, `src/actions/convertkit.ts`, `src/actions/vercel.ts`, `src/lib/server/utils/logger.util.ts`, `src/lib/server/logger.ts`, `src/lib/server/middlewares/api-handler.ts`

**Step 1: Write failing conceptual contract**
No runtime test yet; insert validation in `src/env.ts`.

**Step 2: Create env module**

Create `src/env.ts` with Zod schema similar to:

```ts
import { z } from "zod";

const onlyServer = z.string().min(1, "Required server env missing");
const onlyServerOpt = z.string().optional();
const publicStr = z.string().optional();

export const env = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]),
    NEXTAUTH_SECRET: onlyServer,
    AUTH_SECRET: onlyServerOpt,
    DATABASE_URL: onlyServer,
    TURSO_AUTH_TOKEN: onlyServerOpt,
    CLOUDINARY_URL: onlyServerOpt,
    CLOUDINARY_CLOUD_NAME: onlyServerOpt,
    CLOUDINARY_API_KEY: onlyServerOpt,
    CLOUDINARY_API_SECRET: onlyServerOpt,
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: publicStr,
    COHERE_API_KEY: onlyServerOpt,
    VERCEL_API_TOKEN: onlyServerOpt,
    NEXT_PUBLIC_STATSIG_CLIENT_KEY: publicStr,
    CONVERTKIT_API_KEY: onlyServerOpt,
    CONVERTKIT_FORM_ID: onlyServerOpt,
  })
  .parse(process.env);

export type Env = z.infer<typeof env>;
```

**Step 3: Swap `process.env.*` to `env.*` in the files above**

Replace direct usages with `env` imports and eliminate fallbacks like `"default-secret"` and `"phaglp"`.

**Verification:**
Run: `pnpm run typecheck`
Expected: type errors only from leftover runtime string literals; update until clean.

---

## Phase B: Auth Hardening

### Task B1: Remove auth secret fallback and tighten host trust

**Objective:** Eliminate production-recovery use of a default secret; remove or gate `trustHost`.

**Files:**

- Modify: `src/auth.config.ts`
- Modify: `src/auth.ts`
- Modify: `src/middleware.ts`
- Modify: `src/app/api/auth/login/route.ts`

**Step 1: Remove fallback secret**

In `src/auth.config.ts`, change:

```ts
secret:
  process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || "default-secret",
```

to:

```ts
secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
```

**Step 2: Add startup assertion**

Add after env validation in `src/env.ts`:

```ts
if (!process.env.NEXTAUTH_SECRET && !process.env.AUTH_SECRET) {
  throw new Error("Missing NEXTAUTH_SECRET or AUTH_SECRET");
}
```

**Step 3: Gate `trustHost`**

Remove `trustHost: true` from `src/auth.ts`. If multi-tenant host allowance is still required, replace with a strict allowlist based on `env`.

**Step 4: Fix login open redirect**

In `src/app/api/auth/login/route.ts` and `src/lib/actions.ts`, ensure redirect target is validated against a known route list or current host before redirecting.

**Verification:**
Run: `pnpm run typecheck`
Run: `pnpm run build`
Expected: build succeeds; auth path reads secret from env only.

---

### Task B2: Unify duplicated auth server actions

**Objective:** Have one canonical auth action surface.

**Files:**

- Modify: `src/lib/auth-actions.ts`
- Modify: `src/lib/actions.ts`
- Update call sites importing from these modules

**Step 1: Remove auto sign-in from registration action**
`registerUser` should return success but not call `signIn` directly.

**Step 2: Keep `signInWithCredentials` in `src/lib/actions.ts`**
Remove duplicate `signIn` retry logic; allow redirect errors to bubble.

**Step 3: Add exports map file**

Create `src/lib/server/actions/auth.ts` with:

- `register(data)`
- `signInWithCredentials(formDataOrPayload)`
  Client-side forms should call these only.

**Step 4: Re-export canonical paths**

In `src/lib/auth-actions.ts` and `src/lib/actions.ts`, re-export only the canonical functions from `src/lib/server/actions/auth.ts`.

**Verification:**
Run: `grep -R "from \"@/lib/auth-actions\"" src | wc -l` and `grep -R "from \"@/lib/actions\"" src | wc -l`
Expected: both imports still resolve via re-exports; no duplicate implementations of `signIn` logic.

---

## Phase C: RBAC Consolidation

### Task C1: Delete duplicated RBAC helper and standardize error contract

**Objective:** One RBAC module, one contract.

**Files:**

- Remove: `src/lib/rbac.ts`
- Modify: `src/lib/rbac/index.ts`
- Update imports across `src/app/api/control/*`, `src/lib/control-actions.ts`, `src/lib/cms-actions.ts`, `src/lib/server/actions/admin/*`

**Step 1: Delete `src/lib/rbac.ts`**

**Step 2: Normalize `src/lib/rbac/index.ts`**
Provide:

```ts
export async function requireRole(allowedRoles: string[]) {
  const session = await auth();
  if (!session?.user) throw new Error("UNAUTHENTICATED");
  const role = session.user.role || "";
  if (!allowedRoles.includes(role)) throw new Error("UNAUTHORIZED");
  return { userId: session.user.id, email: session.user.email, role };
}

export function requireAdmin() {
  return requireRole(["ADMIN"]);
}

export function requireAdminOrInstructor() {
  return requireRole(["ADMIN", "INSTRUCTOR"]);
}
```

**Step 3: Update imports**
Replace allowedRoles imports with `requireAdmin()`/`requireAdminOrInstructor()`.

**Verification:**
Run: `grep -R "src/lib/rbac" src | wc -l` should stay constant but point to `src/lib/rbac/index.ts` only.

---

## Phase D: Database Singleton Consolidation

### Task D1: Canonicalize to `src/lib/db/prisma.ts`, deprecate `src/lib/prisma.ts`

**Objective:** One Prisma client source with typed env usage.

**Files:**

- Modify: `src/lib/db/prisma.ts`
- Deprecate: `src/lib/prisma.ts`
- Update all imports across `src`

**Step 1: Remove Proxy auto-mocking from `src/lib/db/prisma.ts`**
Production should not mask DB errors as `[]`/`null` silently.

**Step 2: Add typed env usage**
Import `env` from `src/env.ts` and remove direct `process.env.DATABASE_URL` fallback.

**Step 3: Re-export from deprecated path**
In `src/lib/prisma.ts`, replace body with:

```ts
export {
  prisma as default,
  serializePrisma,
  safeDbQuery,
} from "@/lib/db/prisma";

/* @deprecated use `src/lib/db/prisma.ts` */
```

This preserves imports during refactor.

**Step 4: Search/replace imports in batches**
Target only files importing `from "@/lib/prisma"` or `from "@/lib/db/prisma"`; normalize to the canonical path if desired in later cleanup, but keep deprecated re-export working now.

**Verification:**
Run: `grep -R 'from "@/lib/prisma"' src | wc -l`
Expected: same count, all still resolve correctly.

---

## Phase E: Monolith Splitting

### Task E1: Split `src/lib/control-actions.ts` into domain files

**Objective:** Reduce 500-line monolith into domain-scoped server actions.

**Files:**

- Create: `src/server/actions/users.actions.ts`
- Create: `src/server/actions/admin.actions.ts` (for delete cascade)
- Modify: `src/lib/control-actions.ts`

**Step 1: Create `users.actions.ts`**
Move: `createUser`, `updateUser`, `updateUserRole`, `updateUserTier`, `getControlAnalytics`, `getRecentAnalytics`, `trackAnalytics`

**Step 2: Create `admin.actions.ts`**
Move: `deleteUser` and grouped site settings / feature flag mutations.

**Step 3: Keep re-exports in `src/lib/control-actions.ts`**
For backward compatibility:

```ts
export { createUser } from "@/server/actions/users.actions";
/* etc */
```

**Step 4: Update admin pages/components imports**
Prefer new paths after migration phase; keep old working.

**Verification:**
Run: `pnpm run typecheck`
Run: `pnpm run build`

---

### Task E2: Split `src/lib/cms-actions.ts` into domain files

**Objective:** Separate course, lecture, page, menu concerns.

**Files:**

- Create: `src/server/actions/courses.actions.ts`
- Create: `src/server/actions/lectures.actions.ts`
- Create: `src/server/actions/pages.actions.ts`
- Modify: `src/lib/cms-actions.ts`

**Step 1: Courses**
Move: course CRUD, module/lesson creation, course outline/curriculum mutations. Remove duplicated `ensureAdminOrInstructor()` inside this file; require import from unified RBAC.

**Step 2: Lectures**
Move: lecture create/update/delete helpers. Align with existing `src/server/repositories/lecture.repository.ts` and `src/features/courses/queries/lecture-queries.ts`.

**Step 3: Pages**
Move: page/menu create/update/delete logic to `pages.actions.ts`; use `MenuForm` actions as needed.

**Step 4: Re-export to preserve consumers**
In `src/lib/cms-actions.ts`, re-export canonical paths.

**Verification:**
Run: `pnpm run typecheck`
Run: `pnpm run build`

---

## Phase F: CSP Tightening

### Task F1: Relax or remove `unsafe-eval`/`unsafe-inline` from middleware CSP

**Objective:** Reduce XSS surface while preserving Cloudinary/Vercel/editor needs.

**Files:**

- Modify: `src/middleware.ts`

**Step 1:** Keep editor-ish requirements scoped to actual page routes, not globally.
**Step 2:** If `@tiptap` or `lowlight` require eval, document exact module hash allowlist instead.
**Step 3:** Remove unused `connect-src` hosts if no websockets.

**Verification:**
Run: `pnpm run typecheck`
Use browser devtools after deploy to confirm console sanitization success.

---

## Phase G: Validation and CI Hooks

### Task G1: Typecheck and build pass

**Step 1:** `pnpm run typecheck`
**Step 2:** `pnpm run build`
**Step 3:** `pnpm run format`

### Task G2: Add pre-deploy env check script

**Objective:** Prevent deploys when critical env is missing.

**Files:**

- Create: `scripts/check-env.ts`
- Modify: `package.json` scripts

**Step 1: Create script**

```ts
import { env } from "../src/env";
console.log("Env OK");
```

**Step 2: Add package script**
`"check:env": "tsx scripts/check-env.ts"`

**Verification:**
Run with missing `NEXTAUTH_SECRET` locally:

```bash
set -a; unset NEXTAUTH_SECRET; set +a; pnpm check:env
```

Expected: script errors with required missing message.

---

## Files Likely To Change

- `src/env.ts`
- `src/auth.config.ts`
- `src/auth.ts`
- `src/middleware.ts`
- `src/lib/prisma.ts`
- `src/lib/db/prisma.ts`
- `src/lib/actions.ts`
- `src/lib/auth-actions.ts`
- `src/lib/cms-actions.ts`
- `src/lib/control-actions.ts`
- `src/lib/rbac/index.ts`
- `src/lib/rbac.ts`
- `src/server/actions/*`
- `src/app/api/auth/login/route.ts`
- `src/app/api/control/settings/route.ts`
- `src/app/api/control/features/route.ts`
- `src/app/api/upload/route.ts`
- `src/app/api/sign-cloudinary-params/route.ts`
- `src/app/api/vercel-monitor/route.ts`
- `src/app/api/courses/ai-planner/route.ts`
- `src/app/api/ai-interactive-concepts/route.ts`
- `src/lib/embeddings.ts`
- `src/lib/chatbot.ts`
- `src/lib/ai-assistant.ts`
- `src/actions/convertkit.ts`
- `src/actions/vercel.ts`
- `src/lib/server/utils/logger.util.ts`
- `src/lib/server/logger.ts`
- `src/lib/server/middlewares/api-handler.ts`
- `scripts/check-env.ts`
- `package.json`

---

## Tests / Validation

- `pnpm run typecheck`
- `pnpm run build`
- `pnpm run format`
- Add focused unit coverage for `src/env.ts` via Vitest if test harness exists.
- Manual auth redirect behavior in `http://localhost:3000` and `/control/*`.

---

## Risks, Tradeoffs, and Open Questions

- Breaking change risk: removing DB proxy fallback may expose runtime path previously hidden in non-critical UI. Decide whether throttling/logging is acceptable versus silence.
- Deprecation timeline: keep re-export aliases or delete legacy paths in a follow-up pass.
- CSP changes may break third-party widgets; keep allowlist narrow and monitor console.
- NextAuth v5 beta may change APIs; pin auth-related refactors unless upgrading is part of this pass.
- Confirm whether `trustHost` was intentionally added for Vercel proxy handling.

---

Plan complete and saved.
