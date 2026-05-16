# AdminContext

**Prompt**  
AdminContext — Controls admin dashboard UI state, permissions, and analytics refresh cadence.

**Description**  
Manages admin UI state such as sidebar visibility and analytics polling interval. Combine with server-side role checks to secure admin pages.

**Usage**

- Wrap admin layout with `AdminProvider`.
- Use `useAdmin()` to control sidebar and analytics refresh cadence.
- Gate admin pages with server-side role checks and middleware.

**Perfect Gemini Prompt**  
Scaffold an Admin Dashboard for Next.js 15 with TypeScript and TailwindCSS. Include:

- Secure server-side role checks.
- User management pages with list, create, edit, delete.
- Analytics widgets with real-time counts and charts.
- Audit log model and API routes using Prisma.
