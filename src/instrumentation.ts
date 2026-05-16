import { prisma } from "@/lib/prisma"
import redis from "@/lib/redis"
import { logger } from "@/server/utils/logger.util"

export async function register() {
  // Graceful Shutdown Handler
  if (process.env.NEXT_RUNTIME === "nodejs") {
    process.on("SIGTERM", async () => {
      logger.info("SIGTERM received. Closing backend connections...")

      try {
        // Only attempt to quit if it's an actual Redis client (not MemoryCache)
        const redisQuit = (redis as any).quit ? (redis as any).quit() : Promise.resolve()
        await Promise.all([prisma.$disconnect(), redisQuit])
        logger.info("Connections closed successfully.")
        process.exit(0)
      } catch (error) {
        logger.error("Error during graceful shutdown", error)
        process.exit(1)
      }
    })
  }
}
