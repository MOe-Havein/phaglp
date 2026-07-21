# Vercel CLI Deployment Sequence Plan

> **For Hermes:** Execute only when explicitly asked; this turn is planning only.

**Goal:** Standardize the Vercel CLI workflow for dev, preview, and production deployments in `/root/testa-phaglp2`.

**Architecture:** Use Vercel CLI as the single entrypoint for local development, validated preview deploys, and production releases. Keep local build checks separate (`pnpm run build` / `pnpm run typecheck`), and avoid workarounds that expose secrets.

**Tech Stack:** Vercel CLI 56.4.1, Node 22, `.vercel/token`, `/root/secrets/vercel_api_token`, pnpm 10.6.1

---

### Task 1: Confirm environment variables and auth

**Objective:** Ensure Vercel CLI works without exposing secrets or relying on empty values.

**Files:**
- Inspect: `.env`
- Inspect: `.vercel/token`
- Inspect: `/root/secrets/vercel_api_token`

**Step 1:** Verify `.vercel/token` is present and authenticated.

Run: `vercel whoami`
Expected: returns the linked account/team

**Step 2:** Verify no empty NextAuth vars block dev.

Run: `grep -E '^NEXTAUTH_(SECRET|URL)=' .env || true`
Expected: either no match or only lines with non-empty values

**Step 3:** Commit any env cleanup if needed.

```bash
git add .env .env.bak
git commit -m "fix: ensure vercel dev env is valid"
```

---

### Task 2: Local dev with Vercel CLI

**Objective:** Start local dev server via `vercel dev` and confirm readiness.

**Files:**
- Run project root: `/root/testa-phaglp2`

**Step 1:** Run Vercel dev in foreground with timeout wrapper.

Run: `timeout 15s vercel dev || true`
Expected output includes: `Ready! Available at http://localhost:3000`

**Step 2:** Capture readiness URL.

Verify local URL is `http://localhost:3000` and Next.js compiled successfully.

---

### Task 3: Preview deploy

**Objective:** Create a non-interactive preview deployment.

**Files:**
- Run project root: `/root/testa-phaglp2`

**Step 1:** Run preview deploy.

Run: `vercel > /tmp/vercel-preview.log 2>&1`
Wait for completion.

**Step 2:** Extract preview URL.

Run: `grep -Eo 'https://[^ ]+vercel\.app' /tmp/vercel-preview.log | head -n 1`

**Step 3:** Inspect deployment status.

Run: `vercel inspect <preview-url>`
Expected: Deployment is `Ready`

**Step 4:** Record preview URL for reporting.

---

### Task 4: Production deploy

**Objective:** Promote current preview or re-deploy production via `vercel --prod`.

**Files:**
- Run project root: `/root/testa-phaglp2`

**Step 1:** Run production deploy.

Run: `vercel --prod > /tmp/vercel-prod.log 2>&1`
Wait for completion.

**Step 2:** Extract production URL and aliases.

Run: `grep -Eo 'https://[^ ]+vercel\.app' /tmp/vercel-prod.log | head -n 1`
Also capture alias lines if present.

**Step 3:** Inspect production deployment.

Run: `vercel inspect <production-url>`
Expected: Deployment is `Ready` and aliases include `phaglp.com`, `www.phaglp.com`.

**Step 4:** Report living URLs.

---

## Tests / validation

```bash
pnpm run typecheck
pnpm run build
vercel dev readiness check
vercel inspect preview-url --yes
vercel inspect prod-url --yes
```

## Risks / tradeoffs / open questions

- `npx vercel inspect` may reject some flags depending on CLI version; prefer bare `vercel inspect <url>`.
- Keep tokens in `.vercel/token` or `/root/secrets/vercel_api_token`; do not print them.
- Pre-existing SQLite `SiteSettings.secondaryColor` errors during `next build` are unrelated to Vercel deployment.
