import { PrismaClient } from "@prisma/client"

// PrismaClient is attached to the `globalThis` object in development to prevent
// exhausting your database connection limit.
//
// Learn more:
// https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-with-database-connection-limit-and-nextjs

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
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
