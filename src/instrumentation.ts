import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/server/logger";

export async function register() {
  // Graceful Shutdown Handler
  if (process.env.NEXT_RUNTIME === "nodejs") {
    process.on("SIGTERM", async () => {
      logger.info("SIGTERM received. Closing backend connections...");

      try {
        await prisma?.$disconnect();
        logger.info("Connections closed successfully.");
      } catch (error) {
        logger.error("Error during graceful shutdown", error);
      }
      // Note: Do NOT call process.exit() here — Next.js handles its own shutdown sequence.
    });
  }
}
