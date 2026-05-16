# Security Review Checklist

## Authentication & Authorization

- [ ] Are all sensitive routes protected by authentication?
- [ ] Is Role-Based Access Control (RBAC) enforced on the server-side?
- [ ] Are sessions handled securely (httpOnly, Secure, SameSite cookies)?
- [ ] Does the logout process properly invalidate the session?

## Data Validation & Sanitization

- [ ] Is all user input validated using Zod or a similar library?
- [ ] Are SQL injection vulnerabilities mitigated by using Prisma (parameterized queries)?
- [ ] Is output properly encoded to prevent XSS (React does this by default, but check `dangerouslySetInnerHTML`)?
- [ ] Are file uploads restricted by type and size?

## Cryptography

- [ ] Are passwords hashed using a strong algorithm like `bcryptjs`?
- [ ] Are API keys and secrets stored securely in environment variables (never committed to Git)?
- [ ] Is sensitive data encrypted at rest if required?

## Communication

- [ ] Is HTTPS enforced in production?
- [ ] Are CORS policies correctly configured?

## Error Handling & Logging

- [ ] Are detailed error messages hidden from end-users in production?
- [ ] Is sensitive information (passwords, tokens) excluded from logs?

## Server Actions & API Routes

- [ ] Do Server Actions include authorization checks?
- [ ] Is rate limiting implemented for sensitive endpoints?
- [ ] Are CSRF protections in place (standard in Next.js/NextAuth)?
