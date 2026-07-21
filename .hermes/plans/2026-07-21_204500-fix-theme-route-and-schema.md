# Fix Theme Route + Prisma/SQLite Schema Sync

**Goal:** Fix the admin theme route path and sync the Prisma schema with the actual database so build-time `SiteSettings.secondaryColor` errors stop appearing.

## Files to change
- Move/align route: `src/app/(admin)/settings/theme/page.tsx` → `src/app/(admin)/control/settings/theme/page.tsx`
- Update references if any
- Apply Prisma schema migration to the actual database

## Steps
1. Move the theme page into the control settings folder.
2. Verify internal links/imports still resolve.
3. Apply Prisma schema changes to the live database via migration/deploy.
4. Run typecheck or equivalent build verification.

## Validation
- `pnpm run typecheck` or `npx tsc --noEmit`
- Confirm no `secondaryColor` build-time DB errors during `pnpm run build`

## Commit
```bash
git add src/app/(admin)/control/settings/theme/page.tsx src/app/(admin)/settings/theme/page.tsx
git commit -m "fix: align admin theme route with control settings and sync schema"
```
