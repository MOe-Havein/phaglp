# Task 5 — DevOps, Docker & CI/CD Pipeline

Execute ONLY this task.

Completed Objectives:

- Configured next.config.mjs for standalone output mode.
- Created a multi-stage production Dockerfile.
- Created docker-compose.yml optimized for Ubuntu 22.
- Added db-migrate runtime migration service.
- Created GitHub Actions workflow for GHCR deployment.

Requirements:

- Ensure production-safe Next.js 15 deployment.
- Ensure Prisma generate executes correctly inside containers.
- Optimize image size and runtime stability.

Rules:

- No frontend redesign.
- No Prisma schema modifications.

Validation:

- docker compose build
- docker compose up
- npm run build

After execution:

1. Show infra-related file changes.
2. Explain deployment workflow.
3. Explain production runtime risks.
4. STOP.
