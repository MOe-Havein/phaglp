/**
 * Shared Redis proxy to ensure compatibility across client/server boundaries
 * and provide a single source of truth for caching logic.
 */
import { redis as serverRedis } from "./server/redis"

export const getCachedData = async <T>(
  key: string,
  fetcher?: () => Promise<T | null>,
  expireSeconds: number = 3600,
): Promise<T | null> => {
  try {
    const data = await serverRedis.get(key)
    if (data) {
      return JSON.parse(data) as T
    }

    if (fetcher) {
      const freshData = await fetcher()
      if (freshData) {
        await setCachedData(key, freshData, expireSeconds)
      }
      return freshData
    }

    return null
  } catch (error) {
    console.error(`[Redis] Error getting key ${key}:`, error)
    // If cache fails, try to get fresh data as fallback
    if (fetcher) return fetcher()
    return null
  }
}

export const setCachedData = async (
  key: string,
  data: any,
  expireSeconds: number = 3600,
): Promise<boolean> => {
  try {
    const serialized = JSON.stringify(data)
    await serverRedis.set(key, serialized, expireSeconds)
    return true
  } catch (error) {
    console.error(`[Redis] Error setting key ${key}:`, error)
    return false
  }
}

export const ping = async () => {
  return serverRedis.ping()
}

export default serverRedis
