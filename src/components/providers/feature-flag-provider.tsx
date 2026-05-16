"use client"

import { createContext, useContext, ReactNode } from "react"

type FeatureFlags = Record<string, boolean>

const FeatureFlagContext = createContext<FeatureFlags>({})

export function FeatureFlagProvider({
  children,
  initialFlags,
}: {
  children: ReactNode
  initialFlags: FeatureFlags
}) {
  return <FeatureFlagContext.Provider value={initialFlags}>{children}</FeatureFlagContext.Provider>
}

export function useFeatureFlag(key: string) {
  const flags = useContext(FeatureFlagContext)
  return !!flags[key]
}
