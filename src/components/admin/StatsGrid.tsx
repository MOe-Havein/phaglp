"use client"

import React from "react"
import { useRouter } from "next/navigation"
import {
  Users,
  BookOpen,
  FileText,
  Package,
  FileCode,
  Mail,
} from "lucide-react"
import { DashboardStatsCard } from "./DashboardStatsCard"

interface StatsGridProps {
  isLoading?: boolean
  stats?: {
    userCount: number
    courseCount: number
    lectureCount: number
    assetCount: number
    pageCount: number
    unreadMessageCount: number
    messageCount: number
  }
}

export function StatsGrid({ isLoading = false, stats }: StatsGridProps) {
  const router = useRouter()

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  const cardsData = [
    {
      title: "Total Users",
      value: stats?.userCount ?? 0,
      icon: Users,
      colorTheme: "blue" as const,
      description: "Registered platform users",
      onClick: () => handleNavigation("/control/users"),
    },
    {
      title: "Courses",
      value: stats?.courseCount ?? 0,
      icon: BookOpen,
      colorTheme: "violet" as const,
      description: "Academy courses",
      onClick: () => handleNavigation("/control/courses"),
    },
    {
      title: "Lectures",
      value: stats?.lectureCount ?? 0,
      icon: FileText,
      colorTheme: "emerald" as const,
      description: "Published & draft lectures",
      onClick: () => handleNavigation("/control/lectures"),
    },
    {
      title: "Assets",
      value: stats?.assetCount ?? 0,
      icon: Package,
      colorTheme: "amber" as const,
      description: "Inventory items tracked",
      onClick: () => handleNavigation("/control/assets"),
    },
    {
      title: "CMS Pages",
      value: stats?.pageCount ?? 0,
      icon: FileCode,
      colorTheme: "rose" as const,
      description: "Managed content pages",
      onClick: () => handleNavigation("/control/pages"),
    },
    {
      title: "Messages",
      value: stats?.unreadMessageCount ?? 0,
      icon: Mail,
      colorTheme: "cyan" as const,
      description: stats ? `${stats.unreadMessageCount} unread of ${stats.messageCount} total` : "Platform messages",
      badgeText: stats && stats.unreadMessageCount > 0 ? `${stats.unreadMessageCount} new` : "All read",
      onClick: () => handleNavigation("/control/messages"),
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {cardsData.map((card) => (
        <DashboardStatsCard
          key={card.title}
          title={card.title}
          value={card.value}
          icon={card.icon}
          colorTheme={card.colorTheme}
          description={card.description}
          badgeText={card.badgeText}
          isLoading={isLoading}
          onClick={card.onClick}
        />
      ))}
    </div>
  )
}
