# Admin Theme Color Customization Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Add admin-controlled front-end color customization to PHAGLP with a color picker in the admin settings panel, persisted settings API/storage, and live frontend color application using TailwindCSS and runtime theming.

**Architecture:** Store theme colors in `SiteSettings`, implement a `ThemeProvider` using CSS variables for runtime color injection rather than rebuild-time Tailwind config mutation, and expose a color picker in the existing admin settings form.

**Tech Stack:** Next.js 15, TailwindCSS, React Hook Form + Zod, Prisma `SiteSettings`, `sonner` toasts, Lucide icons.

---

## Current Context

### Existing surfaces

- `src/app/(admin)/control/settings/page.tsx` — admin settings page; currently renders `SettingsForm`
- `src/components/control/settings-form.tsx` — React Hook Form + Zod settings form; already has a `primaryColor` text input with a small static preview swatch and brand/SEO fields
- `src/app/api/control/settings/route.ts` — GET/POST settings API; already reads/writes `primaryColor`
- `tailwind.config.ts` — static theme colors like `primary`, `secondary`, `background`, `sidebar.*`
- `src/components/ui/ThemeProvider.tsx` + `ThemeToggle` — light/dark/system toggle only
- `docs/SEO_CONFIG.md` — documents branding and `SiteSettings`

### Assumed gaps to close

- `primaryColor` is stored but not visibly applied as the active CSS/token source across the site UI
- No color-picker control exists; only hex text input with preview swatch
- Brand colors beyond `primaryColor` are not editable from admin (e.g., `secondary`, `accent`, `background`, `sidebar`)
- Runtime theming likely uses Tailwind static classes, not dynamic CSS variables fed from settings

### Planned behavior

- Admin chooses colors via color pickers and saves them
- Saved colors are stored in `SiteSettings`
- Frontend applies colors using CSS custom properties + Tailwind utility mapping so changes take effect without rebuild/redeploy
- Preview updates immediately in the form
- Color fields validate as valid hex values

---

### Task 1: Add admin settings color fields in Prisma and validation

**Objective:** Extend settings validation and persistence contract for theme colors beyond `primaryColor`.

**Files:**

- Modify: `src/components/control/settings-form.tsx:25-40`
- Modify: `src/components/control/settings-form.tsx:43-57`
- Modify: `src/app/api/control/settings/route.ts:21-42`
- Modify: `src/app/api/control/settings/route.ts:44-73`

**Step 1: Update client-side Zod schema**

In `src/components/control/settings-form.tsx`, replace the existing `primaryColor` field block with color-friendly typed optional hex fields and update defaults.

```ts
const formSchema = z.object({
  siteName: z.string().min(2).max(50),
  siteUrl: z.string().url(),
  description: z.string().min(10).max(500),
  maintenanceMode: z.boolean(),
  allowRegistration: z.boolean(),
  enableGoogleAnalytics: z.boolean(),
  googleAnalyticsId: z.string().optional().nullable(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  primaryColor: z
    .string()
    .regex(
      /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/,
      "Enter a valid hex color like #3b82f6",
    )
    .optional(),
  secondaryColor: z
    .string()
    .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Enter a valid hex color")
    .optional(),
  backgroundColor: z
    .string()
    .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Enter a valid hex color")
    .optional(),
  textColor: z
    .string()
    .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Enter a valid hex color")
    .optional(),
  fullAddress: z.string().optional(),
  logoUrl: z.string().optional().nullable(),
  ogImage: z.string().optional().nullable(),
  faviconUrl: z.string().optional().nullable(),
});
```

Update `defaultValues` in the same file to include the new fields with safe defaults.

```ts
metaTitle: initialData?.metaTitle || "",
metaDescription: initialData?.metaDescription || "",
primaryColor: initialData?.primaryColor || "#0040a1",
secondaryColor: initialData?.secondaryColor || "#565e71",
backgroundColor: initialData?.backgroundColor || "#f8f9ff",
textColor: initialData?.textColor || "#181c22",
```

**Step 2: Update API request shape**

In `src/app/api/control/settings/route.ts`, accept and persist the same color fields in both GET output and POST body.

