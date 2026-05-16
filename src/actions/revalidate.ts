"use server"

import { revalidateTag } from "next/cache"
import { logger } from "@/lib/server/logger"

export async function revalidateSiteSettings(hostname?: string) {
  try {
    logger.info("Revalidating site settings", { hostname })
    revalidateTag("site-settings")
    if (hostname) {
      revalidateTag(`site-settings-${hostname}`)
    }
    return { success: true }
  } catch (error: any) {
    logger.error("Revalidation failed", error)
    return { success: false, error: error.message || "Failed to revalidate" }
  }
}
