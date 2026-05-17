import prisma from "@/lib/prisma"
import { cache } from "react"

export const getFeatureFlags = cache(async () => {
  try {
    const flags = await prisma.featureFlag.findMany()
    return flags.reduce(
      (acc: Record<string, boolean>, flag: { key: string; isEnabled: boolean }) => {
        acc[flag.key] = flag.isEnabled
        return acc
      },
      {} as Record<string, boolean>,
    )
  } catch {
    return {}
  }
})

export const isFeatureEnabled = async (key: string) => {
  const flags = await getFeatureFlags()
  return !!flags[key]
}
