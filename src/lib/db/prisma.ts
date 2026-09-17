// Prisma client with embedded replica support
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

const prismaClientSingleton = () => {
  const isProd = process.env.NODE_ENV === "production";
  
  // 📁 FIX 1: Establish environment-aware local replication disk destinations
  const localReplicaPath = isProd ? "file:/data/prod.db" : "file:./dev.db";
  
  // 🌍 FIX 2: Check for Turso live cloud variables explicitly
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const isRemote = !!tursoUrl;

  let client: PrismaClient;

  if (isRemote) {
    console.log(`[Prisma Initializer] ⚡ Initializing Turso Embedded Replica client via: ${localReplicaPath}`);
    
    // ⚙️ FIX 3: Initialize libSQL client engine with Embedded Replica mapping capabilities
    const libsqlClient = createClient({
      url: localReplicaPath,                     // Writes locally onto your mounted Docker volume
      syncUrl: tursoUrl,                         // Reads cloud state mutations from Turso
      authToken: process.env.TURSO_AUTH_TOKEN,
    });

    // Handle initial synchronous check seamlessly when building layout states
    if (typeof window === 'undefined') {
      libsqlClient.sync()
        .then(() => console.log("[Turso Sync] Initial boot migration synchronization loop complete."))
        .catch((err) => console.error("[Turso Sync Error] Initial baseline sync loop failed:", err));
    }

    const adapter = new PrismaLibSql(libsqlClient);
    
    client = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
      adapter,
    });
  } else {
    // Local SQLite fallback mode execution pathway if no Turso variables exist
    console.log(`[Prisma Initializer] 📁 Initializing standalone local SQLite client via: ${localReplicaPath}`);
    client = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
      datasources: {
        db: { url: localReplicaPath },
      },
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
