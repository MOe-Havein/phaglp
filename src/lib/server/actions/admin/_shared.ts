"use server"

import { auth } from "@/auth"
import { Role } from "@prisma/client"

/**
 * Throws an Unauthorized error if the current session user is not an ADMIN.
 * Use at the top of every admin server action.
 */
export async function requireAdmin(): Promise<void> {
  const session = await auth()
  if (session?.user?.role !== Role.ADMIN) {
    throw new Error("Unauthorized: Admin access required")
  }
}
