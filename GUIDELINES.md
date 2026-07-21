# PHAGLP Project Guidelines

## Architecture

- Feature-first modules live under `src/features/{name}`.
- Shared UI lives under `src/components/ui/**`.
- App Router with Server Components by default.
- Thin route handlers; business logic belongs in actions/services, not pages.

## Code Standards

- TypeScript strict mode; no `any`.
- Zod validation on all inputs and server actions.
- Use Tailwind utility classes only; avoid `@apply`.
- Dark mode supported everywhere using shared theme tokens.
- No direct DB queries in UI components.

## Security

- httpOnly cookies for sessions.
- bcrypt for password hashing.
- RBAC enforced in middleware and API routes.
- Never commit secrets or `.env` files.

## Database

- Prisma ORM with PostgreSQL.
- Use `cuid` IDs.
- Define relations and indexes explicitly.

## Delivery

- Preview on Vercel; production on configured host.
- Revalidate or redeploy only through approved automation.
