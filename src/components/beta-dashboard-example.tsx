"use client"

import { useFeatureGate } from "@statsig/react-bindings"

export function BetaDashboard() {
  const { value: isBetaEnabled } = useFeatureGate("beta_dashboard")

  if (!isBetaEnabled) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold">Standard Dashboard</h2>
        <p className="text-muted-foreground">
          The beta dashboard is currently disabled for your account.
        </p>
      </div>
    )
  }

  return (
    <div className="p-8 text-center bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl">
      <h2 className="text-xl font-bold text-purple-700">🚀 Welcome to the Beta Dashboard!</h2>
      <p className="text-purple-600">You are part of our exclusive experiment.</p>
    </div>
  )
}
