# Task 5: DevOps, Docker & CI/CD Pipeline

Execute ONLY this task.

Actions:

- Configure next.config.mjs for output: 'standalone'
- Create optimized multi-stage Dockerfile
- Create docker-compose.yml for Ubuntu 22
- Add db-migrate service for Prisma migrations
- Create .github/workflows/build-push.yml

Requirements:

- GitHub Actions compatible
- GHCR compatible
- Production-safe Next.js 15 deployment
- Slim optimized images

Rules:

- No frontend redesign
- No Prisma schema changes

Validation:

- docker build works
- docker compose works
- standalone output verified
- NODE_ENV=production verified

After execution:

1. Show infra files changed
2. Explain deployment flow
3. Explain runtime risks
4. STOP