```ts
const {
  siteName,
  siteUrl,
  description,
  maintenanceMode,
  allowRegistration,
  enableGoogleAnalytics,
  googleAnalyticsId,
  metaTitle,
  metaDescription,
  primaryColor,
  secondaryColor,
  backgroundColor,
  textColor,
  logoUrl,
  ogImage,
  faviconUrl,
} = body;
```

Include those fields in the `update` and `create` objects for `prisma.siteSettings.upsert`.

**Step 3: Type safety update**

In `settings-form.tsx`, extend `SiteSettingsData` to include the new optional color fields.

```ts
interface SiteSettingsData {
  siteName?: string;
  siteUrl?: string;
  description?: string | null;
  maintenanceMode?: boolean;
  allowRegistration?: boolean;
  enableGoogleAnalytics?: boolean | string;
  googleAnalyticsId?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  backgroundColor?: string | null;
  textColor?: string | null;
  fullAddress?: string | null;
  logoUrl?: string | null;
  ogImage?: string | null;
  faviconUrl?: string | null;
}
```

**Step 4: Verify**

Run:

```bash
npx tsc --noEmit
```

Expected: no TS errors.

---

### Task 2: Replace text inputs with color pickers in admin form

**Objective:** Allow admins to visually choose theme colors from the settings panel.

**Files:**

- Modify: `src/components/control/settings-form.tsx:197-221`
- Create: `src/components/control/color-picker-field.tsx`

**Step 1: Create reusable color picker field**

Create `src/components/control/color-picker-field.tsx` as a small Shadcn-style wrapper combining a native `<input type="color">`, text input for exact hex edits, and swatch preview.

```tsx
"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type ColorPickerFieldProps = {
  label: string;
  description?: string;
  value?: string | null;
  onChange: (value: string) => void;
};

export function ColorPickerField({
  label,
  description,
  value,
  onChange,
}: ColorPickerFieldProps) {
  const hex = value || "#000000";

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={hex}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-9 cursor-pointer rounded-md border border-input bg-transparent p-0.5"
        />
        <Input
          value={hex}
          onChange={(e) => onChange(e.target.value)}
          className="w-28 font-mono"
          placeholder="#000000"
        />
      </div>
      <div>
        <p className="text-sm font-medium">{label}</p>
        {description ? (
          <p className="text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div
        className="h-10 w-full rounded-md border"
        style={{ backgroundColor: hex }}
      />
    </div>
  );
}
```

**Step 2: Use the picker in settings form**

Import `ColorPickerField` and replace the current `primaryColor` field block in `src/components/control/settings-form.tsx`.

```tsx
<FormField
  control={form.control}
  name="primaryColor"
  render={({ field }) => (
    <FormItem>
      <ColorPickerField
        label="Primary Color"
        description="Used for buttons, links, and accents."
        value={field.value}
        onChange={field.onChange}
      />
      <FormMessage />
    </FormItem>
  )}
/>
<FormField
  control={form.control}
  name="secondaryColor"
  render={({ field }) => (
    <FormItem>
      <ColorPickerField
        label="Secondary Color"
        description="Used for muted actions and secondary UI elements."
        value={field.value}
        onChange={field.onChange}
      />
      <FormMessage />
    </FormItem>
  )}
/>
<FormField
  control={form.control}
  name="backgroundColor"
  render={({ field }) => (
    <FormItem>
      <ColorPickerField
        label="Background Color"
        description="Admin preview only; public preview depends on runtime CSS variable application."
        value={field.value}
        onChange={field.onChange}
      />
      <FormMessage />
    </FormItem>
  )}
/>
<FormField
  control={form.control}
  name="textColor"
  render={({ field }) => (
    <FormItem>
      <ColorPickerField
        label="Text Color"
        description="Default body text color."
        value={field.value}
        onChange={field.onChange}
      />
      <FormMessage />
    </FormItem>
  )}
/>
```

**Step 3: Verify**

Run:

```bash
npx tsc --noEmit
```

Expected: no TS errors.

---

### Task 3: Add runtime theme CSS variable provider

**Objective:** Apply saved colors at runtime without rebuilding static Tailwind config.

**Files:**

- Create: `src/components/ui/theme-color-provider.tsx`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/(public)/layout.tsx` if separate public layout exists
- Create: `src/lib/get-theme-colors.ts`

**Step 1: Create color normalization utility**

Create `src/lib/get-theme-colors.ts`.

```ts
export type ThemeColors = {
  primary: string;
  secondary: string;
  background: string;
  text: string;
};

