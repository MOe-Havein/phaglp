# AuthContext

**Prompt**  
AuthContext — Manages user identity, roles, and session state for the app and admin dashboard.

**Description**  
Client-side provider for authentication state. Designed to be lightweight and UI-focused. For production, pair with server endpoints that validate tokens and set httpOnly cookies.

**Usage**

- Wrap application with `AuthProvider` from `src/context/index.tsx`.
- Use `useAuth()` to access `{ settings, user, loading, login, logout, isAdmin }`.
- Implement server endpoints `/api/auth/login`, `/api/auth/logout`, `/api/auth/me` to validate tokens and return minimal user info.

**Perfect Gemini Prompt**  
Create a secure authentication system for Next.js 15 with TypeScript and Prisma. Provide:

- Prisma models for User and Session.
- API routes for login, logout, and /api/auth/me that validate JWTs and set httpOnly cookies.
- Middleware for server-side role checks for admin routes.
- Example client usage with AuthContext login/logout flow and token handling best practices.
