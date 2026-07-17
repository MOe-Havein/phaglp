# PHAGLP Engineering Audit & Architecture Assessment

> **For Hermes:** Analysis only. No code changes.

**Goal:** Produce a complete engineering audit of the Next.js/Prisma repository, covering architecture quality, maintainability, security, and enterprise readiness.

**Architecture:** Read-only repository reconnaissance focusing on directory layout, routing, state, auth, DB integration, client/server boundaries, reusable UI, data fetching, security, debt, scalability, and refactor roadmap.

**Tech Stack:** Next.js 15, React 19, TypeScript, Prisma 6 with LibSQL adapter, NextAuth v5, Tailwind/shadcn UI, Vitest + Playwright.

---

## 1. Directory Structure

Current top-level layout:

- `src/app/layout.tsx` — root layout, metadata generation, GA script/stats injection
- `src/app/(public)/*` — public site surfaces
- `src/app/(admin)/*` — admin control panel grouped under `/control`
- `src/app/login/page.tsx` — standalone login route
- `src/app/api/*` — app router API routes
- `src/components/ui` — reusable UI primitives
- `src/components/providers` — client providers (theme, auth, session, feature flags)
- `src/features/*` — partial feature-scoped folders for courses, blog, certificates, admin, dashboard
- `src/lib` — mixed utilities, server code, actions, database wrappers
- `src/server` — server-only repos/services/utils
- `src/lib/server/actions/admin` — newer admin server action helpers
- `prisma/` — schema, sqlite DB, seed/export utilities
- multiple root audit text files: `DESIGN.md`, `architecture-tree.txt`, `api-surface-area.txt`, `app-router-map.txt`, `feature-modules.txt`, `dependency-graph.txt`, `source-directory-map.txt`, `typescript-file-inventory.txt`, `ISSUE_LIST.md`, `PRODUCTION_CHECKLIST.md`

Assessment:

- Strong overall organization, but structure is inconsistent: feature folders coexist with page-driven controller blobs.
- `src/lib` mixes client/server concerns and contains large action monoliths.
- Admin and public surfaces are broadly separated via route groups, but not consistently enforced.

---

## 2. Feature / Module Organization

Key modules:

- Authentication/Authorization: `src/auth.ts`, `src/auth.config.ts`, `src/middleware.ts`, `src/lib/auth-actions.ts`, `src/lib/rbac.ts`, `src/lib/rbac/index.ts`
- Courses: `src/features/courses/*`, `src/lib/cms-actions.ts`, `src/lib/server/actions/admin/courses.ts`
- Blog: `src/features/blog/*`, CMS/blog pages under `/control/blog`
- Lectures: query/action layers in `src/features/courses/queries`, `src/lib/cms-actions.ts`, `src/lib/server/actions/admin/lectures.ts`
- Control Panel: `src/components/control/*`, admin pages, control-actions monolith
- Chatbot/AI: `src/lib/chatbot.ts`, `src/lib/ai-assistant.ts`, `src/lib/embeddings.ts`, `/api/chat`, `/api/ai/generate`
- Settings/SEO: `src/lib/server/site-settings.ts`, menus, actions under `/api/control/settings`

Assessment:

- Feature folders improve locality for courses, blog, certificates, dashboard.
- However, `src/lib/*.{ts,actions.ts}` contains large cross-cutting files that should be domain-scoped.
- Admin server action helpers exist alongside legacy control actions, indicating an in-progress migration.

---

## 3. Routing Architecture

Routes:

- Root layout: `src/app/layout.tsx` with hour-level revalidate
- Public layout: `src/app/(public)/layout.tsx` fetching site config + menus
- Admin layout: `src/app/(admin)/layout.tsx` enforcing session + ADMIN role via redirect
- Login: `src/app/login/page.tsx`
- API routes under `src/app/api/*`
- Admin control pages live under `/control/**`

Assessment:

- Modern App Router routing is correctly applied.
- `revalidate` at root layout may cause broad cache invalidation; page-level/cache-tag granularity is already present in some places and should be expanded.
- Admin route protection is split between `src/middleware.ts` and layout/server checks; need a single cross-cutting enforcement strategy.

---

## 4. State Management Architecture

Current patterns:

- Client React context for:
  - `ThemeProvider` with localStorage persistence
  - `AuthProvider` wrapping NextAuth session
  - `SessionProvider` for React client session access
  - `FeatureFlagProvider` using context
