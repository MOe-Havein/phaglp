# Admin Theme Color Customization Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Allow admins to change front-end colors in the admin panel via code-backed theme tokens and a color picker, using TailwindCSS CSS variables.

**Architecture:** Extend existing theme system by persisting color settings through site settings, injecting them as CSS variables in the app shell, and adding a live preview in admin settings.

**Tech Stack:** Next.js 15, React, TailwindCSS, Zod, next-themes/custom theme context, site settings backend.

---

### Task 1: Confirm color token wiring and layout usage

**Objective:** Verify which layout renders `ThemeColorProvider` and how admin applies theme colors.

**Files:**

- Inspect: `src/app/(admin)/layout.tsx`
- Inspect: `src/app/layout-client.tsx`
- Inspect: `src/app/(public)/layout.tsx`

**Verification:** Confirm `ThemeColorProvider` wraps admin routes or shared layout. If missing, note required insertion point for later task.

---

### Task 2: Add admin panel color form section with live preview

**Objective:** Reuse existing color picker and form fields to change front-end colors with immediate preview.

**Files:**

- Modify: `src/components/control/settings-form.tsx` (no code move needed beyond verifying section already exists)

**Verification:** In admin settings page, confirm Theme Customization section renders primary/secondary/background/text color pickers and a live preview block.

---

### Task 3: Persist theme colors in site settings backend

**Objective:** Save admin color choices to site settings and load defaults if missing.

**Files:**

- Inspect/modify: `src/lib/server/site-settings.ts`
- Inspect/modify: relevant server action `src/lib/control-actions.ts`

**Verification:** Save settings JSON containing `primaryColor/secondaryColor/backgroundColor/textColor` and read them back on admin load.

---

### Task 4: Inject saved theme colors as CSS variables in app shell

**Objective:** Apply persisted theme colors globally via CSS variables on the root wrapper.

**Files:**

- Modify: `src/components/ui/theme-color-provider.tsx`
- Modify/admin layout insertion as needed per Task 1

**Verification:** Update colors in admin form/save and see visible color change in admin panel without hardcoded duplicates.

---

### Task 5: Validate inputs and error behavior

**Objective:** Ensure color fields reject invalid values and show form errors.

**Files:**

- Confirm zod regex on color fields in `src/components/control/settings-form.tsx`

**Verification:** Enter invalid hex in admin panel and assert zod validation error message appears.

---

### Task 6: Run existing tests and add one UI theme test

**Objective:** Ensure Tailwind and settings-related changes remain green.

**Files:**

- Create test (if needed): `tests/components/theme-color-provider.test.tsx` or a settings form test
- Run: `pnpm test`

**Verification:** All tests pass; if new test added, it verifies ThemeColorProvider renders children with provided colors.
