# Gemini Prompts

Use these prompts with a code assistant to generate server code, Prisma schema, API routes, and UI scaffolding for your Next.js application.

## 1. Authentication System

### High-level Prompt

Create a secure authentication system for Next.js 15 with TypeScript and Prisma. Provide Prisma models for User and Session, API routes for login/logout/me that validate JWTs and set httpOnly cookies, middleware for admin role checks, and example client usage with AuthContext.

---

## 2. Database Schema & Seeding

### High-level Prompt

Generate a Prisma schema for a full-stack Next.js app with models: User, Role, Session, Post, Comment, and Analytics. Include relations, indexes, seed script, and recommended migration and connection pooling settings for Postgres in production.

### Seed Script Prompt

Provide a Prisma seed script that creates an admin user with a hashed password and a few sample users. Include instructions to run migrations and seed.

---

## 3. UI Theme System

### High-level Prompt

Implement a theme system for Next.js 15 with TypeScript and TailwindCSS. Support 'light', 'dark', and 'system' modes, persist preference in localStorage, apply the 'dark' class to the root element, and provide a UI toggle component with SSR hydration strategy.

---

## 4. Admin Dashboard & API

### High-level Prompt

Scaffold an Admin Dashboard for Next.js 15 with TypeScript and TailwindCSS. Include secure server-side role checks, user management pages, analytics widgets, audit log, API routes, and Prisma queries for each feature.

### Detailed API Generation Prompt

Create server-side API routes for an Admin Users module in Next.js 15 using TypeScript and Prisma. Provide:

- Prisma schema for User model with fields: id (cuid), name, email (unique), role (enum), passwordHash, createdAt, updatedAt.
- API routes under /api/admin/users for GET (list), POST (create), GET /:id, PUT /:id, DELETE /:id.
- Use bcrypt for password hashing, validate inputs, and return minimal user data (no passwordHash).
- Add middleware to require admin role for all routes.
- Include example tests for each endpoint.

### Secure Middleware Prompt

Implement server-side middleware for Next.js 15 that checks session or JWT cookie, validates user role via Prisma, and rejects non-admin requests with 403. Provide TypeScript code and usage examples.
