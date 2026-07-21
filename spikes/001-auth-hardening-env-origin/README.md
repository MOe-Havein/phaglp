# 001: auth-hardening-env-origin

## Spike question

Given the current NextAuth/Credentials setup in `src/auth.config.ts` and `src/auth.ts`, if we replace the fallback `"default-secret"` with fail-closed env validation and reject `trustHost: true` in favor of an explicit allowlist, does the auth flow still work and does host validation actually become stricter?

## Risk

High — auth is a blocking path; a misconfigured secret or origin list can lock out all users.

## Research notes

- `src/auth.config.ts:6` uses `process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || "default-secret"`.
- `src/auth.ts:12` sets `trustHost: true`.
- `src/env.ts` already has a zod schema, but it currently allows both secrets to be missing or too short.
- No refs to `AUTH_TRUSTED_ORIGINS` or similar allowed-origin config were found.

## Approach

Two small Node scripts that simulate the relevant config logic without booting Next.js:

- `baseline.js` reproduces current behavior.
- `hardened.js` reproduces proposed behavior.

Proposed changes:

1. Require one of `NEXTAUTH_SECRET` or `AUTH_SECRET` to be >= 32 chars; throw at import/start if missing.
2. Remove `trustHost: true`.
3. Add optional `NEXT_PUBLIC_APP_ORIGIN` + backend `AUTH_TRUSTED_ORIGINS` used to validate callback-host when needed.

This is a throwaway spike — no edits to source files.

## Files

- `baseline.js`
- `hardened.js`

## Verdict: VALIDATED

### What worked

- The baseline script reproduces the current behavior exactly: `"default-secret"` is accepted silently, and `trustHost: true` is active until auth config is created.
- The hardened script proves the safer alternative holds: missing/weak secret results in `FAIL-CLOSED`, and origin checking can enforce a strict allowlist instead of trusting all hosts.

### What didn't

- This is a throwaway spike only. It does not show hidden breakage in NextAuth itself, but it does confirm the current state is insecure-by-default.

### Surprises

- `src/env.ts` already enforces env parsing at load time, but it does not currently force a 32+ byte auth secret; the spike shows this is the missing enforcement point.
- No existing allowed-origin support was found, so host-validation replacement is a config addition, not a toggle.

### Recommendation for the real build

- Update `src/env.ts` to require either `NEXTAUTH_SECRET` or `AUTH_SECRET` with `z.string().min(32)`.
- Edit `src/auth.config.ts` to derive the secret from validated `env` and throw if absent.
- Edit `src/auth.ts` to remove `trustHost: true` and add origin validation/host config based on `AUTH_TRUSTED_ORIGINS`.
