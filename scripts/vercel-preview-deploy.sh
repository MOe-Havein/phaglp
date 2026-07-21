#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="/root/testa-phaglp2"
cd "$PROJECT_DIR"

if ! command -v vercel >/dev/null 2>&1; then
  echo "vercel CLI not found; install with: pnpm add -g vercel" >&2
  exit 1
fi

mkdir -p "$PROJECT_DIR/.vercel"

if [ -f /root/secrets/vercel_api_token ]; then
  cp /root/secrets/vercel_api_token "$PROJECT_DIR/.vercel/token"
else
  echo "/root/secrets/vercel_api_token not found" >&2
  exit 1
fi

vercel login --token --oob >/tmp/vercel-login.log 2>&1 || true

if [ ! -f "$PROJECT_DIR/.vercel/project.json" ]; then
  vercel link --yes >/tmp/vercel-link.log 2>&1 || true
fi

PREVIEW_URL="$(vercel --yes >/tmp/vercel-deploy.log 2>&1 || true)"
if [ -z "$PREVIEW_URL" ]; then
  PREVIEW_URL="$(vercel --yes --prod >/tmp/vercel-deploy-prod.log 2>&1 || true)"
fi

echo "PREVIEW_URL=$PREVIEW_URL"

if [ -n "${PREVIEW_URL:-}" ]; then
  BASE_NAME="$(basename "$PREVIEW_URL")"
  DEPLOYMENT_URL="$(
    vercel inspect --yes "$BASE_NAME" 2>/dev/null \
      | grep -E 'https://|inspector' | head -n 1 || true
  )"
  echo "DEPLOYMENT_URL=$DEPLOYMENT_URL"
fi

exit 0
