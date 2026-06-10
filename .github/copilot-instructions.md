# PHAGLP Copilot Agent Instructions

## Repository Overview

**PHAGLP** (Philosophical Academy for Geniuses Life Planning) is a modern full-stack platform for philosophical education, scientific research, and intentional life planning. The application provides course management, lectures, certifications, and AI integration capabilities through a role-based admin dashboard and public-facing user portal.

- **Type:** Next.js 15 full-stack web application
- **Repository Size:** ~13 MB
- **Primary Language:** TypeScript (100% strict type coverage)
- **Framework & Stack:** Next.js 15 (App Router), React, Prisma ORM, PostgreSQL/SQLite, TailwindCSS, NextAuth.js v5

## Development Environment Setup

### Prerequisites

- **Node.js:** v18+ (current: v22)
- **Package Manager:** pnpm (required—not npm or yarn)
- **Database:** PostgreSQL (production) or SQLite (local development)
- **Runtime:** Node.js ES2022+ compatible environment

### Installation & Setup

1. **Install dependencies** (always required first):
   ```bash
   pnpm install
   ```
   This command processes the workspace and installs all packages including optional builds for Prisma, sharp, and esbuild.

2. **Configure environment variables:**
   - Copy template: `cp .env.example .env.local` (or reference `ENV_VARS.md` for production config)
   - **Essential variables:**
     - `DATABASE_URL`: PostgreSQL connection string (e.g., `postgresql://user:pass@localhost:5432/phaglp`)
     - `NEXTAUTH_SECRET`: 32-byte cryptographically secure string (`openssl rand -base64 32`)
     - `NEXTAUTH_URL`: Canonical app address (default: `http://localhost:3000`)
     - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`: Cloudinary uploads integration

3. **Initialize database:**
   ```bash
   pnpm prisma db push
   pnpm prisma db seed
   ```
   Always run in this exact order. Database migrations and seeding are prerequisite to running the development server.

### Development Workflow

- **Start dev server:**
  ```bash
  pnpm dev
  ```
  Starts on `http://localhost:3000`. Server must be running for Playwright tests.

- **Build for production:**
  ```bash
  pnpm build
  ```
  Outputs standalone bundle to `.next/standalone`. Performs full TypeScript, ESLint, and Prisma validation.

- **Type check only:**
  ```bash
  pnpm type-check
  ```
  Verifies TypeScript strict mode without building.

- **Lint code:**
  ```bash
  pnpm lint
  ```
  Runs ESLint on src directory (TypeScript strict mode enabled).

- **Format code:**
  ```bash
  pnpm format
  ```
  Applies Prettier formatting to all source files.

### Testing

- **Playwright E2E tests:**
  ```bash
  pnpm exec playwright test
  ```
  - Tests run against `http://localhost:3000` (dev server must be running)
  - Test files are in `tests/` directory
  - Config: `playwright.config.ts`
  - Retries: 0 locally, 2 in CI
  - Creates HTML report after completion

## Project Architecture & Layout

### Directory Structure

```
src/
├── app/                  # Next.js App Router (all routes)
│   ├── (admin)/         # Admin-only routes (role-gated)
│   ├── (public)/        # Public-facing pages
│   ├── api/             # API endpoints (route handlers)
│   └── layout.tsx       # Root layout with providers
├── components/          # Reusable React components
│   ├── admin/          # Admin dashboard components
│   ├── ui/             # Shadcn/radix UI primitives
│   ├── cards/          # Domain-specific card components
│   └── home/           # Home page sections
├── lib/                 # Shared utilities
│   ├── server/         # Server actions & utilities
│   ├── shared/         # Client/server shared logic
│   └── actions/        # Next.js Server Actions
├── types/              # TypeScript type definitions
├── validations/        # Zod validation schemas
└── hooks/              # Custom React hooks
```

### Key Configuration Files

- `next.config.mjs`: Next.js configuration (ESLint ignore during builds, Prisma bundle optimization, image remotes)
- `tsconfig.json`: Strict TypeScript (no `any`, no unused variables, exact optional properties)
- `tailwind.config.ts`: TailwindCSS theme configuration
- `prisma/schema.prisma`: Database schema (SQLite connection by default)
- `playwright.config.ts`: E2E test configuration

### Workspace & Monorepo

- **Workspace:** pnpm workspace with allowlisted build-required packages (Prisma, esbuild, sharp, better-sqlite3)
- **MCP Servers:** `mcp-prisma-server/` and `mcp-vercel/` are local packages for tool integration

## Code Patterns & Standards

### TypeScript & Type Safety

