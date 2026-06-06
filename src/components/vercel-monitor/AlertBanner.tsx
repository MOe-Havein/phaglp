"use client"

import type { MonitorData } from "@/app/api/vercel-monitor/route"

interface AlertBannerProps {
  alert: MonitorData["alerts"][number]
  expanded?: boolean
}

export function AlertBanner({ alert, expanded = false }: AlertBannerProps) {
  const isCritical = alert.severity === "critical"

  return (
    <div
      className={`flex items-start gap-4 p-4 rounded-xl border transition-all duration-300
        ${
          isCritical
            ? "bg-red-500/10 border-red-500/30 shadow-lg shadow-red-500/5"
            : "bg-orange-500/10 border-orange-500/25 shadow-lg shadow-orange-500/5"
        }`}
    >
      {/* Icon */}
      <div
        className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center
          ${isCritical ? "bg-red-500/20" : "bg-orange-500/20"}`}
      >
        {isCritical ? (
          <svg
            className="w-4 h-4 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        ) : (
          <svg
            className="w-4 h-4 text-orange-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span
              className={`text-xs font-semibold uppercase tracking-wider ${isCritical ? "text-red-400" : "text-orange-400"}`}
            >
              {isCritical ? "Critical Alert" : "Warning"}
            </span>
            <p className="mt-0.5 text-sm font-medium text-white/90">
              {alert.message}
            </p>
          </div>
          <span className="flex-shrink-0 text-xs text-white/30">
            {new Date(alert.createdAt).toLocaleTimeString()}
          </span>
        </div>

        {expanded && (
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] text-white/30 uppercase tracking-wide mb-1">
                Project
              </p>
              <p className="text-xs text-white/70 font-mono">
                {alert.projectName}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-white/30 uppercase tracking-wide mb-1">
                Deployment ID
              </p>
              <p className="text-xs text-white/70 font-mono truncate">
                {alert.deploymentId}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
