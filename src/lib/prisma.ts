import { PrismaClient } from "@prisma/client"

// Guard: fail fast if DATABASE_URL is not set at runtime.
// This surfaces the real problem immediately instead of a cryptic connection error.
if (!process.env.DATABASE_URL) {
  throw new Error(
    "[Prisma] DATABASE_URL environment variable is not set. " +
      "Ensure it is provided via docker-compose `environment:` or your hosting platform."
  )
}

// PrismaClient is attached to `globalThis` in development to prevent exhausting
// database connections during hot-reload. In production each process has one instance.
// https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-with-database-connection-limit-and-nextjs

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    // Explicitly pass the URL so Prisma never reads a stale or baked-in value.
    datasources: {
      db: { url: process.env.DATABASE_URL },
    },
  })
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}

/**
 * Safely serializes data from Prisma to be passed from Server to Client Components.
 * Removes non-serializable objects like Dates (converts to string) and ensures
 * class instances are converted to plain objects.
 */
export function serializePrisma<T>(data: T): T {
  if (!data) return data
  return JSON.parse(JSON.stringify(data))
}

/**
 * Executes a database operation with a standardized try/catch block.
 * Ensures that even in case of a crash or outage, the build process can continue
 * and runtime errors are captured safely without leaking non-serializable ErrorEvents.
 */
export async function safeDbQuery<T>(
  queryFn: () => Promise<T>,
  fallbackValue: any = null,
): Promise<{ success: boolean; data: T | null; error: string | null }> {
  try {
    const result = await queryFn()
    return {
      success: true,
      data: serializePrisma(result),
      error: null,
    }
  } catch (error: any) {
    console.error("[Database Error]:", error)

    // Return serializable error message
    return {
      success: false,
      data: fallbackValue,
      error: error instanceof Error ? error.message : "An unexpected database error occurred",
    }
  }
}

export default prisma