- **Strict mode enforced:** All files must pass strict TypeScript compilation
- **No `any` type:** Always use explicit types or generics
- **Server vs. Client:** Mark client components with `"use client"`, keep components server-first
- **Type exports:** Define and export types in `src/types/` with clear naming

### Validation & Zod

- **All inputs validated:** Use Zod schemas for API request bodies and Server Actions
- **Schema location:** `src/validations/` directory with clear naming (e.g., `course.ts`, `user.ts`)
- **Server Actions:** All mutations wrapped in Zod `.parse()` or `.safeparse()`

### Database & Prisma

- **IDs:** Use `cuid()` for primary keys (not UUIDs)
- **Migrations:** Always run `pnpm prisma db push` after schema changes
- **N+1 Prevention:** Use Prisma `include` blocks to prefetch relations—don't call separately
- **Transactions:** Wrap multi-step mutations in `prisma.$transaction()`
- **Indexes:** Add `@@index()` for frequently queried foreign keys

### Components & UI

- **Server Components by default:** Only use `"use client"` when state/interactivity required
- **Shadcn/Radix UI:** Use existing primitives in `src/components/ui/`
- **Accessibility:** Always include `aria-*` attributes, labels for form inputs, fallback descriptions for dialogs

### API Routes & Route Handlers

- **Path:** `src/app/api/[route]/route.ts`
- **Keep thin:** Business logic → Server Actions or `src/lib/server/`
- **Auth:** Middleware-level RBAC + handler-level role checks (defense in depth)
- **Error handling:** Return structured JSON errors with status codes

### Authentication (NextAuth.js v5)

- **Sessions:** JWT with httpOnly cookies
- **Secrets:** Must use `NEXTAUTH_SECRET` env variable
- **Middleware:** Role-based access control in `middleware.ts`
- **Passwords:** Always hash with bcryptjs before storing (never plaintext)

## Build & CI/CD Considerations

### Build Output

- **Mode:** `output: "standalone"` in `next.config.mjs`
- **Bundle optimization:** Prisma, esbuild, sharp flagged as serverExternalPackages
- **Size:** Compiled standalone is production-ready (Docker deployment)
- **Cache:** `.next/cache` folder used for SWC compilation speedup

### Common Build Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| `Could not find a declaration file for module 'X'` | Missing @types | Add @types/X or ensure TS paths configured |
| `Database error on build` | DATABASE_URL not set | Provide dummy PostgreSQL URL for build-time compilation |
| `Prisma client not found` | Missing `pnpm prisma generate` | Run `pnpm install` again to regenerate client |
| `ESLint errors ignored during build` | `ignoreDuringBuilds: true` | These won't fail CI (type-check runs first) |
| `Port 3000 already in use` | Dev server running | Kill existing process or use `PORT=3001 pnpm dev` |

### Environment & Deployment

- **Production:** Use Vercel or Docker. See `Dockerfile` for containerization.
- **Database:** Neon PostgreSQL recommended for managed hosting
- **Secrets:** Store `NEXTAUTH_SECRET`, `CLOUDINARY_URL` in host environment variables
- **Upstash Redis:** Optional caching layer (graceful fallback if unavailable)

## Important Constraints & Patterns

### Forbidden & Protected Files

Do **not** modify these files without explicit user request:
- `middleware.ts`: Auth middleware and role guards
- `next.config.mjs`: Build configuration
- `prisma/schema.prisma`: Database schema (coordinate with migrations)
- `.env`, `.env.local`: Local secrets (not in repo)
- `pnpm-lock.yaml`: Dependency lock file (auto-generated)

### When Creating New Features

1. **Create feature folder:** `src/features/{feature-name}/` with components, actions, hooks, validations subdirectories
2. **Add validation schema:** `src/validations/{feature-name}.ts` with Zod schemas
3. **Use Server Actions:** Put mutations in `src/lib/server/actions/` or feature actions directory
4. **Add types:** `src/types/{feature-name}.ts` for exported interfaces
5. **Write tests:** Add Playwright tests in `tests/` before marking complete

### Documentation References

- `README.md`: High-level project overview
- `ENV_VARS.md`: Environment variable reference (required & optional)
- `docs/` directory: Architecture docs, context files, and design guidelines
- `.github/workflows/`: CI/CD pipeline definitions (reference for build order)

## Key Dependencies & Versions

- Next.js 15 (App Router)
- React 19+
- TypeScript 5+
- Prisma 6+
- Zod 3.23+
- TailwindCSS 3.4+
- NextAuth.js 5+
- Playwright 1.40+ (testing)
- pnpm 8+ (workspace manager)

---

**Last Updated:** June 2026 | **Agent Version Compatibility:** Compatible with all agent versions using strict TypeScript mode and Zod validation.
