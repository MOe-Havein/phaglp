
     # PHAGLP AI Engineering Rules

      ## Core Principle

      All new business features must be implemented as isolated feature modules.

      Never place new business logic directly into:
      - src/components
      - src/app
      - src/lib

      unless the code is truly global/shared infrastructure.

      ---

      # Feature Module Structure

      Each feature must follow:

      src/features/{feature-name}

      - components
      - hooks
      - actions
      - services
      - validations
      - types
      - constants

      ---

      # App Router Rules

      - Server Components by default
      - Client Components only when required
      - No direct DB queries inside UI components
      - Route handlers must stay thin

      ---

      # TypeScript Rules

      - Strict typing required
      - Never use any
      - Zod validation required

      ---

      # Forbidden Operations

      Agents may NOT:
      - rewrite unrelated modules
      - delete infrastructure
      - modify deployment workflows
      - overwrite prisma schema
      - edit environment files
