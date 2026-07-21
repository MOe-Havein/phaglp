# Admin Theme Customization — Concise Remaining Plan

**Goal:** Wire public pages to admin-configurable theme colors without changing page component classes.

## Current State
- `src/app/(public)/layout.tsx` fetches `siteConfig` but does not inject CSS vars.
- `src/app/(public)/page.tsx` uses `bg-tartorange`, `text-perfectsky`, `bg-frost`, `bg-tinfoil`.
- `src/app/(public)/loading.tsx` uses `bg-background`, `bg-muted/30`.
- `tailwind.config.ts` already maps several tokens to CSS vars for `background/foreground/primary/secondary`, but `frost`, `tinfoil`, `perfectsky`, and `tartorange` are still hard-coded hex.
- Admin settings form already persists `primaryColor`, `secondaryColor`, `backgroundColor`, `textColor`, and admin theme overrides.
- `prisma/schema.prisma` already includes current theme fields; full expanded schema is out of scope for this concise plan.

## Proposed Approach
Keep Tailwind class names unchanged. Inject a server `ThemeInjector` in the public layout that writes CSS custom properties from `getSiteSettings()`. Map the custom color tokens to those vars. Complement with a small admin theme page using existing server actions.

## Step-by-Step Plan
1. Create `src/components/theme/ThemeInjector.tsx`
   - Server component that renders `<style id="theme-vars">` with `:root` vars from settings.
2. Update `src/app/(public)/layout.tsx`
   - Import and render `<ThemeInjector settings={siteConfig} />` above `<Navbar>`.
3. Update `tailwind.config.ts`
   - Change `frost`, `perfectsky`, `tartorange`, `tinfoil` to use CSS vars with sensible fallbacks.
4. Minimal admin theme route
   - Create `src/app/(admin)/settings/theme/page.tsx` for theme controls, reusing existing settings form UI and server action.
5. Verification
   - `pnpm run typecheck`, `npx vitest run`, local smoke test in `vercel dev`, screenshot or curl public homepage to confirm CSS vars are present.

## Files Likely To Change
- `src/components/theme/ThemeInjector.tsx`
- `src/app/(public)/layout.tsx`
- `tailwind.config.ts`
- `src/app/(admin)/settings/theme/page.tsx`
- `src/app/(admin)/settings/theme/actions.ts`

## Risks / Open Questions
- `page.tsx` uses `prisma.siteSettings.findFirst()` directly in `generateMetadata()`. Decide whether to keep this fallback versus routing metadata through `getSiteSettings()` consistently.
- Dark-mode behavior for new tokens should be reviewed after CSS var injection.
- Production DB sync: confirm SQLite `SiteSettings` has `secondaryColor` and admin theme columns before deploy.

---

## Appendix B — Vercel CLI Workflow
Use the Vercel CLI for local dev, validated preview deploys, and production releases.

- Local dev: `vercel dev`
  - Confirm the project is linked and the local server comes up.
  - If env validation fails, inspect `.env` and `.env.local`; fix missing required values without permanently mutating remote state.
- Preview deploy: `vercel`
  - Build the project’s output and queue a preview deployment.
  - Capture the preview URL and inspect the deployment status.
- Production deploy: `vercel --prod`
  - Promote a production deployment and capture production aliases/URLs.
- Verification after deploy:
  - Inspect preview and production deployment metadata.
  - Check that the deployment is Ready and aliases/published URLs are as expected.

## Appendix A — Attached Reference Plan
The attached `nextjs15_admin_theme_customization_plan.html` was preserved for consultation, not executed from here. It includes:
- file scan findings for `src/app/(public)/layout.tsx`, `page.tsx`, and `loading.tsx`
- architecture flow for admin save → Prisma → cache invalidation → CSS var injection
- expanded 16-field `SiteSettings` theme block
- file tree and phases 1 to 5
- server action pseudocode and preview strategy
Use this appendix as reference material while implementing the concise plan above.
