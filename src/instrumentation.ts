export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    try {
      const { prisma } = await import("@/lib/prisma");
      const { logger } = await import("@/server/utils/logger.util");

      const handleShutdown = async (signal: string) => {
        logger.info(`${signal} received. Closing backend connections...`);
        try {
          await prisma.$disconnect();
          logger.info("Connections closed successfully.");
          process.exit(0);
        } catch (error) {
          logger.error("Error during graceful shutdown", error);
          process.exit(1);
        }
      };

      process.once("SIGTERM", () => handleShutdown("SIGTERM"));
      process.once("SIGINT", () => handleShutdown("SIGINT"));
      
    } catch (error) {
      // This will explicitly print the Zod/Validation error details in your terminal
      console.error("❌ Critical error during Next.js instrumentation setup:", error);
      process.exit(1); 
    }
  }
}
