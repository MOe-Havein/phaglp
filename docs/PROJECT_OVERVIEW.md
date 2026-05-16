# Project Overview: PHAGLP

PHAGLP (Philosophical Academy for Geniuses Life Planning) is a modern full-stack application designed for philosophical education, scientific research, and intentional marriage matching.

## 🚀 Features

- **Course Management**: Enroll in and manage philosophical and scientific courses
- **Lectures Page**: Explore philosophical lectures and insights
- **AI Assistant**: Generate outlines, summaries, and check for logical fallacies
- **Halal Marriage Matching**: Privacy-first, values-based matching system
- **Admin Dashboard**: Comprehensive CMS for managing content and users

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, TailwindCSS, Framer Motion
- **Backend**: Next.js App Router, Server Actions
- **Database**: PostgreSQL (Neon), Prisma ORM
- **Authentication**: NextAuth.js (v5)
- **AI Engine**: Cohere AI
- **Cache/Rate Limiting**: Upstash Redis

## 📋 Data Models

- **User**: Profile, role (USER, ADMIN, INSTRUCTOR)
- **Course**: Title, slug, description, instructor, price
- **Lecture**: Title, slug, tags[], body, author, category
- **MarriageProfile**: Personal details, values, preferences

## 🗺️ Navigation

- **Main Navigation**: Courses, Lectures, Marriage, About, Contact
- **User Dashboard**: Enrolled courses, saved lectures, marriage profile
- **Admin Dashboard**: Manage users, courses, lectures, settings

## 📂 Directory Structure

```
src/
├── app/                # App Router pages and API routes
│   ├── (admin)/        # Admin-only routes
│   ├── (public)/       # Public-facing routes
│   ├── api/            # API endpoints
│   └── lectures/       # Lectures blog (Legacy/Alternate)
├── components/         # React components
│   ├── admin/          # Admin-specific components
│   ├── cards/          # Reusable card components
│   ├── home/           # Home page sections
│   └── ui/             # Shadcn UI components
├── lib/                # Shared utilities and server actions
│   ├── server/         # Server-only logic
│   └── shared/         # Shared logic/types
└── types/              # TypeScript interfaces
```

## 🔐 Environment Variables

Ensure the following are set in your `.env` file:

- `DATABASE_URL`
- `AUTH_SECRET`
- `COHERE_API_KEY`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `CLOUDINARY_URL`
