# ThemeContext

**Prompt**  
ThemeContext — Manages light, dark, and system theme states with SSR hydration safety.

**Description**  
A client-side provider that wraps the application to handle theme switching. It persists user preferences in `localStorage`, applies the `.dark` class to the HTML root, and prevents "flicker" during hydration by synchronizing with the server's initial render.

**Usage**

- Wrap the root layout in `src/app/layout.tsx` with `ThemeProvider`.
- Use `useTheme()` to access `{ theme, setTheme, resolvedTheme }`.
- Utilize the `ThemeToggle` component in the Navbar for user control.

**Perfect Gemini Prompt**  
Implement a theme system for Next.js 15 with TypeScript and TailwindCSS. Provide:

- A `ThemeProvider` using `next-themes` or a custom React Context.
- Support for 'light', 'dark', and 'system' modes.
- Logic to persist preference in localStorage and apply the 'dark' class to the root element.
- A `ThemeToggle` UI component using Lucide icons (Sun, Moon) and Shadcn/UI button styles.
- A strategy to prevent hydration mismatch (SSR-safe mounting).
