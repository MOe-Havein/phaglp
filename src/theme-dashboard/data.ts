import type { ThemeDashboardData } from "./types";

export const dashboardData: ThemeDashboardData = {
  repoRoot: "/root/testa-phaglp2",
  analyzed: [
    {
      path: "src/components/theme/ThemeInjector.tsx",
      status: "existing",
      summary:
        "Injects CSS variables based on admin settings and themes theming model data.",
      opportunities: [
        "Add route-scoped theme sources for marketing/admin split.",
        "Support multi-theme presets with caching.",
      ],
      requiredModifications: [
        "Accept dynamic color tokens from admin settings with graceful fallback.",
      ],
      reusableArchitecture: [
        "CSS-variable mapping pattern",
        "Server-to-client token handoff via script tag",
      ],
    },
    {
      path: "src/components/ui/ThemeProvider.tsx",
      status: "existing",
      summary:
        "Locale-and-system-aware theme switcher using next-themes.",
      opportunities: [
        "Store admin theme selection in user preference or account model.",
      ],
    },
    {
      path: "src/components/control/settings-form.tsx",
      status: "modified",
      summary: "Admin settings form with color fields and page actions.",
      requiredModifications: [
        "Expand color schema for full token matrix",
        "Add high-contrast/safe mode logic",
      ],
    },
    {
      path: "app/(admin)/settings/theme/page.tsx",
      status: "new",
      summary: "Admin theme customization page route.",
      reusableArchitecture: [
        "Admin layout + control sidebar patterns already exist.",
      ],
    },
    {
      path: "src/lib/get-theme-colors.ts",
      status: "existing",
      summary:
        "Utility that converts theme colors to CSS variables used by ThemeColorProvider/ThemeInjector.",
      opportunities: [
        "Add brand-safe validation before writing CSS vars.",
      ],
    },
    {
      path: "prisma/schema.prisma",
      status: "new",
      summary: "Schema file where SiteSettings theme fields are persisted.",
      requiredModifications: [
        "Add theme token fields under SiteSettings",
      ],
    },
  ],
  architecture: [
    { from: "Admin Panel", to: "Server Action", label: "editor UI" },
    { from: "Server Action", to: "Zod Validation", label: "payload shaping" },
    { from: "Zod Validation", to: "Prisma", label: "type-safe write" },
    { from: "Prisma", to: "SiteSettings", label: "persist settings" },
    { from: "SiteSettings", to: "ThemeInjector", label: "token read" },
    { from: "ThemeInjector", to: "CSS Variables", label: "runtime theming" },
    { from: "CSS Variables", to: "Public Website", label: "visual output" },
  ],
  schemaDiffs: [
    {
      model: "SiteSettings",
      fields: [
        { name: "colorPrimary", status: "new", notes: "Brand primary." },
        { name: "colorSecondary", status: "new", notes: "Brand secondary." },
        { name: "fontHeading", status: "new" },
        { name: "fontBody", status: "new" },
        { name: "borderRadius", status: "new" },
        { name: "logoUrl", status: "modified", notes: "Extend validation + alt text usage." },
        { name: "updatedAt", status: "unchanged" },
      ],
    },
  ],
  fileStructure: [
    { path: "src/", status: "existing" },
    { path: "src/app/(admin)/settings/theme/page.tsx", status: "new" },
    { path: "src/app/(public)/implementation-plan/page.tsx", status: "modified" },
    { path: "src/theme-dashboard/", status: "new" },
    { path: "src/theme-dashboard/types.ts", status: "new" },
    { path: "src/theme-dashboard/data.ts", status: "new" },
    { path: "src/theme-dashboard/components/", status: "new", summary: "Dashboard component tree." },
    { path: "src/components/theme/ThemeInjector.tsx", status: "modified", summary: "Theme CSS variable injection." },
    { path: "src/components/control/settings-form.tsx", status: "modified", summary: "Admin settings form." },
    { path: "src/lib/get-theme-colors.ts", status: "modified", summary: "Utility for theme-to-CSS mapping." },
    { path: "prisma/schema.prisma", status: "modified", summary: "Add theme token fields to SiteSettings." },
    { path: "docs/DESIGN.md", status: "existing", summary: "Source of design tokens/cds rules." },
  ],
  adminTabs: [
    {
      name: "Colors",
      controls: [
        "Primary color picker",
        "Secondary color picker",
        "Background selector",
        "Text color selector",
      ],
      previewBehavior:
        "Admin preview pane updates header/card styles via CSS variables in real time.",
      affectedComponents: [
        "ThemeInjector.tsx",
        "ThemeColorProvider.tsx",
        "ControlSidebar.tsx",
        "site-header.tsx",
      ],
    },
    {
      name: "Typography",
      controls: [
        "Heading font selector",
        "Body font selector",
        "Display font toggle",
      ],
      previewBehavior:
        "Preview pane toggles type scale tokens and updates headings/cards.",
      affectedComponents: [
        "ThemeInjector.tsx",
        "home/SAASFxHero.tsx",
        "home/CoursesPricing/index.tsx",
      ],
    },
    {
      name: "Layout",
      controls: [
        "Container max width",
        "Grid gutter",
        "Sidebar width",
        "Card rounding",
      ],
      previewBehavior:
        "Shows layout blocks at mobile/tablet/desktop widths.",
      affectedComponents: [
        "layout-client.tsx",
        "ControlSidebar.tsx",
        "navigation/footer.tsx",
      ],
    },
    {
      name: "Branding",
      controls: [
        "Logo upload",
        "Favicon set",
        "Alt text",
        "Preview mode",
      ],
      previewBehavior:
        "Shows updated branding header and footer preview.",
      affectedComponents: [
        "site-header.tsx",
        "navigation/footer.tsx",
        "settings-form.tsx",
      ],
    },
    {
      name: "Advanced",
      controls: [
        "Dark mode default",
        "Cache TTL selector",
        "Revalidation trigger button",
      ],
      previewBehavior:
        "Perspectes modes and exposes server action status.",
      affectedComponents: [
        "ThemeProvider.tsx",
        "ThemeToggle.tsx",
        "server/cache.ts",
      ],
    },
  ],
  serverActionFlow: [
    {
      label: "Form submission",
      description:
        "Zod schema shaped from admin form state, including optional empty string fallbacks.",
    },
    {
      label: "Validation",
      description:
        "Reject malformed hex values, enforce font allowlist, constrain radius tokens.",
      codeSnippet: `const schema = z.object({\n  colorPrimary: z.string().regex(/^#[0-9a-f]{3,8}$/i).optional(),\n  fontHeading: z.enum(["Source Sans 3", "Inter", "Playfair Display"]).optional()\n});`,
    },
    {
      label: "Server Action",
      description:
        "Persist into SiteSettings and queue dependent cache tags.",
      codeSnippet: `await prisma.siteSettings.update({ where: { id: 1 }, data: themingPayload });`,
    },
    {
      label: "Cache Revalidation",
      description:
        "Tag layout/home/theme reads for revalidatePath/tags after success.",
      codeSnippet: `revalidateTag(SETTINGS_THEME_TAG);\nrevalidatePath("/");`,
    },
    {
      label: "Theme Updated",
      description:
        "UI shows success toast; ThemeInjector re-reads from cache on next SSR/RSC pass.",
    },
  ],
  themeTokens: {
    colors: {
      primary: "#0056D2",
      secondary: "#565E71",
      surface: "#F8F9FF",
      onSurface: "#181C22",
    },
    typography: {
      display: { fontFamily: "Source Sans 3", fontSize: "48px", fontWeight: "700" },
      headline: { fontFamily: "Source Sans 3", fontSize: "32px", fontWeight: "600" },
      body: { fontFamily: "Source Sans 3", fontSize: "16px", fontWeight: "400" },
    },
    rounded: {
      DEFAULT: "0.5rem",
      lg: "1rem",
    },
    spacing: {
      base: "8px",
      containerMax: "1200px",
      gutter: "24px",
    },
  },
  implementationPhases: [
    {
      id: 1,
      title: "Foundation",
      objective:
        "Expose theme fields in Prisma, build server actions schema and cache contracts.",
      tasks: [
        "Extend SiteSettings schema",
        "Create theme validation schemas",
        "Implement updateTheme action",
        "Wire revalidation tags",
      ],
      dependencies: [],
      checklist: [
        "`prisma db push` succeeds",
        "Server action returns typed ThemeSettingsDto",
        "Cache invalidate verified in dev",
      ],
      status: "pending",
    },
    {
      id: 2,
      title: "Admin UI",
      objective:
        "Deliver the theme settings page with tabbed controls and preview pane.",
      tasks: [
        "Create route app/(admin)/settings/theme/page.tsx",
        "Build shared control sidebar integration",
        "Implement live preview panel",
        "Connect form to server action",
      ],
      dependencies: ["Phase 1"],
      checklist: [
        "Route protected by admin middleware + RBAC",
        "Preview updates via CSS variables without rerendering entire page",
        "Error + success states displayed",
      ],
      status: "pending",
    },
    {
      id: 3,
      title: "Server Action Integration",
      objective:
        "Harden save workflow with validation, authorization, cache heartbeat.",
      tasks: [
        "Add feature-flag write guards",
        "Guard admin role in server action",
        "Add toast + optimistic UI hook",
      ],
      dependencies: ["Phase 2"],
      checklist: [
        "Unauthorized attempts show exact failure toast",
        "Optimistic preview reverts on failure",
        "Revalidation tag present in successful responses",
      ],
      status: "pending",
    },
    {
      id: 4,
      title: "Advanced Features",
      objective:
        "Introduce presets, multi-site support, and accessibility safe modes.",
      tasks: [
        "Preset import/export",
        "High-contrast mode toggle",
        "Admin-specific theme switch",
      ],
      dependencies: ["Phase 3"],
      checklist: [
        "Preset export is JSON downloadable",
        "High contrast meets WCAG contrast thresholds",
        "Admin theme isolated from public preview",
      ],
      status: "pending",
    },
    {
      id: 5,
      title: "Testing & Polish",
      objective:
        "Automate coverage for validation, colors, caching, and route behavior.",
      tasks: [
        "Unit tests for theme utilities",
        "Integration tests for admin route",
        "Visual regression for tokens",
      ],
      dependencies: ["Phase 4"],
      checklist: [
        "`pnpm exec vitest run` passes theme suites",
        "Playwright covers admin theme save + preview",
        "Documentation for CDS tokens updated",
      ],
      status: "pending",
    },
  ],
  overallProgress: 0,
};
