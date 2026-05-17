import { PrismaClient } from "@prisma/client"

// Prevents multiple instances of Prisma Client from being created in development
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    datasources: {
      db: { url: process.env.DATABASE_URL },
    },
  })
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton> | undefined
} & typeof global

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma
}

/**
 * Safely serializes data from Prisma to be passed from Server to Client Components.
 * Converts Dates to ISO strings and resolves standard JSON serialization limits.
 */
export function serializePrisma<T>(data: T): T {
  if (!data) return data
  return JSON.parse(JSON.stringify(data))
}

/**
 * Standardized database query wrapper for error safety and serializability.
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
    if (process.env.NODE_ENV === "development") {
      console.error("[Database Error]:", error)
    }
    return {
      success: false,
      data: fallbackValue,
      error: message,
    }
  }
}
