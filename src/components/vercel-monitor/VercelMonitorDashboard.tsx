"use client"

import { useState, useEffect, useCallback } from "react"
import type { MonitorData } from "@/app/api/vercel-monitor/route"
import { StatusBadge } from "./StatusBadge"
import { AlertBanner } from "./AlertBanner"
import { ProjectCard } from "./ProjectCard"
import { DeploymentRow } from "./DeploymentRow"
import { SummaryStats } from "./SummaryStats"

const REFRESH_INTERVAL = 30_000 // 30 seconds

export function VercelMonitorDashboard() {
  const [data, setData] = useState<MonitorData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null)
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL / 1000)
  const [activeTab, setActiveTab] = useState<"projects" | "deployments" | "alerts">("projects")

  const fetchData = useCallback(async () => {
    try {
      setError(null)
      const res = await fetch("/api/vercel-monitor", { cache: "no-store" })
      if (!res.ok) {
        const body = await res.json()
        throw new Error(body.error ?? `HTTP ${res.status}`)
      }
      const json: MonitorData = await res.json()
      setData(json)
      setLastRefreshed(new Date())
      setCountdown(REFRESH_INTERVAL / 1000)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch data")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, REFRESH_INTERVAL)
    return () => clearInterval(interval)
  }, [fetchData])

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((c) => (c <= 1 ? REFRESH_INTERVAL / 1000 : c - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const criticalAlerts = data?.alerts.filter((a) => a.severity === "critical") ?? []
  const warningAlerts = data?.alerts.filter((a) => a.severity === "warning") ?? []
  const hasAlerts = (data?.alerts.length ?? 0) > 0

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Ambient glow background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        {hasAlerts && (
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-64 h-64 bg-red-600/8 rounded-full blur-3xl animate-pulse" />
        )}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                Vercel Deployment Monitor
              </h1>
            </div>
            <p className="text-sm text-white/40 ml-11">
              Real-time deployment health & alert system
            </p>
          </div>

          {/* Status + refresh */}
          <div className="flex items-center gap-3">
            {/* Live indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/50">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Refreshing in {countdown}s
            </div>

            <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600/20 border border-violet-500/30 hover:bg-violet-600/30 hover:border-violet-400/40 transition-all duration-200 text-sm font-medium text-violet-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* Last refreshed */}
        {lastRefreshed && (
          <p className="text-xs text-white/30 mb-6 -mt-2">
            Last updated: {lastRefreshed.toLocaleTimeString()}
          </p>
        )}

        {/* Error state */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3">
            <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-red-300">Connection Error</p>
              <p className="text-xs text-red-400/70 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && !data && (
          <div className="space-y-4 animate-pulse">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-24 rounded-2xl bg-white/5" />
              ))}
            </div>
            <div className="h-48 rounded-2xl bg-white/5" />
            <div className="h-64 rounded-2xl bg-white/5" />
          </div>
        )}

        {data && (
          <>
            {/* Summary Stats */}
            <SummaryStats summary={data.summary} />

            {/* Alert Banners */}
            {criticalAlerts.length > 0 && (
              <div className="my-6 space-y-2">
                {criticalAlerts.map((alert) => (
                  <AlertBanner key={alert.id} alert={alert} />
                ))}
              </div>
            )}
            {warningAlerts.length > 0 && (
              <div className="my-4 space-y-2">
                {warningAlerts.map((alert) => (
                  <AlertBanner key={alert.id} alert={alert} />
                ))}
              </div>
            )}

            {/* Tabs */}
            <div className="mt-8 mb-6">
              <div className="flex gap-1 p-1 bg-white/5 rounded-xl w-fit border border-white/10">
                {(["projects", "deployments", "alerts"] as const).map((tab) => {
                  const count =
                    tab === "projects"
                      ? data.projects.length
                      : tab === "deployments"
                        ? data.recentDeployments.length
                        : data.alerts.length
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 capitalize ${
                        activeTab === tab
                          ? "bg-violet-600 text-white shadow-lg shadow-violet-600/25"
                          : "text-white/50 hover:text-white/80 hover:bg-white/5"
                      }`}
                    >
                      {tab}
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded-full ${
                          activeTab === tab
                            ? "bg-white/20 text-white"
                            : "bg-white/10 text-white/50"
                        } ${tab === "alerts" && count > 0 ? "bg-red-500/30 text-red-300" : ""}`}
                      >
                        {count}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Projects Tab */}
            {activeTab === "projects" && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {data.projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
                {data.projects.length === 0 && (
                  <div className="col-span-3 text-center py-16 text-white/30">
                    No projects found
                  </div>
                )}
              </div>
            )}

            {/* Deployments Tab */}
            {activeTab === "deployments" && (
              <div className="rounded-2xl border border-white/10 overflow-hidden bg-white/[0.02]">
                <div className="divide-y divide-white/5">
                  {data.recentDeployments.map((dep) => (
                    <DeploymentRow key={dep.id} deployment={dep} />
                  ))}
                  {data.recentDeployments.length === 0 && (
                    <div className="text-center py-16 text-white/30">
                      No recent deployments
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Alerts Tab */}
            {activeTab === "alerts" && (
              <div className="space-y-3">
                {data.alerts.length === 0 && (
                  <div className="text-center py-20 rounded-2xl border border-white/5 bg-white/[0.02]">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-emerald-500/10 flex items-center justify-center">
                      <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-white/50 font-medium">All systems healthy</p>
                    <p className="text-white/25 text-sm mt-1">No active alerts detected</p>
                  </div>
                )}
                {data.alerts.map((alert) => (
                  <AlertBanner key={alert.id} alert={alert} expanded />
                ))}
              </div>
            )}

            {/* Footer meta */}
            <div className="mt-10 pt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs text-white/25">
              <span>Team ID: {data.teamId}</span>
              <div className="flex items-center gap-4">
                <StatusBadge state="READY" small />
                <StatusBadge state="BUILDING" small />
                <StatusBadge state="ERROR" small />
                <StatusBadge state="BLOCKED" small />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
