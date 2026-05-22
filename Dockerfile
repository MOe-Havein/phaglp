# ==========================================
# Stage 1: Dependencies Base
# ==========================================
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

ENV PNPM_CONFIG_MINIMUM_RELEASE_AGE=0
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy lockfiles and manifests
COPY package.json pnpm-lock.yaml* package-lock.json* ./
COPY prisma ./prisma

# Clean Fix: Removed cache mount to force a fresh download of dompurify types
RUN if [ -f pnpm-lock.yaml ]; then pnpm i --config.minimum-release-age=0 --dangerously-allow-all-builds; \
    elif [ -f package-lock.json ]; then pnpm import && pnpm i --config.minimum-release-age=0 --dangerously-allow-all-builds; \
    else pnpm i --config.minimum-release-age=0 --dangerously-allow-all-builds; \
    fi

# ==========================================
# Stage 2: Builder
# ==========================================
FROM node:22-alpine AS builder
WORKDIR /app

ENV PNPM_CONFIG_MINIMUM_RELEASE_AGE=0
RUN corepack enable && corepack prepare pnpm@latest --activate

# Bring over node_modules and setup configurations
COPY --from=deps /app/node_modules ./node_modules
COPY package.json pnpm-lock.yaml* package-lock.json* ./
COPY prisma ./prisma

ARG DATABASE_URL="postgresql://build-placeholder:build-placeholder@localhost:5432/build_db"
ENV DATABASE_URL=${DATABASE_URL}

# Cache layer for Prisma binary engines
RUN --mount=type=cache,target=/root/.cache/prisma \
    pnpm exec prisma generate

# Pull in all actual source files for compilation
COPY . .

ARG NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
ENV NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=$NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Clean Fix: Restored the actual Next.js build command without the cache mount
RUN NODE_OPTIONS="--max-old-space-size=4096" CPUS=2 pnpm run build

# ==========================================
# Stage 3: Runner
# ==========================================
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Consolidate user creation and directory preparation into a single runtime layer
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    mkdir -p .next/cache && \
    chown nextjs:nodejs .next/cache

# 1. Copy standalone production output bundle (automatically strips devDependencies)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

# 2. Copy static and public assets
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/scripts/migrate.mjs ./scripts/migrate.mjs

# Optimization: Added @prisma/config alongside prisma and effect globally to ensure standalone runtimes don't miss dependencies
RUN npm install -g prisma@6.19.2 effect @prisma/config

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (res) => { if (res.statusCode === 200) process.exit(0); else process.exit(1); })"

CMD ["node", "server.js"]
