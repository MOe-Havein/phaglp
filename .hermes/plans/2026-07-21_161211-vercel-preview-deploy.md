# Vercel Preview Deploy Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Add a safe, non-interactive `vercel deploy --preview` workflow to `/root/testa-phaglp2` so preview deploys can be triggered from the shell, script, or Hermes cron without manual browser steps.

**Architecture:** Wrap Vercel CLI preview deployment in a small project-local helper that reads auth from vault-backed env, ensures linked project detection, and returns deploy metadata suitable for Hermes delivery. Prefer Vercel CLI pull + deploy, then REST fallback if needed.

**Tech Stack:** Node 22, pnpm, Vercel CLI, local shell script wrapper.

---

## Context / Assumptions

- Repo is at `/root/testa-phaglp2`.
- `vercel.json` already sets `git.deploymentEnabled.preview: true`.
- `src/actions/vercel.ts` already covers REST metadata retrieval, but does not create preview deployments.
- Secrets follow your no-plaintext rule: `VERCEL_API_TOKEN` and any org/project overrides should come from `/root/secrets/...` or current shell env, never committed.
- `vercel` CLI can be installed with `pnpm add -g vercel` if missing, or `npx vercel`.

---

## Step-by-Step Plan

### Task 1: Verify Vercel CLI availability and project link state

**Objective:** Confirm whether the Vercel CLI is installed and whether this directory is linked to a Vercel project.

**Files:** Read-only checks
- `vercel.json`
- local `.vercel/project.json` if present

**Step 1:** Run from `/root/testa-phaglp2`:
```bash
command -v vercel || echo MISSING
vercel --version
test -f .vercel/project.json && cat .vercel/project.json || echo 'not linked'
```

**Step 2: Verify**
- CLI present.
- If not linked, next task handles link bootstrap without secrets leakage.

---

### Task 2: Preview deploy script stub

**Objective:** Create `scripts/vercel-preview-deploy.sh` that performs a non-interactive preview deploy.

**Files:**
- Create: `scripts/vercel-preview-deploy.sh`

**Step 1: Write failing behavior contract**

Expected invocation:
```bash
bash scripts/vercel-preview-deploy.sh
```

Expected outputs on success:
- prints preview URL
- prints deployment id or inspector URL
- exits `0`

**Step 2: Add minimal script**

```bash
#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="/root/testa-phaglp2"
cd "$PROJECT_DIR"

if ! command -v vercel >/dev/null 2>&1; then
  echo "vercel CLI not found; install with: pnpm add -g vercel" >&2
  exit 1
fi

if [ -z "${VERCEL_API_TOKEN:-}" ]; then
  echo "VERCEL_API_TOKEN is required in environment" >&2
  exit 1
fi

PREVIEW_URL="$(vercel --yes --token "$VERCEL_API_TOKEN" -t 2>/dev/null || true)"
if [ -z "$PREVIEW_URL" ]; then
  PREVIEW_URL="$(vercel --yes -t 2>/dev/null || true)"
fi

echo "PREVIEW_URL=$PREVIEW_URL"

DEPLOYMENT_URL="$(vercel inspect --yes --token "${VERCEL_API_TOKEN:-}" $(basename "$PREVIEW_URL") 2>/dev/null | grep -E 'https://|inspector' | head -n 1 || true)"
echo "DEPLOYMENT_URL=$DEPLOYMENT_URL"
exit 0
```

**Step 3: Make executable**
```bash
chmod +x scripts/vercel-preview-deploy.sh
```

---

### Task 3: Robust deploy via Vercel REST API fallback

**Objective:** If CLI link/auth fails, create a server-action style deploy path using existing `src/actions/vercel.ts` plus a small REST endpoint that triggers preview deploy metadata retrieval after CLI deploy.

**Files:**
- Modify: `src/actions/vercel.ts`
- Create: `src/app/api/vercel/preview-deploy/route.ts`

**Step 1: Add REST create-deployment helper in `src/actions/vercel.ts`**

```ts
export interface CreatePreviewDeploymentInput {
  projectId?: string;
  name?: string;
  gitSource?: {
    repo?: string;
    ref?: string;
    sha?: string;
    org?: string;
  };
}

export interface CreatePreviewDeploymentResult {
  id: string;
  url: string;
  inspectorUrl: string;
  target: "preview";
  readyState: string;
}

export async function createVercelPreviewDeployment(
  input: CreatePreviewDeploymentInput = {},
): Promise<CreatePreviewDeploymentResult | null> {
  try {
    const body: Record<string, any> = {
      name: input.name,
      target: "preview",
      gitSource: input.gitSource
        ? {
            type: "github",
            repo: input.gitSource.repo,
            ref: input.gitSource.ref,
            sha: input.gitSource.sha,
            org: input.gitSource.org,
          }
        : undefined,
    };

    const data = await vercelFetch<CreatePreviewDeploymentResult>(
      "v13/deployments",
      {
        method: "POST",
        body: JSON.stringify(body),
      },
    );

    return data ?? null;
  } catch (error: any) {
    logger.error("Failed to create Vercel preview deployment", error);
    return null;
  }
}
```

