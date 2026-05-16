import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import redis from "@/lib/redis"
import { withApiHandler } from "@/server/middlewares/api-handler"
import { logger } from "@/server/utils/logger.util"

export const dynamic = "force-dynamic"

export const GET = withApiHandler(async () => {
  // 1. Check Database
  const dbStart = Date.now()
  await prisma.$queryRaw`SELECT 1`
  const dbDuration = Date.now() - dbStart

  // 2. Check Redis
  const redisStart = Date.now()
  const redisStatus = redis ? await redis.ping() : "disconnected"
  const redisDuration = Date.now() - redisStart

  if (redisStatus !== "PONG") {
    logger.warn("Redis check failed or disconnected", { redisStatus })
  }

  return NextResponse.json({
    status: "healthy",
    checks: {
      database: {
        status: "connected",
        latency: `${dbDuration}ms`,
      },
      cache: {
        status: redisStatus === "PONG" ? "connected" : "disconnected",
        latency: redisStatus === "PONG" ? `${redisDuration}ms` : undefined,
      },
    },
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  })
})
