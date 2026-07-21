# Core Project Map

## Source Map

- Next.js 15 full-stack application utilizing the App Router and TypeScript.
- `src/app/` - App Router structure containing views, layouts, and API endpoints. Note: Next.js uses uniform `page.tsx`, `layout.tsx`, and `route.ts` naming; prioritize directory/folder paths over file names when searching.
- `src/components/` - Global and reusable UI components.
- `src/features/` - Feature-specific logic, components, hooks, and views.
- `src/actions/` - Next.js Server Actions for forms and data manipulation.
- `src/server/` - Backend services, data access layers, and DB logic.
- `src/lib/` & `src/utils/` - Global configurations, utility helpers, and wrappers.
- `src/types/` - Shared TypeScript interfaces and type declarations.
- `prisma/` - Database schema definition (`schema.prisma`) and seed configurations.

## Memory Graph & Navigation

- To understand the project's languages, frameworks, package manager, and dependency pins, read `mem:tech_stack`.
- To find common commands used for development, database sync, testing, and operations, read `mem:suggested_commands`.
- To review strict code styles, TypeScript structures, React patterns, and file search heuristics, read `mem:conventions`.
- To learn about pre-commit/deployment verification checklists and commands required before declaring tasks done, read `mem:task_completion`.
