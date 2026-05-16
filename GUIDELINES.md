# FreshNextJS Development Guidelines

This document outlines the architectural standards and development practices for the FreshNextJS project, established during the project audit on February 11, 2026.

## 1. Core Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (Strict Mode)
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** Auth.js v5 (Beta) with Credentials Provider
- **Styling:** TailwindCSS + Radix UI (shadcn/ui)
- **State/Experimental:** Statsig + Database-backed Feature Flags
- **AI Integration:** Google Gemini 1.5 Pro via `@ai-sdk/google`

## 2. Architectural Patterns

- **Route Isolation:**
  - `(public)`: Publicly accessible pages with standard site navigation.
  - `(admin)`: Protected admin dashboard. Authentication is handled via `src/middleware.ts`.
- **Layouts:** Use nested layouts to encapsulate specific functionality (e.g., sidebar in admin).
- **Client vs. Server:** Default to Server Components. Use `'use client'` sparingly for interactive elements only.

## 3. Database Standards

- **Source of Truth:** `prisma/schema.prisma` is the definitive schema.
- **Duplicates:** Ignore `docs/schema.prisma` as it is an outdated reference.
- **Naming:** Use `cuid()` for IDs. Use `@index` on foreign keys and frequently queried fields.
- **Migrations:** Always use `npx prisma migrate dev` for schema changes.

## 4. Authentication & Security

- **Mechanism:** Always use Auth.js v5 (`src/auth.ts`). Avoid using the legacy custom JWT logic in `src/lib/auth.ts`.
- **Passwords:** Never store plain-text passwords. Use `bcryptjs` with a salt round of 10.
- **Authorization:** Role-based access control (RBAC) should be enforced at the middleware and route handler levels using the `Role` enum.

## 5. UI/UX & Styling

- **Themes:** Support light, dark, and system themes via `next-themes`.
- **Animations:** Use `framer-motion` for transitions. Wrap page content in `<PageTransition>` where appropriate.
- **Responsive Design:** Mobile-first approach. Use `Sheet` for mobile menus and `Grid` for layout responsiveness.
- **Accessibility:** Ensure all interactive elements have appropriate ARIA labels and keyboard navigation support.

## 6. Testing Strategy

- **Unit/Integration:** Use Vitest for logic and component testing.
- **E2E:** Use Playwright for critical user flows (Authentication, Course Enrollment, Marriage Matching).
- **Configuration:** Maintain `playwright.config.ts` and `vitest.config.mjs` for respective runners.

## 7. Known Issues & TODOs

- **Layout Leakage:** Fix the admin login layout to prevent sidebar rendering before authentication.
- **Doc Cleanup:** Remove redundant files in `docs/` that conflict with `prisma/` and `src/`.
- **Type Safety:** Enable strict type checking in `next.config.mjs` (currently `ignoreBuildErrors: true`).
