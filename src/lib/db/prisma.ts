import "server-only";
import { PrismaClient } from "@prisma/client";
import { env } from "@/env";

const prismaClientSingleton = () => {
  const remoteUrl = env.DATABASE_URL;
  const isRemote =
    typeof remoteUrl === "string" &&
    (remoteUrl.startsWith("libsql://") ||
      remoteUrl.startsWith("http://") ||
      remoteUrl.startsWith("https://"));

  if (
    isRemote &&
    typeof process !== "undefined" &&
    process.env.NEXT_RUNTIME === "nodejs" &&
    typeof process.env.TURSO_AUTH_TOKEN === "string"
  ) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { PrismaLibSql } = require("@prisma/adapter-libsql");
      const adapter = new PrismaLibSql({
        url: remoteUrl,
        authToken: process.env.TURSO_AUTH_TOKEN,
      });
      return new PrismaClient({
        log:
          env.NODE_ENV === "development"
            ? ["query", "error", "warn"]
            : ["error"],
        adapter,
      });
    } catch (error) {
      if (env.NODE_ENV !== "test") {
        console.warn(
          "[Prisma] Remote adapter unavailable, falling back to local DB:",
          error,
        );
      }
    }
  }

  return undefined as any;
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const prisma: PrismaClientSingleton = (() => {
  try {
    return globalForPrisma.prisma ?? prismaClientSingleton();
  } catch (error) {
    console.error("[Prisma initialization failed]", error);
    return undefined as any;
  }
})();

if (env.NODE_ENV !== "production" && prisma) {
  globalForPrisma.prisma = prisma;
}

export default prisma;

export function serializePrisma<T>(data: T): T {
  if (!data) return data;
  return JSON.parse(JSON.stringify(data));
}

export async function safeDbQuery<T>(
  queryFn: () => Promise<T>,
  fallbackValue: T | null = null,
): Promise<{ success: boolean; data: T | null; error: string | null }> {
  if (!prisma) {
    return { success: false, data: fallbackValue, error: "Prisma not initialized" };
  }
  try {
    const result = await queryFn();
    return { success: true, data: serializePrisma(result), error: null };
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "An unexpected database error occurred";
    if (env.NODE_ENV === "development") {
      console.error("[Database Error]:", error);
    }
    return { success: false, data: fallbackValue, error: message };
  }
}
