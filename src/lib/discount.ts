import { IncomeLevel, WorldTier } from "@prisma/client"

/**
 * Compute a course discount percentage based on the user's
 * financial status and world development tier.
 *
 * Rules:
 *   Income LOW    → 30 % base discount
 *   Income MEDIUM → 15 % base discount
 *   Income HIGH   →  0 % base discount
 *
 *   WorldTier THIRD  → +20 % additional
 *   WorldTier SECOND → +10 % additional
 *   WorldTier FIRST  →  +0 % additional
 *
 * Combined discount is capped at 50 %.
 */
export function computeDiscount(income?: IncomeLevel | null, world?: WorldTier | null): number {
  const baseDiscount = income === IncomeLevel.LOW ? 30 : income === IncomeLevel.MEDIUM ? 15 : 0

  const geoDiscount = world === WorldTier.THIRD ? 20 : world === WorldTier.SECOND ? 10 : 0

  return Math.min(baseDiscount + geoDiscount, 50)
}

/**
 * Apply a discount percentage to a price and return the discounted price.
 */
export function applyDiscount(price: number, discountPct: number): number {
  if (discountPct <= 0) return price
  return Math.round(price * (1 - discountPct / 100) * 100) / 100
}