- `localStorage` used for:
  - theme persistence
  - implementation plan progress
  - task dashboard checklist
- `react/cache` used for server-side caching wrapper in `src/lib/server/cache.ts`

Assessment:

- Acceptable for small-scale needs, but lacks a global client state model beyond auth/theme.
- `localStorage` state is not synchronized with server truth, so behavior can diverge across devices or sessions.
- No observable state/tracking for complex UIs; likely leading to prop drilling and scattered client state.
- No server state layer beyond Next.js cache/fetch primitives.

---

## 5. Authentication Architecture

Implementation:

- NextAuth v5 with Credentials provider
- Password hashing: `bcryptjs`
- JWT sessions (`session.strategy: "jwt"`)
- Cookie config customized via `auth.config.ts`
- Middleware redirects unauthenticated users from `/control` to `/login`
- Admin layout reroutes non-admins to `/dashboard`
- `auth()` used pervasively in server components and server actions

Issues identified:

- `auth.config.ts` line 6 uses `process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || "default-secret"` — fallback secret is a critical security risk in production.
- `trustHost: true` present in `src/auth.ts` — weakens host validation, risk of header spoofing in proxy/multi-tenant contexts.
- Redundant auth wrappers:
  - `src/lib/auth-actions.ts` has broadly scoped server actions including auto sign-in after registration.
  - `src/lib/actions.ts` has overlapping `signInWithCredentials` and self-upgrade mutation.
- `registerUser` calls `signIn("credentials", ...)` inside a server action, coupling registration flow to auth internals.
- No centralized validation layer between forms and actions; schemas repeat inside action files.
- `src/lib/rbac.ts` and `src/lib/rbac/index.ts` are duplicate abstractions with inconsistent signatures/throws vs boolean returns.

---

## 6. Supabase Integration Quality

Observed findings:

- No Supabase integration found. The project uses Prisma with SQLite in development and `@prisma/adapter-libsql` for Turso/libsql compatibility.
- Database stack:
  - Prisma schema in `prisma/schema.prisma`
  - Dev DB: `prisma/dev.db`
  - Adapter pattern partially implemented in `src/lib/prisma.ts` and `src/lib/db/prisma.ts`
- This is a deliberate architectural choice rather than missing integration.

Issues:

- Duplicate DB init wrappers exist in `src/lib/prisma.ts` and `src/lib/db/prisma.ts`.
- Postgres/libsql/sqlite switching is unsophisticated: multiple files import different prisma singletons.

---

## 7. TypeScript Strictness Assessment

`tsconfig.json` strict settings:

- `strict: true`, `noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns`
- `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`, `useUnknownInCatchVariables`
- Path alias `@ -> ./src` and Next.js TS plugin enabled

Strengths:

- Strict config is strong for a Next.js app.
- Module augmentation for NextAuth in `src/types/next-auth.d.ts` preserves type safety.

Concerns:

- Significant `any` usage:
  - `auth.config.ts` callbacks cast to `any`
  - action files use `data: any`
  - parser/forms rely on implicit unknown anywhere
- Runtime-only sanitization is common; types don’t reflect validated shapes across action boundaries.
- Several ignore comments/loose typing likely appear in evolving action handlers.

Overall: Type discipline is medium; strict config exists but is undermined by permissive runtime patterns.

---

## 8. Server / Client Component Boundary Analysis

Server components dominate most pages, which is correct.
However:

- `src/app/layout.tsx` fetches `getSiteSettings()` and injects scripts/csp; layout revalidation is coarse (`3600`).
- `src/app/(public)/layout.tsx` also fetches menus/settings; repeated serialization to client.
- `src/components/providers/auth-provider.tsx` re-creates context from session, duplicating information already present in auth types.
- Rich client UI uses `localStorage`, `window.matchMedia`, `document.cookie` shallowly.
- Several heavy client components (`TasksDashboard`, `implementation-plan-client`, `chatbot-widget`, editor wrappers) contain Client-Side logic/data that could be partially moved to server with progressive enhancement.
- Mixed use of "use server" actions and client components creates risk of serialization issues.

Assessment: server/client split is acceptable but inconsistent. Priority should be limiting layout-level DB fetches and consolidating cached data.

---

## 9. Reusable UI System Analysis

UI layers:

- `src/components/ui/*` appears to be a shadcn/radix-derived component library
- `src/components/shared/*` marketer-facing presentational components
- `src/components/control/*` large admin-only forms/wizards
- `src/components/cards/*`, `src/components/home/*`, `src/components/editor/*`

