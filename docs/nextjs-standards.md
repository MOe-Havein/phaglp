# 📝 Next.js 15 Project Standards

### 1. Component Architecture

- **Default to Server Components:** All pages and layout components must be React Server Components (RSC) by default.
- **Client Component Restriction:** Only use the `'use client'` directive for components that require interactivity (e.g., hooks like `useState`, `useEffect`). These should be localized in the `src/components/` directory.

### 2. Data Fetching

- **Server-Side Fetching:** Data must be fetched directly within Server Components using `await`.
- **Parallel Fetching:** Use `Promise.all()` for independent data fetches to avoid waterfalls.
- **No Client-Side Fetching:** Avoid `useEffect` for initial data fetching to ensure optimal SEO.

### 3. Server Actions

- **File Structure:** All Server Actions must include `'use server'` at the top.
- **Validation:** Every Server Action **must** validate input using a **Zod** schema before interacting with the database.

### 4. Form Handling

- **State Management:** Use the React 19 `useActionState` hook for all form submissions.
- **UX:** Ensure forms handle pending states and display server-side errors clearly.

### 5. TypeScript & Interface Standards

- **Structure:** Use `interface` for data models and component props; use `type` for unions or intersections.
- **Naming:** Do not use the `I` prefix. Props should be named `{ComponentName}Props`.
- **Zero 'any' Policy:** Never use `any`. Use `unknown` if the type is uncertain and narrow it down.
- **Centralization:** Core entities (Course, User, Lecture) must be defined in `src/types/index.ts`.

### 6. Tailwind CSS & UI Patterns

- **Class Ordering:** Follow: Layout → Positioning → Box Model → Typography → Visuals (e.g., `flex relative m-4 text-white bg-blue-500`).
- **Abstraction:** Avoid using `@apply` in CSS files. If a Tailwind string is too long, extract it into a small sub-component.
- **Design Tokens:** Only use theme colors (e.g., `primary`, `secondary`) defined in `tailwind.config.ts`.
- **Dark Mode:** Every component must be built with a `dark:` variant to match the PHAGLP dark aesthetic.
- **Runtime Theme Colors:** Admin-configurable colors are driven by CSS custom properties set in `ThemeColorProvider`. Tailwind tokens such as `primary`, `secondary`, `background`, and `foreground` read from runtime CSS variables. Do not use client-side `@apply` for theme color overrides.

### 7. Theming & Admin Controls

- **Theme Source:** `SiteSettings` is the source of truth for `primaryColor`, `secondaryColor`, `backgroundColor`, and `textColor`.
- **Runtime Application:** `src/components/ui/theme-color-provider.tsx` injects CSS variables from `SiteSettings`.
- **Admin UI:** `src/components/control/settings-form.tsx` exposes color pickers for those fields.
- **Validation:** Hex colors must match `/#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})/`.

---
