# ==========================================
# Consolidated Multi-Stage Dockerfile
# Supports both development and production builds
# ==========================================

ARG NODE_VERSION=22

# ==========================================
# Stage: base - Common configuration
# ==========================================
FROM node:${NODE_VERSION}-slim AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Enable pnpm via corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

# ==========================================
# Stage: deps - Install dependencies
# ==========================================
FROM base AS deps
COPY package.json pnpm-lock.yaml* .npmrc* ./
COPY prisma ./prisma

# Install all dependencies (dev + prod) with cache mount for faster rebuilds
# Use --no-optional to reduce installation size and memory usage
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --no-frozen-lockfile --ignore-scripts --no-optional

# Generate Prisma client and run necessary post-install scripts
# Run separately to reduce memory pressure
RUN pnpm prisma generate
RUN pnpm rebuild sharp --verbose || echo "Sharp rebuild failed, continuing..."

# ==========================================
# Stage: builder - Build application
# ==========================================
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build arguments for Next.js public environment variables
ARG NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY

ENV NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=$NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV CLOUDINARY_URL="cloudinary://build_placeholder:build_placeholder@phaglp"

# Memory limits for build process - optimized for low-memory environments
ENV NODE_OPTIONS="--max-old-space-size=1024"
ENV NEXT_DISABLE_SOURCEMAPS=1
ENV NEXT_TELEMETRY_DISABLED=1

# Build with cache mount for Next.js build cache
# Reduced memory limit to prevent OOM on constrained systems
RUN --mount=type=cache,target=/app/.next/cache \
    pnpm build

# ==========================================
# Stage: runner - Production runtime
# ==========================================
FROM node:${NODE_VERSION}-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Install only ca-certificates for TLS, then clean up
RUN apt-get update && \
    apt-get install -y --no-install-recommends ca-certificates && \
    rm -rf /var/lib/apt/lists/* && \
    groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 -g nodejs nextjs && \
    mkdir -p /data /app/public/uploads /app/.next && \
    chown -R nextjs:nodejs /data /app

# Copy only production artifacts
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/scripts ./scripts

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]

# ==========================================
# Stage: dev - Development runtime
# ==========================================
FROM base AS dev

# Copy dependency manifests
COPY package.json pnpm-lock.yaml* ./

# Install dependencies with cache mount
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --prefer-offline --no-frozen-lockfile --ignore-scripts

# Copy application code
COPY . .

# Generate Prisma client and rebuild native modules
RUN pnpm prisma generate && \
    pnpm rebuild sharp --verbose

# Configure Next.js for hot reload in Docker
ENV WATCHPACK_POLLING=true
ENV HOSTNAME="0.0.0.0"

# Run as non-root user
RUN chown -R node:node /app
USER node

EXPOSE 3000

CMD ["pnpm", "dev"]
