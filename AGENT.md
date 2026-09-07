# Project Context: phaglp

This project is a Next.js 15 application using TypeScript, Prisma, and TailwindCSS. It aims to be a robust, secure, and modern full-stack application with a clean architecture.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Styling:** TailwindCSS
- **Authentication:** JWT with httpOnly cookies, bcryptjs for password hashing
- **UI System:** Theme system (light/dark/system)

## Context Files

The `docs/` directory contains several context files and predefined prompts to guide the generation of specific features:

- `AGENT_RULES.md`: agent rules
- `ARCHITECTURE_CONTRACT.md`: Context for the ARCHITECTUR .
- `agent-boundaries.json`: Agent Context for the boundaries.
- `DatabaseContext.md`: (Placeholder) Context for database schema and relations.
- `ThemeContext.md`: (Placeholder) Context for the UI theme system.

## General Instructions

- **Code Style:** Follow modern React and Next.js best practices. Use functional components and hooks.
- **Security:** Always prioritize security, especially when handling authentication and sensitive data. Use httpOnly cookies for sessions and bcrypt for hashing.
- **Prisma:** When creating or updating models, ensure relations and indexes are properly defined. Use `cuid` for IDs.
- **API Routes:** Implement API routes in the `app/api/` directory. Use middleware for role-based access control.
- **Components:** Organize components logically, separating UI components from business logic where appropriate.

## Usage

When asked to implement a feature, refer to the relevant context file in `docs/` and the root `GUIDELINES.md` to ensure consistency with the project's design and requirements.
