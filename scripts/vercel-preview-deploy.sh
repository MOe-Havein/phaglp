#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="/root/testa-phaglp2"
cd "$PROJECT_DIR"

if ! command -v vercel >/dev/null 2>&1; then
  echo "vercel CLI not found; install with: pnpm add -g vercel" >&2
  exit 1
fi

if [ -z "${VERCEL_API_TOKEN:-}" ] && [ -z "${VERCEL_OIDC_TOKEN:-}" ]; then
  echo "VERCEL_API_TOKEN or VERCEL_OIDC_TOKEN is required in environment" >&2
  exit 1
fi

TOKEN="${VERCEL_API_TOKEN:-${VERCEL_OIDC_TOKEN:-}}"
PREVIEW_URL="$(vercel --yes --token "$TOKEN" -t 2>/dev/null || true)"
if [ -z "$PREVIEW_URL" ]; then
  PREVIEW_URL="$(vercel --yes -t 2>/dev/null || true)"
fi

echo "PREVIEW_URL=$PREVIEW_URL"

if [ -n "${PREVIEW_URL:-}" ]; then
  DEPLOYMENT_URL="$(
    vercel inspect --yes --token "${TOKEN:-}" "$(basename "$PREVIEW_URL")" 2>/dev/null \
      | grep -E 'https://|inspector' | head -n 1 || true
  )"
  echo "DEPLOYMENT_URL=$DEPLOYMENT_URL"
fi

exit 0
