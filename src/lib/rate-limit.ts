/**
 * Fallback rate limiter for when Upstash is not configured or available.
 * This ensures the application can still build and run in restricted environments.
 */

interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

export const rateLimit = {
  limit: async (key: string): Promise<RateLimitResult> => {
    // In dev or CI without Upstash, always allow
    return {
      success: true,
      limit: 10,
      remaining: 9,
      reset: Date.now() + 10000
    }
  }
}

export default rateLimit
