# Task 4: Build Hardening & SEO Implementation

Execute ONLY this task.

Actions:

- Harden generateMetadata
- Harden getCachedLectures
- Prevent build-time DB crashes using safeDbQuery
- Add export const dynamic = "force-dynamic" where runtime rendering is safer
- Create:
  - src/app/sitemap.ts
  - src/app/robots.ts

Requirements:

- Build must succeed even if DB is offline
- Prevent prerender crashes
- Preserve SEO functionality

Rules:

- No UI redesign
- No unrelated refactors

Validation:

- next build must succeed
- sitemap.xml works
- robots.txt works
- dynamic slugs safe

After execution:

1. Show changed files
2. Explain runtime/static decisions
3. Explain fallback strategy
4. STOP
