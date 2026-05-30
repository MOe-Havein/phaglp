import { PrismaClient } from "@prisma/client"
import { PrismaLibSql } from "@prisma/adapter-libsql"

// Prevents multiple instances of Prisma Client from being created in development
const prismaClientSingleton = () => {
  const url = process.env.DATABASE_URL || "file:./dev.db"
  const isRemote = url.startsWith("libsql://") || url.startsWith("http://") || url.startsWith("https://")

  let client: PrismaClient

  if (isRemote) {
    const config: { url: string; authToken?: string } = { url }
    if (process.env.TURSO_AUTH_TOKEN) {
      config.authToken = process.env.TURSO_AUTH_TOKEN
    }
    const adapter = new PrismaLibSql(config)
    client = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
      adapter,
    })
  } else {
    client = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
      datasources: {
        db: { url },
      },
    })
  }

  return new Proxy(client, {
    get(target, prop) {
      if (typeof prop === "string" && !prop.startsWith("$") && prop !== "then") {
        return new Proxy(Reflect.get(target, prop) || {}, {
          get(modelTarget, modelProp) {
            const originalMethod = Reflect.get(modelTarget, modelProp)
            if (typeof originalMethod === "function") {
              return async (...args: any[]) => {
                try {
                  return await originalMethod.apply(modelTarget, args)
                } catch (err: any) {
                  const errStr = String(err)
                  if (
                    errStr.includes("Can't reach database server") ||
                    errStr.includes("DATABASE_URL") ||
                    errStr.includes("connect") ||
                    errStr.includes("initialization")
                  ) {
                    console.warn(
                      `[Prisma Proxy] Database unreachable. Mocking prisma.${prop}.${String(modelProp)}`,
                    )
                    if (String(modelProp).startsWith("findMany")) {
                      return []
                    }
                    if (
                      String(modelProp).startsWith("findFirst") ||
                      String(modelProp).startsWith("findUnique")
                    ) {
                      return null
                    }
                    if (String(modelProp).startsWith("count")) {
                      return 0
                    }
                    if (
                      String(modelProp).startsWith("create") ||
                      String(modelProp).startsWith("update") ||
                      String(modelProp).startsWith("delete") ||
                      String(modelProp).startsWith("upsert")
                    ) {
                      return {}
                    }
                    return null
                  }
                  throw err
                }
              }
            }
            return originalMethod
          },
        })
      }
      return Reflect.get(target, prop)
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
