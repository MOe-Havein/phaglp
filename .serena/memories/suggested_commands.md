# Suggested Commands

## Development

- `pnpm dev` - Start local development server on default port.

## Database (Prisma)

- `pnpm db:generate` - Regenerate Prisma Client schema manually.
- `pnpm db:push` - Sync Prisma schema directly to development database (without migrations).
- `pnpm db:seed` - Run database seeder (`seed-certificate.ts` or similar).
- `pnpm db:studio` - Open the Prisma Studio GUI.

## Testing & Quality Control

- `pnpm typecheck` - Run TypeScript compiler checks without emitting output (`tsc --noEmit`).
- `pnpm format` - Run Prettier to format codebase.
- `pnpm format:check` - Check formatting compliance across files.
- `pnpm build` - Compile production Next.js standalone bundle.
