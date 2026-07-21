# Optional Independent Admin Theme Mode Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Allow admins to optionally configure a separate admin-only color scheme, independent from the public site theme.

**Architecture:** Extend the existing theme system by adding an optional admin theme config stored in site settings, applied via a second `ThemeColorProvider` wrapper in the admin layout, while preserving the current single-global-theme behavior when admin theme is unset.

**Tech Stack:** Next.js 15, React, TailwindCSS CSS variables, existing `ThemeColorProvider`, Prisma-backed `SiteSettings`.

---

### Task 1: Add admin theme fields to Prisma schema and regenerate client

**Objective:** Add nullable admin theme color fields to `SiteSettings` and regenerate Prisma client.

**Files:**

- Modify: `prisma/schema.prisma`
  - Add: `adminPrimaryColor String?`
  - Add: `adminSecondaryColor String?`
  - Add: `adminBackgroundColor String?`
  - Add: `adminTextColor String?`
- Run: `npx prisma generate`
- Test: verify generated client includes new fields on `SiteSettings`

**Commands:**

```bash
cd /root/testa-phaglp2
npx prisma generate
```

**Verification:** `rg "adminPrimaryColor" node_modules/.prisma/client/index.d.ts` returns matches.

---

### Task 2: Update TypeScript types for admin theme colors

**Objective:** Add optional admin theme fields to `SiteSettings` TypeScript interface.

**Files:**

- Modify: `src/lib/shared/types.ts`
  - Add to `SiteSettings`:
    - `adminPrimaryColor?: string | null`
    - `adminSecondaryColor?: string | null`
    - `adminBackgroundColor?: string | null`
    - `adminTextColor?: string | null`

**Verification:** `npx tsc --noEmit` passes.

---

### Task 3: Update site settings server layer to load admin theme colors

**Objective:** Read new admin theme fields from Prisma in `getSiteSettings()`.

**Files:**

- Modify: `src/lib/server/site-settings.ts`
  - Add mappings for `adminPrimaryColor`, `adminSecondaryColor`, `adminBackgroundColor`, `adminTextColor` in the returned object, with safe fallbacks to `null`.

**Verification:** `npx tsc --noEmit` passes.

---

### Task 4: Update admin settings form with admin theme fields

**Objective:** Add color picker fields in admin settings for the optional admin theme, with a toggle to enable/disable admin theme override.

**Files:**

- Modify: `src/components/control/settings-form.tsx`
  - Add to `formSchema`:
    - `adminPrimaryColor`, `adminSecondaryColor`, `adminBackgroundColor`, `adminTextColor` with same zod hex regex
    - `enableAdminTheme: z.boolean()`
  - Add to `defaultValues` with fallbacks to existing primary/secondary/background/text colors when toggle is on
  - Add conditional "Admin Theme" section under "Theme Customization" using `form.watch("enableAdminTheme")`

**Verification:** Load `/control/settings` in browser and confirm new Admin Theme section appears, color pickers work, and toggle shows/hides section.

---

### Task 5: Update site settings server action to persist admin theme fields

**Objective:** Save admin theme fields when `updateSiteSettings` is called.

**Files:**

- Modify: `src/lib/control-actions.ts`
  - In `updateSiteSettings` upsert, add `adminPrimaryColor`, `adminSecondaryColor`, `adminBackgroundColor`, `adminTextColor`, and `enableAdminTheme`
  - Ensure `create` and `update` branches both include new fields

**Verification:** Submit admin settings form and inspect DB/query response to confirm admin theme fields persist.

---

### Task 6: Apply admin theme in admin layout when enabled

**Objective:** Wrap admin layout subtree with a second `ThemeColorProvider` using admin theme values when `enableAdminTheme` is true; otherwise inherit global root provider.

**Files:**

- Modify: `src/app/(admin)/layout.tsx`
  - Fetch `siteConfig = await getSiteSettings()`
  - If `siteConfig.enableAdminTheme`, wrap children with `<ThemeColorProvider initial={normalizeAdminThemeColors(siteConfig)}>` before the existing sidebar/main structure
  - Otherwise, keep current single-provider inheritance from root

**New helper (or extend existing):**

- Modify: `src/lib/get-theme-colors.ts`
  - Add `normalizeAdminThemeColors(siteConfig)` helper that maps admin color fields through `DEFAULTS` fallback

**Verification:** Toggle admin theme in settings and confirm admin panel colors change independently from public site colors.

---

### Task 7: Add tests for admin theme mode

**Objective:** Verify admin theme colors are normalized correctly and fallback behavior is safe.

**Files:**

- Modify: `tests/lib/theme-colors.test.ts`
  - Add tests for new admin theme normalization helper if extracted
  - Add tests verifying fallback behavior when admin theme fields are empty

**Commands:**

```bash
cd /root/testa-phaglp2
CLOUDINARY_URL=cloudinary://177836185349364:kGyFPY5oQaHDtmBs8Jw0N9rzsKU@phaglp NEXTAUTH_SECRET='0123456789abcdef0123456789abcdef' npx vitest run tests/lib/theme-colors.test.ts
```

**Verification:** All new tests pass.

---

### Task 8: Final validation and cleanup

**Objective:** Ensure all changes are integrated, formatted, and tested.

**Steps:**

1. Run `npx tsc --noEmit` with `CLOUDINARY_URL` and `NEXTAUTH_SECRET`
2. Run `npx prettier --check` on changed files, write if needed
3. Run `npx vitest run tests/lib/theme-colors.test.ts tests/lib/chatbot.test.ts tests/providers/hermes.test.ts`
4. Run `cd /root/testa-phaglp2 && next build` if available
5. Review changes with `git diff --stat`

**Verification:** Typecheck, format, tests, and build all pass.

---

## Risks and Tradeoffs

- **Risk:** Two `ThemeColorProvider` instances can cause CSS variable scoping confusion if not structured carefully.
  - **Mitigation:** Keep root provider as the public theme default; only add admin wrapper in admin layout when explicitly enabled.
- **Risk:** Increased form complexity with 4 extra fields + toggle.
  - **Mitigation:** Use collapsible conditional section so it stays out of the way for users who don't need it.
- **Risk:** DB migration needed for new nullable fields.
  - **Mitigation:** All new fields are nullable with safe TypeScript defaults, so existing `global` row continues to work without immediate migration.

## Open Questions

1. Should `enableAdminTheme` default to `true` or `false` on fresh installs?
   - **Recommendation:** Default to `false` to preserve existing behavior unless admin explicitly opts in.
2. Should admin theme apply to login/error pages, or only the admin dashboard?
   - **Recommendation:** Start with admin layout only (`src/app/(admin)/*`) to minimize scope.
