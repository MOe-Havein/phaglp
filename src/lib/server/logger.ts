import "server-only"

export const logger = {
  info: (message: string, meta?: Record<string, any>) => {
    if (process.env.NODE_ENV !== "test") {
      console.log(JSON.stringify({ level: "info", message, ...meta }))
    }
  },
  error: (message: string, error?: any, meta?: Record<string, any>) => {
    if (process.env.NODE_ENV !== "test") {
      console.error(JSON.stringify({ level: "error", message, error, ...meta }))
    }
  },
  warn: (message: string, meta?: Record<string, any>) => {
    if (process.env.NODE_ENV !== "test") {
      console.warn(JSON.stringify({ level: "warn", message, ...meta }))
    }
  },
  debug: (message: string, meta?: Record<string, any>) => {
    if (process.env.NODE_ENV === "development") {
      console.debug(JSON.stringify({ level: "debug", message, ...meta }))
    }
  },
}
