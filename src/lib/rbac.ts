import { auth } from "@/auth";
import { Role } from "@prisma/client";

/**
 * Checks if the current authenticated user has the required role.
 * If the user does not have the role, throws an error or returns false.
 */
export async function requireRole(allowedRoles: Role[]): Promise<boolean> {
  const session = await auth();

  if (!session?.user?.role) {
    return false;
  }

  return allowedRoles.includes(session.user.role as Role);
}

/**
 * Ensures the user is an ADMIN.
 */
export async function requireAdmin(): Promise<boolean> {
  return requireRole([Role.ADMIN]);
}