**Step 2: Create `src/app/api/vercel/preview-deploy/route.ts`**

```ts
import { NextResponse } from "next/server";
import { createVercelPreviewDeployment } from "@/actions/vercel";

export async function POST() {
  if (!process.env.VERCEL_API_TOKEN) {
    return NextResponse.json({ success: false, error: "missing VERCEL_API_TOKEN" }, { status: 500 });
  }

  const result = await createVercelPreviewDeployment({});
  if (!result) {
    return NextResponse.json({ success: false, error: "vercel_deploy_failed" }, { status: 502 });
  }

  return NextResponse.json({ success: true, deployment: result });
}
```

**Step 3: Validate typing**
Run:
```bash
pnpm typecheck
```

---

### Task 4: Add plaintext-safe secret wiring

**Objective:** Ensure `VERCEL_API_TOKEN` never comes from committed env.

**Files:**
- Check for or create: `.envrc`, `.env.local`, and docs reference in README/docs
- Optionally create: `scripts/load-secrets.sh`

**Step 1: Add `scripts/load-secrets.sh`**

```bash
#!/usr/bin/env bash
set -euo pipefail
if [ -f /root/secrets/vercel_api_token ]; then
  export VERCEL_API_TOKEN="$(cat /root/secrets/vercel_api_token)"
elif [ -z "${VERCEL_API_TOKEN:-}" ]; then
  echo "Provide VERCEL_API_TOKEN via /root/secrets/vercel_api_token or env" >&2
  exit 1
fi
exec "$@"
```

**Step 2: Wire preview script to use loader when supported**

Update `scripts/vercel-preview-deploy.sh` top:

```bash
if [ -f /root/secrets/vercel_api_token ]; then
  export VERCEL_API_TOKEN="$(cat /root/secrets/vercel_api_token)"
fi
```

**Step 3: Verify no committed `.env.local` contains token**
```bash
grep -R "VERCEL_API_TOKEN" /root/testa-phaglp2 2>/dev/null | grep -v node_modules | grep -v '.git/' || true
```

Expected: no matches outside secret paths.

---

### Task 5: Preview deploy via Hermes cron wiring

**Objective:** Provide a ready-to-use cron job config snapshot this project can consume for automated preview deploys.

**Files:**
- Create: `.hermes/plans/vercel-preview-cron-setup.md`
- Optionally: add repo-local `docs/vercel-preview.md`

**Step 1: Add `docs/vercel-preview.md`**

```md
# Vercel Preview Deploy

Prefer local CLI deploy:

```bash
bash scripts/vercel-preview-deploy.sh
```

Hermes cron example command:

```bash
cd /root/testa-phaglp2 && bash scripts/load-secrets.sh bash scripts/vercel-preview-deploy.sh
```

Expected output contains `PREVIEW_URL=...`.
```

**Step 2: Verify docs render and paths are correct**

```bash
ls -la docs/vercel-preview.md scripts/vercel-preview-deploy.sh scripts/load-secrets.sh
```

Expected: all files exist and executable bits are set.

---

## Tests / Validation

- `pnpm typecheck` passes after Task 3.
- Run preview script from repo root; expect either URL output or a clear auth/link failure message, not a silent crash.
- API route must return 500 on missing token and 502 if Vercel POST fails; no token exposure in responses/logs.
- Ensure no `VERCEL_API_TOKEN` appears in committed files.

## Files Likely to Change

- `scripts/vercel-preview-deploy.sh`
- `scripts/load-secrets.sh`
- `src/actions/vercel.ts`
- `src/app/api/vercel/preview-deploy/route.ts`
- `docs/vercel-preview.md`

## Risks, Tradeoffs, and Open Questions

- If the repo is not linked to Vercel, CLI preview deploy may require `vercel link` once with browser auth; for fully non-interactive environments, prefer REST API path with explicit `projectId`.
- REST `v13/deployments` behavior varies by account/project source settings; if it fails, fallback to `vercel create` then `vercel promote` or inspect metadata via existing REST functions.
- Preview deploy artifacts differ when source is push-trigger previews vs manual CLI deploy; if you need PR-linked previews, implement this through GitHub integration instead.
