# Docker Setup Guide

## Overview

This project uses a consolidated multi-stage Dockerfile that supports both development and production environments. This approach reduces duplication, improves maintainability, and optimizes image size.

## Architecture

The Dockerfile contains the following stages:

1. **base** - Common Node.js configuration with pnpm enabled
2. **deps** - Dependency installation with BuildKit cache mounts
3. **builder** - Application build stage
4. **runner** - Production runtime (optimized, minimal image)
5. **dev** - Development runtime (with hot reload support)

## Quick Start

### Production Build

```bash
# Build production image
docker build --target runner -t phaglp-app:latest .

# Run production container
docker run -p 3000:3000 --env-file .env phaglp-app:latest
```

### Development Build

```bash
# Build development image
docker build --target dev -t phaglp-app:dev .

# Run development container with volume mounts
docker run -p 3000:3000 -v $(pwd):/app -v /app/node_modules --env-file .env phaglp-app:dev
```

### Using Docker Compose

```bash
# Production
docker-compose up app

# Development
docker-compose up app-dev
```

## Build Arguments

The following build arguments are supported:

- `NODE_VERSION` - Node.js version (default: 22)
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key

Example:

```bash
docker build \
  --target runner \
  --build-arg NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=mycloud \
  --build-arg NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co \
  -t phaglp-app:latest \
  .
```

## Environment Variables

### Required for Production

- `DATABASE_URL` - PostgreSQL connection string
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key

### Optional

- `LOCAL_APP_PORT` - Host port for production app (default: 3000)
- `LOCAL_DEV_PORT` - Host port for development app (default: 3001)
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` - Cloudinary configuration

## Optimization Features

### Multi-Stage Build Benefits

1. **Reduced Image Size**: Production image only contains runtime dependencies and built artifacts
2. **Build Cache**: BuildKit cache mounts for pnpm store and Next.js build cache
3. **Security**: Non-root user (nextjs:nodejs) for production runtime
4. **Layer Optimization**: Dependencies installed before application code for better caching

### Development Features

- Hot module reload with `WATCHPACK_POLLING`
- Volume mounts for live code updates
- Full development dependencies available
- Non-root user (node) for better file permissions

## Troubleshooting

### Build Issues

#### Memory Issues

If you encounter memory issues during build, try these approaches:

**Option 1: Limit Docker memory and use swap**
```bash
# Build with memory limit and swap (recommended for systems with <4GB RAM)
docker build --target runner --memory=2g --memory-swap=4g -t phaglp-app:latest .
```

**Option 2: Use docker-compose with resource limits**
```bash
# Add to docker-compose.yml under the service:
deploy:
  resources:
    limits:
      memory: 2G
    reservations:
      memory: 1G
```

**Option 3: Build on host and copy artifacts**
```bash
# Build Next.js on host (requires Node.js 22 and pnpm)
pnpm install
pnpm build

# Then build a minimal Docker image that just copies the artifacts
docker build --target runner -t phaglp-app:latest .
```

**Option 4: Close memory-intensive applications**
Before building, close browsers, IDEs, and other applications to free up RAM.

### Permission Issues in Development

The development container runs as the `node` user. If you encounter permission issues with volumes:

```bash
chown -R 1000:1000 node_modules .next
```

### Cache Issues

To rebuild without cache:

```bash
docker build --no-cache --target runner -t phaglp-app:latest .
```

## Image Size Comparison

The multi-stage build significantly reduces the final production image size by:

- Excluding development dependencies
- Excluding build tools and intermediate artifacts
- Using Next.js standalone output mode
- Starting from a clean slim base image

Expected production image size: ~500-800MB (vs 1.5GB+ without optimization)
