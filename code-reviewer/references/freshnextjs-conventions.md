# FreshNextJS Coding Conventions

## Framework & Language

- **Next.js 15**: Use App Router and Server Components by default.
- **TypeScript**: Strictly type all interfaces, props, and API responses.
- **React 19**: Utilize latest features like `useActionState`, `useOptimistic`, and `useFormStatus`.

## Data Management

- **Prisma ORM**:
  - Use `cuid` for all primary keys.
  - Ensure relations are properly indexed.
  - Follow naming conventions (PascalCase for models, camelCase for fields).
- **Redis**: Use for high-performance caching of frequently accessed data.
- **Server Actions**: Prefer Server Actions over API routes for form submissions and simple data mutations.

## Styling & UI

- **Tailwind CSS**: Use utility classes for styling.
- **Shadcn/UI**: Follow the established component patterns in `src/components/ui`.
- **Theme System**: Support light, dark, and system modes using `next-themes`.
- **Icons**: Use `Lucide React`.

## Authentication & Authorization

- **Auth.js (NextAuth)**: Use for session management.
- **Role-Based Access Control (RBAC)**: Gate admin features behind `admin` role checks in both middleware and server-side components/actions.
- **Passwords**: Always hash passwords using `bcryptjs`.

## Performance

- **Streaming**: Implement `loading.tsx` for slow-loading pages.
- **Caching**: Utilize Next.js data cache and Redis for optimal performance.
- **Images**: Always use `next/image` with proper `width`, `height`, and `alt` tags.

## Project Structure

- `src/app`: Routes and layouts.
- `src/components`: Reusable UI components.
- `src/lib`: Utility functions, database clients, and shared logic.
- `src/hooks`: Custom React hooks.
- `src/types`: TypeScript definitions.
