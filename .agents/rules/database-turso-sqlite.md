---
trigger: always_on
---

---
name: database-turso-sqlite
description: High-efficiency rules for Next.js database layer with dual-mode Turso (libsql) and local SQLite fallback
activation: always_on
---

# Turso & SQLite Core Directive
Optimize all database schemas, components, and server logic exclusively for a hybrid Turso (`libsql`) and local SQLite framework. Completely ban multi-row connection pools, serverless proxy extensions (e.g., Prisma Accelerate), and incompatible SQL dialects.

## Workspace Core Architecture
- **Schema Alignment**: Force `provider = "sqlite"` explicitly in `prisma/schema.prisma`.
- **Hybrid Driver Instantiation (`src/lib/db/prisma.ts`)**:
  - *Remote Mode (Turso)*: If `DATABASE_URL` starts with `libsql://`, `http://`, or `https://`, dynamically wrap initialization with the `PrismaLibSql` driver adapter using your `TURSO_AUTH_TOKEN`.
  - *Local Mode (SQLite)*: If `DATABASE_URL` matches local paths (e.g., `file:./dev.db`), bypass adapter loops and spin up direct native file connections.
- **Migration Protocol**: Enforce `pnpm prisma db push` for structural workspace schema synchronization to support Turso’s distributed edge state safely. Avoid `prisma migrate dev` (unsupported by libsql adapter runtimes).

## Data Fetching & Mutations
- **Isolate Environment Access**: Execute query structures strictly inside async Server Components and Server Actions. Completely ban database hooks inside Client Components.
- **Atomic Operations**: Wrap multi-table modifications inside `prisma.$transaction()` code arrays to maintain database consistency and eliminate file-system locking on local `.db` files.
- **Relations Optimization**: SQLite does not auto-generate indexing arrays for foreign relations. You must explicitly attach `@index` annotations to all relation foreign keys inside `schema.prisma` to prevent linear table scans.

## Performance Restraints & Token Efficiency
- **Flash Micro-Diff Output Only**: Respond strictly using minimal Git-style micro-diff blocks showing only lines changing. Omit conversational summaries, greetings, or post-generation explanations.
- **Caching Layouts**: Maximize Next.js `cache()`, `unstable_cache`, and `revalidateTag` mechanics instead of third-party network proxies to minimize token usage and save API credits.
