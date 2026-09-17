// Prisma client with embedded replica support
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

const prismaClientSingleton = () => {
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

  let client: PrismaClient;

  if (tursoUrl && tursoAuthToken) {
    // Remote Turso connection (production/Vercel)
    console.log(`[Prisma Initializer] ⚡ Connecting to Turso remote database`);

    const libsqlClient = createClient({
      url: tursoUrl,
      authToken: tursoAuthToken,
    });

    const adapter = new PrismaLibSql(libsqlClient);

    client = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
      adapter,
    });
  } else {
    // Local SQLite fallback for development
    const localDbPath = "file:./dev.db";
    console.log(`[Prisma Initializer] 📁 Using local SQLite database: ${localDbPath}`);

    const libsqlClient = createClient({
      url: localDbPath,
    });

    const adapter = new PrismaLibSql(libsqlClient);

    client = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
      adapter,
    });
  }

  // Your existing dynamic fail-safe network resilience Proxy block continues below unchanged...
  return new Proxy(client, {
    get(target, prop) {
      if (typeof prop === "string" && !prop.startsWith("$") && prop !== "then") {
        return new Proxy(Reflect.get(target, prop) || {}, {
          get(modelTarget, modelProp) {
            const originalMethod = Reflect.get(modelTarget, modelProp);
            if (typeof originalMethod === "function") {
              return async (...args: any[]) => {
                try {
                  return await originalMethod.apply(modelTarget, args);
                } catch (err: any) {
                  const errStr = String(err);
                  if (
                    errStr.includes("Can't reach database server") ||
                    errStr.includes("DATABASE_URL") ||
                    errStr.includes("connect") ||
                    errStr.includes("initialization") ||
                    errStr.includes("Unable to open the database file") // 🛡️ Proxy capture extension
                  ) {
                    console.warn(
                      `[Prisma Proxy] Database connection failure. Mocking prisma.${prop}.${String(modelProp)}`,
                    );
                    if (String(modelProp).startsWith("findMany")) return [];
                    if (String(modelProp).startsWith("findFirst") || String(modelProp).startsWith("findUnique")) return null;
                    if (String(modelProp).startsWith("count")) return 0;
                    if (
                      String(modelProp).startsWith("create") ||
                      String(modelProp).startsWith("update") ||
                      String(modelProp).startsWith("delete") ||
                      String(modelProp).startsWith("upsert")
                    ) {
                      return {};
                    }
                    return null;
                  }
                  throw err;
                }
              };
            }
            return originalMethod;
          },
        });
      }
      return Reflect.get(target, prop);
    },
  });
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton> | undefined;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}

export function serializePrisma<T>(data: T): T {
  if (!data) return data;
  return JSON.parse(JSON.stringify(data));
}

export async function safeDbQuery<T>(
  queryFn: () => Promise<T>,
  fallbackValue: T | null = null,
): Promise<{ success: boolean; data: T | null; error: string | null }> {
  try {
    const result = await queryFn();
    return {
      success: true,
      data: serializePrisma(result),
      error: null,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unexpected database error occurred";
    if (process.env.NODE_ENV === "development") {
      console.error("[Database Error]:", error);
    }
    return {
      success: false,
      data: fallbackValue,
      error: message,
    };
  }
}
