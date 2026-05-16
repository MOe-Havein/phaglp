# Task 1 — Database Layer Stabilization & Runtime Fixes

Execute ONLY this task.

Completed Objectives:

- Removed the neon-serverless WebSocket adapter and ws dependencies to eliminate ErrorEvent serialization crashes.
- Consolidated the Prisma client into a singleton-safe initialization in src/lib/prisma.ts.
- Implemented safeDbQuery and serializePrisma utilities to wrap every database call in a try/catch block.
- Normalized Prisma output by converting Dates to ISO strings before reaching Client Components.

Requirements:

- Ensure Next.js 15 compatibility.
- Prevent ErrorEvent, AggregateError, and Prisma errors from crossing RSC boundaries.
- Ensure only serializable JSON objects reach Client Components.
- Keep Prisma runtime production-safe.

Rules:

- Do NOT modify UI styling.
- Do NOT change unrelated business logic.
- Keep edits minimal and production-safe.

Validation:

- npm run build
- npm run lint
- npm run type-check

After execution:

1. Show all changed files.
2. Explain each fix.
3. Explain remaining runtime risks.
4. STOP.
