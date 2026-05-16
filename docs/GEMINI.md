# Documentation Context

This directory contains instructions and prompts for building specific modules of the FreshNextJS application.

## Instruction for Gemini

- When working within this directory or specifically with these documentation files, prioritize the patterns and "Perfect Gemini Prompts" defined here.
- If a context file is empty (e.g., `ThemeContext.md`, `DatabaseContext.md`), you may be asked to populate it with relevant instructions or prompts based on the project's goals.
- Ensure that any generated code or schema matches the descriptions in these files to maintain project-wide consistency.

## Context Mapping

- **Authentication:** Use `AuthContext.md` and the prompts in `GeminiPrompts.md`.
- **Admin Dashboard:** Use `AdminContext.md` and the detailed API prompts in `GeminiPrompts.md`.
- **Database:** Refer to `docs/schema.prisma` and `DatabaseContext.md`.
- **Seeding:** Use `docs/seed.ts` and the seed script prompts in `GeminiPrompts.md`.