Quality:

- Reusable primitives are comprehensive: buttons, drawers, forms, menus, sidebar, charts, toast.
- Pattern is good: isolated presentational component library plus feature-specific consumers.

Issues:

- `src/components/ui/toast.ts`, `use-toast.ts`, `toaster.ts`, and `sonner.ts` coexist; confused toast strategy.
- Duplicated UI concerns in `control/*` can be extracted into presentational pieces; many are 400+ line dashboards embedded as components.
- Heavy CSS class strings indicate missing design-token abstractions beyond tokens; repeated color/radius/spacing units likely duplicated.

---

## 10. Data Fetching Patterns

Patterns observed:

- Server Components call `prisma.*` directly (e.g., pages under `/(admin)/control/**`, `/(public)/dashboard/**`).
- Server Actions mutate state and call `revalidatePath`/`revalidateTag`.
- `src/lib/server/site-settings.ts`, `src/lib/server/menus.ts`, `src/lib/server/lectures.ts`, `src/lib/server/assets.ts` provide cached data layers.
- API routes repeat patterns but lack centralized error formatting.

Issues:

- No app-wide data layer contract — direct Prisma usage from pages creates coupling.
- Inconsistent cache keys/tags across mutations; risk of stale admin/data drift.
- No pagination standard observed in many queries (`findMany` without pagination).
- No loading/error boundary standard beyond ad hoc try/catch returns in actions.

---

## 11. Security Concerns

Critical:

- Fallback auth secret: `"default-secret"` in `src/auth.config.ts`.
- `trustHost: true` in NextAuth config.
- CSP includes `unsafe-eval` and `unsafe-inline` allowing XSS vectors via script injection.
- Redirect-after-login/registration targets are not validated; open redirect risk via `redirectTo` from form data in `src/lib/actions.ts`.

Moderate:

- Admin route access control is enforced in layout/redirect in addition to middleware, but RBAC enforcement is inconsistent in API routes and server actions.
- `/api/seed` endpoint may still exist and be discoverable in staging.
- Analytics/feature flags obtained client-side but driven server-side without clear consent gating.
- Cloudinary upload route falls back to client-provided cloud name from headers/env, increasing exposure if misconfigured.
- Password minimum length is 6 chars; modern baseline suggests 8+.

Low:

- Sensitive env keys noted: `VERCEL_API_TOKEN`, `COHERE_API_KEY`, `CLOUDINARY_API_SECRET`, `DATABASE_URL`, `TURSO_AUTH_TOKEN` — grouped handling needed.

---

## 12. Technical Debt Hotspots

High debt:

- `src/lib/control-actions.ts` — massive monolith containing full CRUD across many domains.
- `src/lib/cms-actions.ts` — another large domain-mixing action file.
- `src/lib/rbac.ts` + `src/lib/rbac/index.ts` duplicated logic.
- `src/lib/prisma.ts` and `src/lib/db/prisma.ts` duplicated Prisma instantiation.
- `src/components/control/TasksDashboard.tsx` — large client dashboard with business logic in UI.
- `src/features/dashboard/components/implementation-plan-client.tsx` — very large client component.

Medium debt:

- Mixed feature/page structure: efforts appear underway but haven’t removed legacy files.
- `src/auth.ts`, `src/auth.config.ts`, `src/middleware.ts` auth flow is fragmented; registration/login/self-upgrade split awkwardly.
- Redundant env var references across multiple files without a typed env validator (`zod`/`envalid`/`t3-env` absent).

---

## 13. Scalability Bottlenecks

Likely bottlenecks:

- Monolithic admin control surfaces with repeated layout-level DB calls.
- `src/app/(public)/layout.tsx` and root layout fetch data for every request and revalidate hourly; TTFB may grow with schema complexity.
- No pagination/cursor pattern for public list pages (`blog`, `lectures`, `courses`).
- No effective CDN/edge caching strategy beyond `revalidate` tags in server components.
- Architectural drift between pages and feature folders will increase merge/refactor cost.
- Admin surfaces depend on client localStorage task state; not scalable to multi-user environments.

---

## 14. Refactor Recommendations

1. Consolidate database initialization into one `lib/db/prisma.ts`; remove `lib/prisma.ts` or define a clear import boundary and document adapter target.
2. Remove duplicated RBAC module; standardize on one helper set with consistent error/result contract, and enforce it in every protected route/action.
3. Split `control-actions.ts` and `cms-actions.ts` into domain actions under:
   - `src/server/actions/{courses,lectures,blogs,users,settings}.ts`
