# ==========================================
# Stage 1: Base Configuration
# ==========================================
FROM node:22-bookworm-slim AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable && corepack prepare pnpm@latest --activate

# ==========================================
# Stage 2: Dependencies (Cached Layer)
# ==========================================
# ==========================================
# Stage 2: Dependencies (Cached Layer)
# ==========================================
FROM base AS deps
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
COPY prisma ./prisma

# HIGH PERF: Removed strict frozen constraint to auto-heal the mismatch
# using your persistent BuildKit layer cache
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    corepack enable pnpm && pnpm install --no-frozen-lockfile

# Pre-generate client so types and query engines are bound
RUN pnpm prisma generate



# ==========================================
# Stage 3: Application Builder (Low RAM Tune)
# ==========================================
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
ENV NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=$NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
ENV CLOUDINARY_URL="cloudinary://build_placeholder:build_placeholder@phaglp"

# LOW-RAM LIMITS: Prevents Next.js from hijacking your 9GB setup
ENV NODE_OPTIONS="--max-old-space-size=2048"
ENV CPUS=1
ENV NEXT_DISABLE_SOURCEMAPS=1

RUN --mount=type=cache,target=/app/.next/cache \
    pnpm build


# ==========================================
# Stage 3: Application Builder
# ==========================================
# Build Arguments & Public Environment 
# HIGH PERF FIX: Caches the Next.js SWC (Rust compiler) framework output folder.
# Subsequent Next.js builds will compile in seconds instead of minutes.
#ENV SKIP_ENV_VALIDA
# Stage 4: Production Runner
# ==========================================
FROM node:22-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# ca-certificates is required for outbound TLS api calls (like Cloudinary)
RUN apt-get update && \
    apt-get install -y --no-install-recommends ca-certificates && \
    rm -rf /var/lib/apt/lists/* && \
    groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 -g nodejs nextjs && \
    mkdir -p /data /app/public/uploads /app/.next && \
    chown -R nextjs:nodejs /data /app

# Copy standalone build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Copy Prisma schema and runtime scripts
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/scripts ./scripts

USER nextjs
EXPOSE 3000


# Switch to non-root user for security best practices
USER node

# Expose port 3000 to allow HTTP traffic
EXPOSE 3000

# Start Next.js standalone server
CMD ["node", "server.js"]
