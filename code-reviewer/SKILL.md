---
name: code-reviewer
description: Expert code review for the PHAGLP project. Use when reviewing pull requests, local changes, or specific files for best practices, security, performance, and adherence to project conventions.
---

# Code Reviewer

Expert assistant for performing high-quality code reviews on the PHAGLP codebase. This skill ensures that code changes align with project standards, security requirements, and performance goals.

## Workflow

When asked to review code, follow these steps:

1.  **Analyze Context**: Identify the purpose of the change (new feature, bug fix, refactoring).
2.  **Verify Conventions**: Refer to [freshnextjs-conventions.md](references/freshnextjs-conventions.md) to ensure the code follows established project patterns.
3.  **Security Audit**: Use the [security-checklist.md](references/security-checklist.md) to identify potential vulnerabilities.
4.  **Performance Check**: Evaluate the impact on load times, database queries, and client-side rendering.
5.  **Logic & Correctness**: Look for edge cases, potential bugs, and missing tests.
6.  **Provide Feedback**: Offer clear, actionable feedback, categorized by severity (Critical, Major, Suggestion).

## Key Review Areas

### Next.js & React

- Proper use of Server Components vs. Client Components.
- Correct implementation of Server Actions with `useActionState` and authorization.
- Efficient state management and hook usage.

### Database (Prisma)

- Use of `cuid` for primary keys.
- Proper handling of relations and transactions.
- Efficient querying (avoiding N+1 problems).

### Styling (Tailwind & Shadcn)

- Consistent use of utility classes.
- Adherence to the design system and accessibility (A11Y) standards.

### Testing

- Presence of unit tests (Vitest) for business logic.
- Presence of E2E tests (Playwright) for critical user flows.

## Example Requests

- "Review my changes in `src/lib/actions.ts`."
- "Perform a security audit on the new authentication flow."
- "Check if this component follows our Shadcn/UI patterns."
- "Does this database migration align with our conventions?"
