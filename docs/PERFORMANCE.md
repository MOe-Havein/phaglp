# Module: Performance & Caching

Implements multi-layer caching and streaming to ensure a high-performance experience.

## Redis Caching

- **Utility**: `src/lib/redis.ts` using `ioredis`.
- **Logic**: Caches site settings and expensive DB queries with automatic invalidation on updates.
- **Resilience**: Graceful fallback to database if Redis is unavailable.

## CI/CD Optimizations

- **Build Caching**: GitHub Actions now caches `pnpm` store and `.next/cache`.

## UI Streaming

- **loading.tsx**: Skeleton screens implemented for Homepage, Admin Dashboard, and Settings.
- **Benefit**: Immediate shell rendering while server-side data fetches complete.
