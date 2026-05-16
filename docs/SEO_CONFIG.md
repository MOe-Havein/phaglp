# Module: Website SEO & Branding Config

Refactored the `/admin/settings` page to allow admins to configure global Website SEO and Branding settings.

## Requirements

- **Prisma Model**: `SiteSettings` stores site identity, SEO metadata, and appearance settings.
- **API**: `app/api/admin/settings/route.ts` (GET for public, POST for admin-only updates).
- **Validation**: `react-hook-form` + `zod` for robust data integrity.

## Features

- **SEO**: Manage meta titles, descriptions, and OpenGraph images.
- **Branding**: Update logo URLs, favicons, and primary theme colors.
- **Maintenance Mode**: Toggle global site accessibility.
- **Dynamic Metadata**: Integrated via `src/lib/seo.ts` into the root layout.
