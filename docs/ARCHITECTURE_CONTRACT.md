      # PHAGLP Architecture Contract

      ## Canonical Architecture

      src/
      ├── app
      ├── components
      │   ├── ui
      │   └── shared
      ├── features
      ├── hooks
      ├── lib
      ├── services
      ├── types
      └── validations

      ## Core Rules

      - Feature-first architecture
      - App Router only
      - Server Components by default
      - Shared abstractions centralized
      - Thin route handlers
      - Typed services
      - Zod validation required
      - No oversized components

      ## AI Governance

      AI-generated code must:
      - preserve architecture integrity
      - avoid unrelated rewrites
      - avoid duplicate abstractions
      - remain modular
      - pass typecheck/build validation
