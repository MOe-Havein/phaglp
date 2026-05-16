"use client"

import { StatsigProvider, StatsigClient } from "@statsig/react-bindings"
import { useMemo } from "react"

export function MyStatsig({ children }: { children: React.ReactNode }) {
  const client = useMemo(() => {
    return new StatsigClient(process.env.NEXT_PUBLIC_STATSIG_CLIENT_KEY || "", { userID: "guest" })
  }, [])

  return <StatsigProvider client={client}>{children}</StatsigProvider>
}
