# Audited & Resolved Issues List

Below is a complete, categorized catalog of the errors and warnings detected during the audit of the **Full-Stack-phagpl** application, along with the implemented fixes.

## 1. Next.js & Edge Runtime (`jose`)

- [x] **Warning:** `CompressionStream / DecompressionStream not supported in Edge Runtime` inside `middleware.ts`.
  - _Fix:_ Added dynamic webpack ignore warnings for `jose` in `next.config.mjs` and purged legacy unused files.
- [x] **Boundary Violation:** Invalid/unused import warnings for core packages in server components.
  - _Fix:_ Cleaned up obsolete imports in `lectures/page.tsx`, `users/page.tsx`, `courses/page.tsx`, and `messages/page.tsx`.

---

## 2. TypeScript Compilation Errors

- [x] **Error:** Unused imports and variables causing TypeScript compilation warnings.
  - _Fix:_ Cleaned up unused elements like `CardHeader`, `CardTitle`, and `Textarea` inside CMS lists and `edit-lecture-form.tsx`.
- [x] **Error:** `Cannot find name 'isRedirectError'` when attempting private Next.js imports.
  - _Fix:_ Defined a robust, custom, dependency-free `isRedirectError` helper inside `src/lib/utils.ts`.

---

## 3. Auth.js v5 Integration

- [x] **Error:** `CallbackRouteError` and failed credentials redirects inside try/catch blocks in Server Actions.
  - _Fix:_ Programmatically identified and re-thrown all redirect errors in `actions.ts` and `auth-actions.ts`.
- [x] **Bug:** Custom obsolete JWT handler file creating compilation conflicts.
  - _Fix:_ Safe-purged `src/lib/auth.ts` content.

---

## 4. Docker & CI/CD Pipelines

- [x] **Error:** Container registry push failure due to mixed-case repository names inside workflows.
  - _Fix:_ Implemented automatic case lowercasing steps inside `.github/workflows/build-push.yml`.
- [x] **Error:** Missing Prisma CLI/engines in the lightweight `standalone` production Docker runner, breaking migrations on secure, offline internal networks.
  - _Fix:_ Enhanced the builder stage to copy local `prisma` packages and binaries directly into the production container's `node_modules` during the runner build phase.
- [x] **Error:** Connection failures due to interpolation of empty environment values when compose files were run without host `.env` context.
  - _Fix:_ Structured safe default fallbacks for all environment parameters (such as `DATABASE_URL`) directly in the `docker-compose.yml` services.
