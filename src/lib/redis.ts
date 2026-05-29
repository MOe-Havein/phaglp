import { Redis } from '@upstash/redis';

// Determine if Redis is configured
const hasRedisConfig = !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;

// Initialize the real Redis client if configured
const upstashRedis = hasRedisConfig ? Redis.fromEnv() : null;

/**
 * A safe wrapper around Redis that provides a graceful fallback if Redis is unavailable or unconfigured.
 */
export const redis = {
  async get<T>(key: string): Promise<T | null> {
    if (!upstashRedis) return null;
    try {
      return await upstashRedis.get<T>(key);
    } catch (error) {
      console.warn(`Redis GET failed for key "${key}":`, error);
      return null; // Graceful fallback
    }
  },

  async set(key: string, value: any, options?: { ex?: number }): Promise<string | null> {
    if (!upstashRedis) return null;
    try {
      if (options?.ex) {
        return await upstashRedis.set(key, value, { ex: options.ex });
      }
      return await upstashRedis.set(key, value);
    } catch (error) {
      console.warn(`Redis SET failed for key "${key}":`, error);
      return null;
    }
  },

  async del(key: string): Promise<number | null> {
    if (!upstashRedis) return null;
    try {
      return await upstashRedis.del(key);
    } catch (error) {
      console.warn(`Redis DEL failed for key "${key}":`, error);
      return null;
    }
  }
};
