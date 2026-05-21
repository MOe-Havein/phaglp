# DatabaseContext

**Prompt**  
DatabaseContext — Manages the PostgreSQL database schema, migrations, connection pooling, and Prisma Client instantiation.

**Description**  
Configures Prisma ORM with PostgreSQL for data models such as User, Course, Lecture, MarriageProfile, Session, Page, and Analytics. Ensures a singleton Prisma Client is used across hot-reloads and implements optimal pooling configuration for serverless deployment.

**Usage**

- Define models and relations in [prisma/schema.prisma](file:///home/moe/Full-Stack-phagpl/prisma/schema.prisma).
- Use [src/lib/prisma.ts](file:///home/moe/Full-Stack-phagpl/src/lib/prisma.ts) (or [src/lib/db/prisma.ts](file:///home/moe/Full-Stack-phagpl/src/lib/db/prisma.ts)) to access the global Prisma Client singleton.
- Run database migrations using `npx prisma migrate dev` in development.
- Seed sample data with `npx prisma db seed` referencing [prisma/seed.ts](file:///home/moe/Full-Stack-phagpl/prisma/seed.ts).

**Perfect Gemini Prompt**  
Generate a database configuration and initialization system using Prisma ORM and PostgreSQL. Provide:

- A robust `PrismaClient` singleton utility to prevent connection exhaustion during hot-reloads in development.
- Error handling wrappers to safely serialize data returned from Prisma queries for Server and Client Components (avoiding Date or custom class serialization issues).
- A schema configuration structure with core entities: User (roles: USER, ADMIN, INSTRUCTOR), Course, Lecture, Page, Session, and Analytics.
- Proper indexing definitions on foreign key and frequently searched query fields (e.g., email, slug, role).
