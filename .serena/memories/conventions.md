# Coding Conventions

## File Search Strategy (Crucial)

- Next.js utilizes uniform filenames like `page.tsx`, `layout.tsx`, and `route.ts`.
- **Convention**: Always prioritize searching and identifying folder paths (e.g. `src/app/settings/page.tsx` or `src/app/dashboard`) over raw filenames to avoid finding hundreds of unrelated `page.tsx` instances.

## TypeScript & Type Safety

- Strictly typed parameters, return types, and component props are required (no `any` types).
- Use `src/types/` for shared domain interfaces.

## Components & Rendering

- Default to React Server Components (RSC) inside `src/app/` for optimal performance.
- Use `'use client'` explicitly only at the top of files that require browser hooks (e.g., `useState`, `useEffect`, `useActionState`) or interactive events.
- Place shared presentation components under `src/components/` and style them with Tailwind CSS.

## Data Mutations

- Mutate database state using Next.js Server Actions ('use server') instead of raw API route requests where applicable.
- Keep data-fetching or secure service handlers in `src/server/` or Server Components.
