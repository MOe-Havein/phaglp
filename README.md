# FreshNextJS - A Next.js 15 Boilerplate

FreshNextJS is a modern, feature-rich boilerplate for Next.js 15 applications. It comes pre-configured with a secure authentication system, a role-based admin dashboard, a flexible theme system, and a complete database setup using Prisma and PostgreSQL.

This project is designed to be a solid foundation for building full-stack applications quickly, with a focus on best practices and developer experience. It also includes a unique set of prompts for Google's Gemini to facilitate AI-assisted code generation for new features.

## Features

- **Authentication:** Secure, cookie-based authentication (JWT, httpOnly) with login, logout, and session management.
- **Admin Dashboard:** A protected admin area with user management (CRUD), analytics widgets, and an audit log system.
- **Role-Based Access Control (RBAC):** Middleware to protect routes based on user roles (e.g., `admin`).
- **Database:** Prisma ORM setup for PostgreSQL, including models for Users, Roles, Posts, Comments, and more.
- **Database Seeding:** A script to seed the database with initial data, including an admin user.
- **Theming:** A theme system with 'light', 'dark', and 'system' modes, built with TailwindCSS and persisted in `localStorage`.
- **AI-Assisted Development:** A collection of pre-written prompts for Gemini Code Assist to quickly scaffold new features.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Authentication:** JWT, bcrypt

## Project Structure

A brief overview of the key directories in the project.

```
/
├── app/                # Next.js App Router pages and API routes
│   ├── api/            # API endpoints (e.g., /api/auth, /api/admin)
│   └── (main)/         # Main application routes
├── prisma/             # Prisma schema, migrations, and seed script
├── src/                # Source files
│   ├── components/     # Reusable React components
│   ├── context/        # React Context providers (AuthContext, AdminContext)
│   ├── lib/            # Helper functions, database client
│   └── middleware.ts   # Next.js middleware for route protection
├── docs/               # Documentation and Gemini prompts
└── .env.example        # Example environment variables
```

## Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

- Node.js (v18 or later)
- npm, yarn, or pnpm
- Docker (for running PostgreSQL) or a local PostgreSQL instance

### 1. Clone the Repository

```bash
git clone <repository-url>
cd freshnextjs
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Copy the example environment file and fill in the required values for your database and JWT secret.

```bash
cp .env.example .env
```

Your `.env` file should look like this:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mydatabase?schema=public"

# Authentication
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"
```

### 4. Set Up the Database

The easiest way to run PostgreSQL is with Docker.

```bash
# Start a PostgreSQL container
docker run --name my-postgres -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d postgres

# Update your DATABASE_URL in .env to:
# DATABASE_URL="postgresql://postgres:mysecretpassword@localhost:5432/postgres?schema=public"
```

Once your database is running and the `.env` file is configured, apply the migrations and seed the database.

```bash
npx prisma migrate dev
npx prisma db seed
```

This will create the database schema and populate it with an admin user.

### 5. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Usage

- **Admin User:** The database seed script creates a default admin user.
  - **Email:** `admin@example.com`
  - **Password:** `password123`
- Navigate to `/login` to sign in.
- Once logged in as an admin, you can access the Admin Dashboard at `/admin`.
- Use the theme toggle in the UI to switch between light and dark modes.
