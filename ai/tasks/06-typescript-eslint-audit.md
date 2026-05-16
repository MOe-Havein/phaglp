# Task 6 — Syntax, Lint & TypeScript Safety Audit

Execute ONLY this task.

Completed Objectives:

- Resolved critical TypeScript errors in AdminPage, CoursesPage, and lecture-queries.ts.
- Fixed unescaped quote entities using &apos; and &quot;.
- Cleaned invalid imports in server utilities.

Requirements:

- Ensure:
  - ESLint passes
  - TypeScript passes
  - Next.js build passes
- Detect:
  - invalid JSX
  - broken imports
  - unbalanced braces
  - client/server directive violations

Rules:

- Keep changes minimal.
- Preserve application functionality.

Validation:

- npm run lint
- npm run build
- npm run type-check

After execution:

1. Show changed files.
2. Explain fixes applied.
3. Explain remaining warnings.
4. STOP.
