"use client"

import React from "react"
import type { ComponentType } from "react"
import { cn } from "@/lib/utils"

export interface DashboardStatsCardProps {
  title: string
  value: string | number
  description: string
  icon: ComponentType<{ className?: string }>
  colorTheme?: "blue" | "violet" | "emerald" | "amber" | "rose" | "cyan" | undefined
  badgeText?: string | undefined
  isLoading?: boolean | undefined
  onClick?: (() => void) | undefined
}

const THEME_MAP = {
  blue: {
    gradient: "from-blue-500 to-blue-600",
    shadow: "shadow-blue-500/20",
    badge: "text-blue-600 dark:text-blue-400 bg-blue-500/10 dark:bg-blue-500/15",
  },
  violet: {
    gradient: "from-violet-500 to-violet-600",
    shadow: "shadow-violet-500/20",
    badge: "text-violet-600 dark:text-violet-400 bg-violet-500/10 dark:bg-violet-500/15",
  },
  emerald: {
    gradient: "from-emerald-500 to-emerald-600",
    shadow: "shadow-emerald-500/20",
    badge: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/15",
  },
  amber: {
    gradient: "from-amber-500 to-amber-600",
    shadow: "shadow-amber-500/20",
    badge: "text-amber-600 dark:text-amber-400 bg-amber-500/10 dark:bg-amber-500/15",
  },
  rose: {
    gradient: "from-rose-500 to-rose-600",
    shadow: "shadow-rose-500/20",
    badge: "text-rose-600 dark:text-rose-400 bg-rose-500/10 dark:bg-rose-500/15",
  },
  cyan: {
    gradient: "from-cyan-500 to-cyan-600",
    shadow: "shadow-cyan-500/20",
    badge: "text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 dark:bg-cyan-500/15",
  },
}

export function DashboardStatsCard({
  title,
  value,
  description,
  icon: Icon,
  colorTheme = "blue",
  badgeText,
  isLoading = false,
  onClick,
}: DashboardStatsCardProps) {
  if (isLoading) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 shadow-sm animate-pulse">
        <div className="absolute top-0 left-0 right-0 h-1 bg-neutral-200 dark:bg-neutral-800" />
        <div className="flex items-center justify-between mb-4">
          <div className="size-11 rounded-xl bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-5 w-16 rounded-full bg-neutral-200 dark:bg-neutral-800" />
        </div>
        <div className="space-y-2.5">
          <div className="h-8 w-24 rounded-lg bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-4 w-32 rounded-md bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-3 w-40 rounded bg-neutral-200 dark:bg-neutral-800" />
        </div>
      </div>
    )
  }

  const theme = THEME_MAP[colorTheme] || THEME_MAP.blue
  const CardWrapper = onClick ? "button" : "div"
  const wrapperProps = onClick ? { type: "button" as const, onClick } : {}

  return (
    <CardWrapper
      {...wrapperProps}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 text-left w-full shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        onClick
          ? "cursor-pointer hover:-translate-y-1 hover:scale-[1.02] hover:shadow-md hover:border-border/80 active:scale-[0.99] transition-all duration-300 ease-out"
          : "cursor-default",
      )}
    >
      <div className={cn("absolute top-0 left-0 right-0 h-1 bg-gradient-to-r", theme.gradient)} />
      <div className="flex items-center justify-between mb-4">
        <div
          className={cn(
            "flex items-center justify-center size-11 rounded-xl bg-gradient-to-br text-white shadow-sm transition-transform duration-300 ease-out",
            theme.gradient,
            theme.shadow,
            onClick && "group-hover:scale-110 group-hover:rotate-3",
          )}
        >
          <Icon className="size-5" />
        </div>
        {badgeText && (
          <span
            className={cn(
              "text-xs font-semibold px-2.5 py-0.5 rounded-full transition-colors duration-200",
              theme.badge,
            )}
          >
            {badgeText}
          </span>
        )}
      </div>
      <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
        {typeof value === "number" ? value.toLocaleString("en-US") : value}
      </p>
      <p
        className={cn(
          "text-sm font-medium text-muted-foreground mt-1 transition-colors duration-200",
          onClick && "group-hover:text-foreground",
        )}
      >
        {title}
      </p>
      <p className="text-xs text-muted-foreground/75 mt-1">{description}</p>
    </CardWrapper>
  )
}
