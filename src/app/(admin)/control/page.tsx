import { Suspense } from "react"
import Link from "next/link"
import {
  Users,
  BookOpen,
  FileText,
  Package,
  Mail,
  FileCode,
  TrendingUp,
  ArrowRight,
  DollarSign,
} from "lucide-react"
import { StatsGrid } from "@/components/admin/StatsGrid"
import { getAdminDashboardStats } from "@/lib/server/assets"
import { StatsSkeleton } from "@/components/admin/StatsSkeleton"

export const metadata = {
  title: "Admin Dashboard — PHAGLP Control Hub",
  description: "Aggregate overview of platform stats for PHAGLP administrators.",
}

const QUICK_LINKS = [
  { title: "Manage Users", href: "/control/users", icon: Users },
  { title: "Manage Courses", href: "/control/courses", icon: BookOpen },
  { title: "Sales Reporting", href: "/control/sales", icon: DollarSign },
  { title: "Manage Lectures", href: "/control/lectures", icon: FileText },
  { title: "Asset Inventory", href: "/control/assets", icon: Package },
  { title: "CMS Pages", href: "/control/pages", icon: FileCode },
  { title: "Messages", href: "/control/messages", icon: Mail },
]

async function StatsGridWrapper() {
  const stats = await getAdminDashboardStats()
  return <StatsGrid stats={stats} />
}

export default async function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
          <TrendingUp className="w-4 h-4" />
          <span>Overview</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          PHAGLP platform at a glance.
        </p>
      </div>

      {/* Stats */}
      <Suspense fallback={<StatsSkeleton />}>
        <StatsGridWrapper />
      </Suspense>

      {/* Quick Links */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          Quick Access
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {QUICK_LINKS.map(({ title, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-sm transition-all duration-200 group"
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors">
                <Icon className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-blue-500 transition-colors" />
              </div>
              <span className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                {title}
              </span>
              <ArrowRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
