# Production Deployment Checklist

Use this checklist to verify that all systems are operational, secure, and ready for production deployment.

## 🛡️ 1. Authentication & Security

- [ ] **Verify `NEXTAUTH_SECRET`:** Ensure a strong, cryptographically secure 32-byte secret is set in the production environment.
  ```bash
  openssl rand -base64 32
  ```
- [ ] **Verify `NEXTAUTH_URL`:** Must be set to the exact public canonical address of your application (e.g., `https://your-domain.com`).
- [ ] **Cookie Hardening:** Confirm that session cookies are configured as `httpOnly`, `secure` (production), and `sameSite: "lax"`.
- [ ] **RBAC Restrictions:** Attempt to bypass controls (e.g. going directly to `/control`) as an unauthenticated or non-admin user; verify they correctly redirect to `/login`.

---

## 🗄️ 2. Database & Prisma

- [ ] **Run Migration baseline:** Staging/Production containers should run `node scripts/migrate.mjs` first to resolve any historical baselines.
- [ ] **Environment Verification:** Check that the application never defaults to a local database (`localhost`) inside a container; all references must use the container service host `postgres`.
- [ ] **Consolidated Singletons:** Verify the build produces no warning statements regarding "Too many Prisma Client instances".

---

## 📦 3. Container Staging Build

To test the Docker environment locally, run the following steps:

1. **Initialize Staging Containers:**
   ```bash
   docker compose -f docker-compose.yml up --build -d
   ```
2. **Inspect Migration Logs:**
   ```bash
   docker compose -f docker-compose.yml logs db-migrate
   ```
   _Verify that the baselines are handled and all pending migrations deploy successfully._
3. **Check Container Statuses & Healthchecks:**
   ```bash
   docker compose -f docker-compose.yml ps
   ```
   _Ensure both the database and main app containers show as `healthy` / `running`._

---

## 🚀 4. CI/CD Registry Pushes

- [ ] **Workflow Lowercasing:** Confirm the GitHub action completes successfully without crashing when pushing tags to `ghcr.io`.
- [ ] **Build Caching:** Check that the cache actions use `type=gha` to expedite subsequent builds.