const DEFAULTS: ThemeColors = {
  primary: "#0040a1",
  secondary: "#565e71",
  background: "#f8f9ff",
  text: "#181c22",
};

function clampHex(hex?: string | null): string {
  if (!hex) return "";
  const normalized = hex.trim();
  if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(normalized)) return normalized;
  return "";
}

export function normalizeThemeColors(raw: {
  primaryColor?: string | null;
  secondaryColor?: string | null;
  backgroundColor?: string | null;
  textColor?: string | null;
}): ThemeColors {
  return {
    primary: clampHex(raw.primaryColor) || DEFAULTS.primary,
    secondary: clampHex(raw.secondaryColor) || DEFAULTS.secondary,
    background: clampHex(raw.backgroundColor) || DEFAULTS.background,
    text: clampHex(raw.textColor) || DEFAULTS.text,
  };
}

export function themeColorsToCssVars(colors: ThemeColors) {
  return {
    "--color-primary": colors.primary,
    "--color-secondary": colors.secondary,
    "--color-background": colors.background,
    "--color-text": colors.text,
  } as Record<string, string>;
}
```

**Step 2: Create client provider**

Create `src/components/ui/theme-color-provider.tsx`.

```tsx
"use client";

import {
  normalizeThemeColors,
  themeColorsToCssVars,
  type ThemeColors,
} from "@/lib/get-theme-colors";

type ThemeColorProviderProps = {
  initial: ThemeColors;
  children: React.ReactNode;
};

export function ThemeColorProvider({
  initial,
  children,
}: ThemeColorProviderProps) {
  const cssVars = themeColorsToCssVars(initial);

  return (
    <div style={cssVars} className="min-h-screen bg-background text-text">
      {children}
    </div>
  );
}
```

Keep this intentionally small. Do not add persistence toasts or remote fetch loops here.

**Step 3: Wire into layout**

In `src/app/layout.tsx`, read `SiteSettings` server-side and pass colors into `ThemeColorProvider`.

```tsx
import { ThemeColorProvider } from "@/components/ui/theme-color-provider";
import { normalizeThemeColors } from "@/lib/get-theme-colights";

