import "server-only"
import { logger } from "./logger"

// Define a minimal interface for our Cache logic to rely on
// Updated to be more compatible with ioredis set signature
export interface CacheInterface {
  get(key: string): Promise<string | null>
  set(key: string, value: string | number, mode?: string, duration?: number | string): Promise<any>
  del(key: string): Promise<number>
  ping(): Promise<string>
}

// In-memory fallback for Edge or Missing Redis
class MemoryCache implements CacheInterface {
  private store = new Map<string, { value: string; expiry: number | null }>()

  constructor() {
    // Periodically clean up expired keys (every 5 minutes)
    setInterval(
      () => {
        const now = Date.now()
        for (const [key, item] of this.store.entries()) {
          if (item.expiry && now > item.expiry) {
            this.store.delete(key)
          }
        }
      },
      5 * 60 * 1000,
    ).unref() // Use unref() to prevent keeping the process alive
  }

  async get(key: string): Promise<string | null> {
    const item = this.store.get(key)
    if (!item) return null
    if (item.expiry && Date.now() > item.expiry) {
      this.store.delete(key)
      return null
    }
    return item.value
  }

  async set(
    key: string,
    value: string | number,
    mode?: string,
    duration?: number | string,
  ): Promise<"OK" | null> {
    let expiry: number | null = null
    const valStr = String(value)
    if (mode === "EX" && typeof duration === "number") {
      expiry = Date.now() + duration * 1000
    }
    this.store.set(key, { value: valStr, expiry })
    return "OK"
  }

  async del(key: string): Promise<number> {
    return this.store.delete(key) ? 1 : 0
  }

  async ping(): Promise<string> {
    return "PONG"
  }
}

let redisInstance: CacheInterface | null = null

// Lazy initialization logic
async function getRedisClient(): Promise<CacheInterface> {
  if (redisInstance) return redisInstance

  const isEdge = process.env.NEXT_RUNTIME === "edge"
  const redisUrl = process.env.REDIS_URL

  if (isEdge || !redisUrl) {
    logger.info("Initializing MemoryCache fallback (Edge runtime or no REDIS_URL)")
    redisInstance = new MemoryCache()
    return redisInstance
  }

  try {
    // Use WHATWG URL API to avoid url.parse deprecation warning and validate URL
    const parsedUrl = new URL(redisUrl)
    
    // Dynamic import to prevent bundler trying to resolve 'net'/'dns' in Edge/Client bundles
    const Redis = (await import("ioredis" as any)).default
    const client = new Redis({
      host: parsedUrl.hostname,
      port: parseInt(parsedUrl.port) || 6379,
      password: parsedUrl.password ? decodeURIComponent(parsedUrl.password) : undefined,
      username: parsedUrl.username ? decodeURIComponent(parsedUrl.username) : undefined,
      db: parsedUrl.pathname ? parseInt(parsedUrl.pathname.substring(1)) || 0 : 0,
      tls: parsedUrl.protocol === "rediss:" ? {
        rejectUnauthorized: false
      } : undefined,
      maxRetriesPerRequest: 3,
      retryStrategy: (_times: number) => Math.min(_times * 50, 2000),
    })

    client.on("error", (_err: Error) => {
      logger.error("Redis Connection Error", _err)
    })

    redisInstance = client as unknown as CacheInterface
    return redisInstance
  } catch (error) {
    logger.error("Failed to initialize ioredis, falling back to memory", error)
    redisInstance = new MemoryCache()
    return redisInstance
  }
}

// Export singleton promise or accessors
export const redis = {
  get: async (key: string) => (await getRedisClient()).get(key),
  set: async (key: string, value: string, seconds?: number) => {
    const client = await getRedisClient()
    if (seconds) {
      // Use the signature supported by both ioredis and MemoryCache
      return client.set(key, value, "EX", seconds)
    }
    return client.set(key, value)
  },
  del: async (key: string) => (await getRedisClient()).del(key),
  ping: async () => (await getRedisClient()).ping(),
}
