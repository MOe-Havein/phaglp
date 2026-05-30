import { PrismaClient } from "@prisma/client"
import { env } from "@/env"

// Ensure process.env.DATABASE_URL is used by Prisma correctly
// Prisma uses process.env.DATABASE_URL under the hood, but we can pass it explicitly.

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    datasources: {
      db: { url: env.DATABASE_URL },
    },
  })
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (env.NODE_ENV !== "production") {
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
  fallbackValue: T | null = null,
): Promise<{ success: boolean; data: T | null; error: string | null }> {
  try {
    const result = await queryFn()
    return {
      success: true,
      data: serializePrisma(result),
      error: null,
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unexpected database error occurred"
    if (env.NODE_ENV === "development") {
      console.error("[Database Error]:", error)
    }

    return {
      success: false,
      data: fallbackValue,
      error: message,
    }
  }
}

export default prisma
