# Database Context

This file summarizes the active Prisma schema and intended data ownership rules for the PHAGLP project.

## Source of Truth

- `prisma/schema.prisma`

## Data Models

- `User` with role-based access and extended personal profile fields
- `Session` for NextAuth session tracking
- `Course`, `CourseModule`, `Lesson` for curriculum
- `Enrollment` for course access
- `Lecture`, `LectureRevision`, `Post`, `Comment` for content
- `Page`, `PageRevision`, `Tag` for CMS pages
- `SiteSettings` for global SEO and branding
- `FeatureFlag` for local flag storage
- `ChatMessage`, `KnowledgeBase`, `Analytics` for AI and telemetry
- `AcademyAsset`, `AssetAllocation` for inventory management
- `Certificate`, `AssetAllocation` for completion and asset tracking
- Enums: `Role`, `SubscriptionTier`, `MessageRole`, `Sex`, `IncomeLevel`, `WorldTier`, `IQLevel`, `EducationLevel`, `CourseType`, `AssetCategory`, `AssetCondition`, `AssetStatus`

## Usage Notes

- Follow Prisma relation rules; avoid circular deletes.
- Add indexes for filtered lookups used by admin dashboards.
- Seed data for local development only; do not seed production secrets.
