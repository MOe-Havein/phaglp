import "server-only"
import { unstable_cache } from "next/cache"
import { logger } from "./logger"

type CacheOptions = {
  tags?: string[]
  revalidate?: number
}

/**
 * Enterprise wrapper around unstable_cache.
 * Enforces types, standardized logging, and cleaner tagging strategy.
 */
export async function cached<T>(
  key: string,
  fn: () => Promise<T>,
  options: CacheOptions = { revalidate: 3600 },
): Promise<T> {
  const { tags = [], revalidate } = options
  const cacheKey = [key, ...tags]

  // We wrap the function to log execution (optional, good for debugging cache misses)
  const wrappedFn = async () => {
    logger.debug(`Cache MISS: Revalidating ${key}`, { tags })
    return fn()
  }

  return unstable_cache(wrappedFn, cacheKey, {
    tags,
    revalidate,
  } as any)()
}
