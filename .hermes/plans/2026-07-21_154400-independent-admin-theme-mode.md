# Independent Admin Theme Mode Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Allow the admin panel to use an independent color scheme when `enableAdminTheme` is turned on, while keeping the public site on the global theme.

**Architecture:** Extend existing theme system with an optional admin-specific theme branch driven by a persisted boolean toggle. When disabled, admin inherits the global `ThemeColorProvider` CSS variables; when enabled, admin subtree uses `admin*Color` values.

**Tech Stack:** Next.js 15, React, TailwindCSS, Prisma, Zod, existing `ThemeColorProvider`.

---

### Task 1: Add `enableAdminTheme` to Prisma schema and regenerate client

**Objective:** Persist the admin-theme toggle in `SiteSettings`.

**Files:**

- Modify: `prisma/schema.prisma`

**Step 1: Add field**

```prisma
model SiteSettings {
  id                    String  @id @default("global")
  siteName              String
  siteUrl               String
  metaTitle             String
  metaDescription       String
  description           String?
  primaryColor          String
  secondaryColor        String?
  backgroundColor       String?
  textColor             String?
  adminPrimaryColor     String?
  adminSecondaryColor   String?
  adminBackgroundColor  String?
  adminTextColor        String?
  enableAdminTheme      Boolean @default(false)
  ogImage               String?
  logoUrl               String?
  faviconUrl            String?
  googleAnalyticsId     String?
  enableGoogleAnalytics Boolean @default(false)
  maintenanceMode       Boolean @default(false)
  fullAddress           String?
  allowRegistration     Boolean @default(true)
}
```

**Step 2: Regenerate client**

Run: `npx prisma generate`
Expected: Prisma Client generated with `enableAdminTheme` exposed in `SiteSettingsCreateInput` / `SiteSettingsUpdateInput`.

**Step 3: Commit**

```bash
git add prisma/schema.prisma
git commit -m "feat: add enableAdminTheme toggle to SiteSettings"
```

---

### Task 2: Persist toggle through server action and form

**Objective:** Include `enableAdminTheme` in the admin settings save flow.

**Files:**

- Modify: `src/lib/control-actions.ts`
- Modify: `src/components/control/settings-form.tsx`

**Step 1: Update `updateSiteSettings`**

Add `enableAdminTheme: data.enableAdminTheme` to both `update` and `create` branches in `prisma.siteSettings.upsert`.

**Step 2: Add form field**

Add a `Switch` field bound to `enableAdminTheme` in `SettingsForm`, with description: "Use independent colors for the admin panel."

**Step 3: Verify**

```bash
cd /root/testa-phaglp2 && CLOUDINARY_URL=cloudinary://177836185349364:kGyFPY5oQaHDtmBs8Jw0N9rzsKU@phaglp NEXTAUTH_SECRET='0123456789abcdef0123456789abcdef' npx tsc --noEmit
```

Expected: No type errors.

**Step 4: Commit**

```bash
git add src/lib/control-actions.ts src/components/control/settings-form.tsx
git commit -m "feat: persist enableAdminTheme toggle"
```

---

### Task 3: Conditionally wrap admin layout with admin theme colors

**Objective:** When `enableAdminTheme` is true, apply admin-specific CSS variables inside the admin layout.

**Files:**

- Modify: `src/app/(admin)/layout.tsx`

**Step 1: Fetch site settings**

```tsx
const siteConfig = await getSiteSettings();
const colors = siteConfig.enableAdminTheme
  ? normalizeThemeColors({
      primaryColor: siteConfig.adminPrimaryColor ?? siteConfig.primaryColor,
      secondaryColor:
        siteConfig.adminSecondaryColor ?? siteConfig.secondaryColor,
      backgroundColor:
        siteConfig.adminBackgroundColor ?? siteConfig.backgroundColor,
      textColor: siteConfig.adminTextColor ?? siteConfig.textColor,
    })
  : normalizeThemeColors({
      primaryColor: siteConfig.primaryColor,
      secondaryColor: siteConfig.secondaryColor,
      backgroundColor: siteConfig.backgroundColor,
      textColor: siteConfig.textColor,
    });
```

**Step 2: Wrap admin content**

```tsx
return (
  <ThemeColorProvider initial={colors}>
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-background text-text">
      ...
    </div>
  </ThemeColorProvider>
);
```

**Step 3: Verify**

Start dev server, toggle switch in `/control/settings`, and confirm admin panel colors change independently from public page.

**Step 4: Commit**

```bash
git add src/app/(admin)/layout.tsx
git commit -m "feat: apply independent admin theme when toggled"
```

---

### Task 4: Add tests for admin theme toggle behavior

**Objective:** Lock in fallback and override behavior.

**Files:**

- Create/modify: `tests/lib/theme-colors.test.ts`

**Step 1: Add tests**

- When `enableAdminTheme` is false, admin layout color selection uses public colors.
- When `enableAdminTheme` is true and admin colors are set, admin uses admin colors.
- When admin color is missing, fallback to public color.

**Step 2: Run tests**

```bash
cd /root/testa-phaglp2 && CLOUDINARY_URL=cloudinary://177836185349364:kGyFPY5oQaHDtmBs8Jw0N9rzsKU@phaglp NEXTAUTH_SECRET='0123456789abcdef0123456789abcdef' npx vitest run tests/lib/theme-colors.test.ts
```

Expected: All new tests pass.

**Step 3: Commit**

```bash
git add tests/lib/theme-colors.test.ts
git commit -m "test: cover admin theme toggle fallback"
```

---

## Final Validation Checklist

- [ ] `npx tsc --noEmit` passes
- [ ] `npx vitest run` passes
- [ ] `npx prettier --check` passes
- [ ] Manual dev-server smoke test of `/control/settings` toggle and public `/` page
