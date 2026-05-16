import { NextRequest, NextResponse } from "next/server"
import { ApiError } from "../utils/errors.util"
import { logger } from "../utils/logger.util"

/**
 * Standardized API Response Wrapper
 */
export function withApiHandler(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const startTime = Date.now()
    try {
      const response = await handler(req)

      // Log successful requests in production-friendly format
      logger.info(`API Success: ${req.method} ${req.nextUrl.pathname}`, {
        duration: `${Date.now() - startTime}ms`,
        status: response.status,
      })

      return response
    } catch (error: any) {
      const statusCode = error instanceof ApiError ? error.statusCode : 500
      const message = error instanceof ApiError ? error.message : "Internal Server Error"

      logger.error(`API Error: ${req.method} ${req.nextUrl.pathname}`, error, {
        statusCode,
        duration: `${Date.now() - startTime}ms`,
      })

      return NextResponse.json(
        {
          success: false,
          error: message,
          // Hide stack trace in production
          stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
        },
        { status: statusCode },
      )
    }
  }
}
