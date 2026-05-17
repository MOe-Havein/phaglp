import { getSession, JWTPayload } from "../auth/index"

/**
 * Standard role mapping check.
 */
export function hasRole(userRole: string, allowedRoles: string[]): boolean {
  return allowedRoles.includes(userRole)
}

/**
 * Helper to check if a role is ADMIN.
 */
export function isAdmin(userRole: string): boolean {
  return userRole === "ADMIN"
}

/**
 * Helper to check if a role is INSTRUCTOR.
 */
export function isInstructor(userRole: string): boolean {
  return userRole === "INSTRUCTOR"
}

/**
 * Require a specific role on Server Components or API Routes.
 * Throws an error if authentication fails or role requirements are not met.
 */
export async function requireRole(allowedRoles: string[]): Promise<JWTPayload> {
  const session = await getSession()
  if (!session) {
    throw new Error("UNAUTHENTICATED")
  }
  if (!hasRole(session.role, allowedRoles)) {
    throw new Error("UNAUTHORIZED")
  }
  return session
}

/**
 * Securely asserts that the current session belongs to an ADMIN user.
 */
export async function requireAdmin(): Promise<JWTPayload> {
  return requireRole(["ADMIN"])
}

/**
 * Securely asserts that the current session belongs to an INSTRUCTOR or ADMIN.
 */
export async function requireInstructor(): Promise<JWTPayload> {
  return requireRole(["INSTRUCTOR", "ADMIN"])
}
