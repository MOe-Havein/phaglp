# Tech Stack

## Runtime & Package Manager

- Runtime: Node.js ^22.x (configured in `package.json` engines)
- Package Manager: pnpm@10.6.1 (with `pnpm-lock.yaml` and `pnpm-workspace.yaml`)

## Core Frameworks

- Frontend/Backend Framework: Next.js 15.5.9 (App Router)
- Language: TypeScript (strict mode, with `tsconfig.json`)
- Styling: Tailwind CSS, PostCSS, Lucide Icons

## Database & ORM

- ORM: Prisma Client (^6.19.3)
- Database adapter: @prisma/adapter-libsql / Client (@libsql/client) for serverless SQLite/Turso databases.

## Libraries & Integrations

- Auth: NextAuth.js (v5 beta)
- Forms: React Hook Form with `@hookform/resolvers`
- Editor: Tiptap Editor ecosystem (`starter-kit`, `react`, etc.)
- Animation: Framer Motion
- Monitoring: Vercel Analytics, Speed Insights
- AI capabilities: AI SDK (`ai`), @ai-sdk/openai, @ai-sdk/google, cohere-ai
