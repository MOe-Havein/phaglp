# PHAGLP (Philosophical Academy for Geniuses Life Planning)

PHAGLP is a modern full-stack application designed for philosophical education, scientific research, and intentional marriage matching. Built with an elite, cutting-edge aesthetic and strict architectural standards, it serves as a robust platform for high-level intellectual pursuit.

## 🚀 Features

- **Course Management:** Enroll in and manage philosophical and scientific courses (GP Programs).
- **Lectures & Research:** Explore philosophical lectures, essays, and insights.
- **Halal Marriage Matching:** A privacy-first, values-based matching system and curriculum tailored to Islamic principles.
- **Admin Control Panel:** A comprehensive, role-based (RBAC) Content Management System for managing users, courses, lectures, and global site settings.
- **AI Integration:** Tools for generating outlines, summaries, and exploring interactive logical models.

## 🏛️ Architecture Summary

This platform is engineered using modern React and Node.js best practices, emphasizing performance, security, and type safety:

- **Framework:** Next.js 15 (App Router)
- **Language:** Strict TypeScript (100% Type Coverage)
- **Database:** PostgreSQL accessed via Prisma ORM
- **Authentication:** NextAuth.js (v5) providing secure, JWT httpOnly cookie-based sessions.
- **Data Validation:** Zod schema validation applied universally across Server Actions.
- **Caching Layer:** Upstash Redis with a resilient graceful fallback mechanism, supplementing Next.js `unstable_cache`.
- **Styling:** TailwindCSS with Framer Motion for micro-animations and seamless Dark Mode (`next-themes`).
- **Testing:** Playwright End-to-End (E2E) testing suite for critical flows (Auth, Enrollment, Marriage).

## 🗺️ Navigation Structure

- **Main User Navigation:** Courses, Lectures, About, Contact
- **User Dashboard:** Enrolled courses, saved lectures, AI interaction logs, and marriage profile management.
- **Admin Control:** Users, Pages, Courses, Navigation Menus, Contact Messages, Homepage Sections, and Lectures.

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+)
- pnpm (Recommended)
- PostgreSQL database
- Upstash Redis database (Optional but recommended)

### Setup

1. **Clone & Install**
   ```bash
   pnpm install
   ```

2. **Environment Variables**
   Copy `.env.example` to `.env` and fill in your details:
   ```env
   DATABASE_URL="postgresql://user:pass@localhost:5432/phaglp"
   AUTH_SECRET="your-generated-secret"
   UPSTASH_REDIS_REST_URL="your-upstash-url"
   UPSTASH_REDIS_REST_TOKEN="your-upstash-token"
   ```

3. **Database Migration & Seeding**
   ```bash
   pnpm prisma db push
   pnpm prisma db seed
   ```

4. **Run Development Server**
   ```bash
   pnpm dev
   ```
   The application will be available at `http://localhost:3000`.

## 🧪 Testing

Run the Playwright End-to-End test suite to verify core functionality:
```bash
pnpm exec playwright test
```

## 🔒 Security Posture

- **No Legacy Auth:** All outdated JWT manual systems have been purged in favor of official NextAuth.js.
- **Route Protection:** Both middleware-level and handler-level RBAC authorization are strictly enforced.
- **Atomic Transactions:** Multi-step database mutations are wrapped in `prisma.$transaction`.
- **N+1 Prevention:** Prisma relational data is prefetched using `include` blocks.
