#!/usr/bin/env bash
set -euo pipefail
if [ -f /root/secrets/vercel_api_token ]; then
  export VERCEL_API_TOKEN="$(cat /root/secrets/vercel_api_token)"
elif [ -z "${VERCEL_OIDC_TOKEN:-}" ]; then
  if [ -z "${VERCEL_API_TOKEN:-}" ]; then
    echo "Provide VERCEL_API_TOKEN via /root/secrets/vercel_api_token, VERCEL_OIDC_TOKEN, or env" >&2
    exit 1
  fi
else
  export VERCEL_API_TOKEN="${VERCEL_OIDC_TOKEN}"
fi
exec "$@"
