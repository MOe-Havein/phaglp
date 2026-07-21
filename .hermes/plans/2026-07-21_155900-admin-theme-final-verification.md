# Admin Theme Customization — Concise Verification Plan

**Goal:** Confirm the independent admin theme mode is complete, persistent, and behaviorally correct.

## Completed

- Prisma schema includes `enableAdminTheme` and `admin*Color` fields.
- Admin settings form persists the toggle and colors.
- Admin layout conditionally applies admin colors via `theme-color-provider`.
- Typecheck, unit tests, and formatter checks are green.

## Verification Checklist

- [ ] `pnpm run typecheck` passes
- [ ] `pnpm run build` succeeds
- [ ] `pnpm run format` succeeds
- [ ] `pnpm run dev` smoke test:
  - `/control/settings` → enable admin theme, set colors, save
  - `/admin` shows applied admin colors
  - `/` keeps public theme unless independent admin apply is intended
- [ ] `git add ... && git commit -m "feat: admin theme customization with public/admin toggle"`
