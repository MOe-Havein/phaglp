# Task 3: Server Action & RSC Boundary Audit

Execute ONLY this task.

Actions:

- Refactor all server actions to return:
  {
  success: boolean,
  data?: any,
  error?: string
  }

Requirements:

- Detect missing "use client"
- Fix client/server boundary violations
- Prevent ErrorEvent leakage
- Prevent Prisma model serialization
- Ensure serializePrisma is used before Client Components receive data

Rules:

- Do NOT redesign UI
- Do NOT modify Docker/CI
- Keep business logic unchanged

Validation:

- No React Server Component serialization errors
- No hydration issues
- No Event handler boundary violations

After execution:

1. Show changed files
2. Explain serialization fixes
3. Explain remaining risks
4. STOP