4. Replace `default-secret` with forced required env + startup runtime validation or build-time schema check.
5. Remove `trustHost: true` or replace with explicit allowed origin list or Vercel-aware detection.
6. Centralize env validation using `zod` or `t3-env` to prevent silent fallback.
7. Introduce pagination abstraction for list pages to prevent unbounded queries.
8. Standardize API error response format and validation via wrappers.
9. Migrate client-localStorage dashboards to server-backed persisted state where persistence is needed.
10. Consolidate toast strategy to one implementation; prefer `sonner`.
11. Extract reusable UI patterns from `control/*` into `shared/*` and `ui/*`.
12. Refactor large client components into smaller presentational + container patterns.
13. Replace broad layout fetch with segment caching, Nested Layouts, and parallel requests via `cacheTag` patterns.
14. Audit and remove `/api/seed` in production; gate with `NODE_ENV === development`.

---

## 15. Suggested Enterprise Architecture Improvements

1. Layered architecture boundary docs:
   - Core entities: `User`, `Course`, `Lecture`, `Lesson`, `Page`, `Post`, `NavigationMenu`, `SiteSettings`, `FeatureFlag`, `ContactMessage`, `ChatMessage`, `KnowledgeBase`, `AcademyAsset`, `Analytics`
   - Adapter layer for DB provider switching
   - Use-case layer that owns validation, authz, and business rules
2. Authorization hardened to all mutations:
   - Enforce RBAC before every write action by default.
   - Add audit logging with `analytics` or new audit table for admin mutations.
3. Adopt structured logging/observability:
   - Current naive logger exists under `src/lib/server/logger.ts`; enhance with request IDs, tenant/host context, and redaction rules.
4. Add a typed env layer and fail-closed startup checks.
5. Improve CSP hygiene:
   - Remove `unsafe-eval`/`unsafe-inline` where possible; align with strict-dynamic if necessary.
6. Introduce a feature flag gateway utilization that restricts runtime flags rather than DB-backed blob.
7. Normalize caching:
   - Use `next: { revalidate }` in fetch wrappers consistently; prefer `fetch` over direct prisma calls for external integrations.
8. Payment/subscription/entitlement model:
   - `SubscriptionTier` already exists; ensure it drives authorization/entitlement checks in UI and API.
9. CI hardening:
   - Typecheck + lint already defined; add mutation test or integration harness around `src/server/*`.
10. Documentation as code:
    - Keep `DESIGN.md`, `PRODUCTION_CHECKLIST.md`, `ISSUE_LIST.md` current; add ADRs for major refactors.

---

### Audit Summary Scorecard

| Area                     | Rating     | Notes                                                                        |
| ------------------------ | ---------- | ---------------------------------------------------------------------------- |
| Directory structure      | Good       | Route groups mostly clean; src/lib still mixed                               |
| Modular organization     | Medium     | Feature folders partial; large cross-cutting action files                    |
| Routing                  | Good       | App Router used correctly; cache hygiene can improve                         |
| State management         | Medium     | No global store; localStorage drift risk                                     |
| Auth architecture        | Medium     | Strong NextAuth foundation; hardening gaps in config                         |
| DB integration           | Good       | Prisma chosen well; duplicate wrappers create risk                           |
| TypeScript strictness    | Medium     | Strict config exists; runtime typing leaks                                   |
| Server/client boundaries | Medium     | Layout fetches broad; mixed hydration concerns                               |
| Reusable UI              | Good       | Strong primitive library; unused toast variants                              |
| Data fetching            | Medium     | Good segment/tag caching in some areas; inconsistent elsewhere               |
| Security                 | Medium     | Solid base; fallback secret, CSP looseness, trustHost need attention         |
| Technical debt           | High       | `control-actions.ts`, duplicated RBAC/Prisma files                           |
| Scalability              | Medium-y   | Acceptable early scale; list pagination and cache strategies needed at scale |
| Enterprise readiness     | Low-Medium | Needs env validation, observability, hardened RBAC, segment architecture     |
| Recommended urgency      | High       | Auth hardening and monolith splitting first; CI/docs second                  |

---

Plan complete and saved at `.hermes/plans/2026-07-15_051500-engineering-audit-phaglp.md`.
