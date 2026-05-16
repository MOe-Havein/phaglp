# Task 1: Database Layer Stabilization & Runtime Fixes

Execute ONLY this task.

Actions:

- Remove the neon-serverless WebSocket adapter and ws dependencies to eliminate ErrorEvent serialization crashes.
- Consolidate the Prisma client into a singleton-safe initialization in src/lib/prisma.ts.
- Implement safeDbQuery and serializePrisma utilities to wrap every database call in a try/catch block.
- Normalize Prisma output:
  - Convert Dates to ISO strings
  - Prevent ErrorEvent leakage
  - Prevent AggregateError serialization

Rules:

- Do NOT modify UI styling
- Do NOT change unrelated business logic
- Keep changes minimal and production-safe

Validation:

- Next.js 15 compatible
- RSC serialization safe
- No websocket runtime usage
- No ErrorEvent leaks

After execution:

1. Show changed files
2. Explain changes
3. Explain remaining risks
4. STOP
