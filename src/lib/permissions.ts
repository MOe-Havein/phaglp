import { SubscriptionTier } from "@prisma/client"

/**
 * Checks if a user's subscription tier grants access to Pro features.
 * (Pro and Enterprise tiers)
 */
export function canAccessProFeatures(tier?: SubscriptionTier | string): boolean {
  return tier === SubscriptionTier.PRO || tier === SubscriptionTier.ENTERPRISE
}

/**
 * Checks if a user's subscription tier grants access to Enterprise features.
 * (Enterprise tier only)
 */
export function canAccessEnterpriseFeatures(tier?: SubscriptionTier | string): boolean {
  return tier === SubscriptionTier.ENTERPRISE
}

/**
 * Helper to check access levels ordered by privilege (BASIC < PRO < ENTERPRISE).
 * Returns true if the user's tier is equal to or greater than the required tier.
 */
export function hasMinimumTier(
  userTier: SubscriptionTier | string | undefined,
  requiredTier: SubscriptionTier,
): boolean {
  if (!userTier) return false

  const levels = {
    [SubscriptionTier.BASIC]: 0,
    [SubscriptionTier.PRO]: 1,
    [SubscriptionTier.ENTERPRISE]: 2,
  }

  const userLevel = levels[userTier as SubscriptionTier] ?? -1
  const requiredLevel = levels[requiredTier]

  return userLevel >= requiredLevel
}