async function getSettingsColors() {
  try {
    const settings = await prisma.siteSettings.findUnique({ where: { id: "global" } });
    return normalizeThemeColors({
      primaryColor: settings?.primaryColor,
      secondaryColor: settings?.secondaryColor,
      backgroundColor: settings?.backgroundColor,
      textColor: settings?.textColor,
    });
  } catch {
    return normalizeThemeColors({});
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const colors = await getSettingsColors();
  // ...
  return (
    <html ...>
      <body ...>
        <ThemeProvider ...>
          <ThemeColorProvider initial={colors}>
            {children}
          </ThemeColorProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

**Step 4: Verify**

Run:

```bash
npx tsc --noEmit
```

Expected: no TS errors.

---

### Task 4: Map Tailwind utilities to CSS variables for live updates

**Objective:** Make Tailwind classes read from the runtime CSS variables so UI updates immediately after admin saves colors.

**Files:**

- Modify: `tailwind.config.ts`

**Step 1: Replace static primary/secondary/background/text tokens with CSS-variable mappings**

In `tailwind.config.ts`, change:

```ts
primary: {
  DEFAULT: "#0040a1",
  foreground: "#ffffff",
},
secondary: {
  DEFAULT: "#565e71",
  foreground: "#ffffff",
},
background: "#f8f9ff",
foreground: "#181c22",
```

to:

```ts
primary: {
  DEFAULT: "rgb(var(--color-primary) / <alpha-value>)",
  foreground: "#ffffff",
},
secondary: {
  DEFAULT: "rgb(var(--color-secondary) / <alpha-value>)",
  foreground: "#ffffff",
},
background: "rgb(var(--color-background) / <alpha-value>)",
foreground: "rgb(var(--color-text) / <alpha-value>)",
```

Keep the provider in Task 3 setting CSS custom properties from the saved ThemeColors values.

**Step 2: Update dark mode where needed only**

If dark-mode color tokens are defined separately, keep them intact unless docs explicitly require admin override in dark mode. Current request mentions `dark:` must be preserved, so do not remove `dark:` variants.

**Step 3: Verify**

Run:

```bash
npm run typecheck
```

Expected: no TS errors. Note full build may still fail on backend env checks unrelated to this feature.

---

### Task 5: Refresh previews and admin UX polish

**Objective:** Improve admin UX and give clearer immediacy when editing colors.

**Files:**

- Modify: `src/components/control/settings-form.tsx`

**Step 1: Add a small site preview strip**

Below the color pickers in `src/components/control/settings-form.tsx`, render an `AdminThemePreview` mini component showing a button/card/background using the current form values.

```tsx
function AdminThemePreview({ colors }: { colors: ThemeColors }) {
  return (
    <div
      className="rounded-lg border p-4 space-y-3"
      style={{ backgroundColor: colors.background, color: colors.text }}
    >
      <div className="flex items-center gap-2">
        <span className="font-semibold">
          {form.watch("siteName") || "PHAGLP"}
        </span>
      </div>
      <button
        className="rounded-md px-3 py-2 text-white"
        style={{ backgroundColor: colors.primary }}
      >
        Primary Action
      </button>
      <p className="text-xs opacity-80">
        This preview shows your selected theme tokens.
      </p>
    </div>
  );
}
```

Use `form.watch("primaryColor")` etc. to feed live values.

**Step 2: Validation UX**

On submit failure due to invalid hex, sonner toast already exists. Ensure the specific Zod path message surfaces using existing `FormMessage`.

**Step 3: Verify**

Run:

```bash
npx tsc --noEmit
```

Expected: no TS errors.

---

### Task 6: Update Spec Kit documentation

**Objective:** Keep project docs aligned and capacity-scoped; do not just change code.

**Files:**

- Modify: `.specify/specs/hermes-agent-integration.md`
- Modify: `.specify/memory/constitution.md` if theme boundaries are constrained
- Modify: `docs/SEO_CONFIG.md`
- Modify: `docs/nextjs-standards.md`

**Step 1: Document admin color customization behavior**

In `docs/SEO_CONFIG.md`, add a Bulma list under **Branding**:

- Primary, secondary, background, and text color fields in admin panel
- Storage path: `SiteSettings`
- Runtime application via CSS variables in `ThemeColorProvider`

**Step 2: Document Tailwind token override strategy**

In `docs/nextjs-standards.md`, add a short section saying:

- Runtime theme colors are driven by CSS custom properties from `ThemeColorProvider`
- Tailwind tokens `primary`, `secondary`, `background`, `foreground` read from variables
- No client-side `@apply` usage for theming

**Step 3: Verify**

Run:

```bash
specify integration status
specify self check
```

Expected: Spec Kit remains healthy.

---

## Tests / Validation

- `npm run typecheck` should stay green after each task
- Manual validation:
  - Open `/control/settings`, change colors using color pickers, save, and confirm toast success
  - Reload public pages and confirm UI reflects new primary/accent usage where `bg-primary` / `text-primary` is applied
  - Confirm dark/light mode toggling still works and respects existing `dark:` variants
  - Confirm invalid hex input shows validation error
- Automated:
  - No existing test suite target is identified in this plan; if desired, add Playwright or Vitest RTL tests for validation output and settings form submission using `happy-dom` in CI

## Risks, Tradeoffs, and Open Questions

- **Risk:** Routing all color changes through CSS variables can miss component-scoped overrides if some UI uses hardcoded Tailwind palette values outside mapped tokens.
  - **Mitigation:** Audit major components for direct palette colors first; this plan assumes the main token set is enough for v1.
- **Risk:** Admin-set colors may fail contrast/accessibility checks.
  - **Mitigation:** Consider adding optional contrast validation in `get-theme-colors.ts` or UI helper in a follow-up.
- **Tradeoff:** Runtime CSS variables are lighter than rebuild-time Tailwind config mutation, but require careful mapping to existing class names.
- **Risk:** `SiteSettings` model may already lack the new color columns in production.
  - **Mitigation:** This plan does not include Prisma migration workflow. If needed, ask for `prisma migrate dev` separately because it requires DB access and migration review.
- **Open Question:** Should site visitors also have a theme color preference, or only admins? This plan limits scope to admin control only.
