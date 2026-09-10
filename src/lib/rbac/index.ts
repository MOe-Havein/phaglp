import { auth } from "@/auth";

/**
 * Standard role mapping check.
 */
export function hasRole(userRole: string, allowedRoles: string[]): boolean {
  return allowedRoles.includes(userRole);
}

/**
 * Helper to check if a role is ADMIN.
 */
export function isAdmin(userRole: string): boolean {
  return userRole === "ADMIN";
}

/**
 * Helper to check if a role is INSTRUCTOR.
 */
export function isInstructor(userRole: string): boolean {
  return userRole === "INSTRUCTOR";
}

/**
 * Require a specific role on Server Components or API Routes.
 * Throws an error if authentication fails or role requirements are not met.
 */
export async function requireRole(allowedRoles: string[]) {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("UNAUTHENTICATED");
  }
  if (!hasRole(session.user.role || "", allowedRoles)) {
    throw new Error("UNAUTHORIZED");
  }
  return {
    userId: session.user.id,
    email: session.user.email,
    role: session.user.role,
  };
}

/**
 * Securely asserts that the current session belongs to an ADMIN user.
 */
export async function requireAdmin() {
  return requireRole(["ADMIN"]);
}

/**
 * Securely asserts that the current session belongs to an INSTRUCTOR or ADMIN.
 */
export async function requireInstructor() {
  return requireRole(["INSTRUCTOR", "ADMIN"]);
}
