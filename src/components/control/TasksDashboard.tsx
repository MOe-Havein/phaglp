"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ClipboardCheck,
  Database,
  ShieldAlert,
  Zap,
  Search,
  Filter,
  RefreshCw,
  Info,
  Clock,
  Compass,
  ArrowRight,
} from "lucide-react"

// Types
type ConcernType =
  | "Security"
  | "Database"
  | "Type Safety"
  | "Quality"
  | "Performance"
  | "Accessibility"
  | "Polish/DX"

interface Task {
  id: number
  text: string
  concern: ConcernType
}

interface Phase {
  id: number
  name: string
  duration: string
  status: string
  description: string
  color: string
  textColor: string
  bgColor: string
  tasks: Task[]
}

// Complete 52 Tasks Catalog split into 4 phases of 13 tasks each
const PHASES: Phase[] = [
  {
    id: 1,
    name: "Phase 1 — Critical",
    duration: "3–5 days",
    status: "block deploy",
    description:
      "Critical security gaps and guideline alignment: purging obsolete JWT auth libraries, resolving administrative sidebar leaks, enforcing server API handler controls, hardening cookies, and deleting conflicting schemas.",
    color: "from-red-500 to-orange-500",
    textColor: "text-red-500 dark:text-red-400",
    bgColor: "bg-red-50/50 dark:bg-red-950/10 border-red-200/60 dark:border-red-900/30",
    tasks: [
      {
        id: 1,
        text: "Remove Legacy JWT Auth: Complete removal of obsolete JWT code blocks in src/lib/auth.ts or src/lib/jwt.ts.",
        concern: "Security",
      },
      {
        id: 2,
        text: "Fix Admin Layout Leakage: Ensure sidebar and dashboard layouts are never rendered before authentication validation completes.",
        concern: "Security",
      },
      {
        id: 3,
        text: "Enforce RBAC in API Route Handlers: Implement server-side Role.ADMIN validations on all critical endpoint operations.",
        concern: "Security",
      },
      {
        id: 4,
        text: "Harden Session Cookies in Auth.js: Verify session cookies are httpOnly, secure (production), and sameSite: lax.",
        concern: "Security",
      },
      {
        id: 5,
        text: "Delete Conflicting docs/schema.prisma: Remove outdated schema reference to avoid schema version confusion.",
        concern: "Database",
      },
      {
        id: 6,
        text: "Remediate CompressionStream Edge Runtime warnings: Fix middleware jose warning logs using next config modifications.",
        concern: "Polish/DX",
      },
      {
        id: 7,
        text: "Perform Audit of /api Routes: Verify that no API routing exposes private database schemas to anonymous visitors.",
        concern: "Security",
      },
      {
        id: 8,
        text: "Enforce Password Salt Iterations: Lock salt generation to exactly 10 iterations within bcryptjs actions.",
        concern: "Security",
      },
      {
        id: 9,
        text: "Address Obsolete Package Imports: Purge unused page parameters and obsolete imports under admin controller subdirectories.",
        concern: "Polish/DX",
      },
      {
        id: 10,
        text: "Implement dependency-free isRedirectError Helper: Resolve dynamic action CallbackRouteError using standard utils helper.",
        concern: "Quality",
      },
      {
        id: 11,
        text: "Configure Production NEXTAUTH_SECRET: Enforce verification of cryptographically secure 32-byte session secrets.",
        concern: "Security",
      },
      {
        id: 12,
        text: "Block Local Database Fallbacks: Prevent production Docker run configurations from defaulting back to localhost environments.",
        concern: "Database",
      },
      {
        id: 13,
        text: "Validate Auth.js v5 beta references: Verify dynamic session middleware bindings compile and resolve server-side.",
        concern: "Security",
      },
    ],
  },
  {
    id: 2,
    name: "Phase 2 — Core",
    duration: "1–2 weeks",
    status: "recommended core",
    description:
      "Strict typescript configurations, static environment type validations, Prisma connection pooling checks, relational transaction wraps, converting dynamic rendering to Server Components, and Zod assertions.",
    color: "from-blue-500 to-indigo-500",
    textColor: "text-blue-500 dark:text-blue-400",
    bgColor: "bg-blue-50/50 dark:bg-blue-950/10 border-blue-200/60 dark:border-blue-900/30",
    tasks: [
      {
        id: 14,
        text: "Enable strict TypeScript: Switch ignoreBuildErrors option to false and activate strict compiler flags in configs.",
        concern: "Type Safety",
      },
      {
        id: 15,
        text: "Implement Zod validation for Env Variables: Parse system variables in a schema-backed helper on boot.",
        concern: "Type Safety",
      },
      {
        id: 16,
        text: "Fix Prisma Client Singleton Pattern: Prevent redundant database connection warning statements in Next development phases.",
        concern: "Database",
      },
      {
        id: 17,
        text: "Wrap Multi-Step DB Operations in Transactions: Safeguard multi-row inserts (e.g. course enrollments) using Prisma transactions.",
        concern: "Database",
      },
      {
        id: 18,
        text: "Convert Dashboard useEffect fetches to Server Components: Prefetch personal course catalogs on Next servers.",
        concern: "Performance",
      },
      {
        id: 19,
        text: "Add Zod Schemas to all Server Actions: Bind user-submitted forms to strict schema validators before DB updates.",
        concern: "Type Safety",
      },
      {
        id: 20,
        text: "Convert Lectures List fetches: Transition traditional frontend data fetching sequences to standard Server Components.",
        concern: "Performance",
      },
      {
        id: 21,
        text: "Eliminate explicit 'any' types: Replace ambiguous type notations with formal TypeScript structures.",
        concern: "Type Safety",
      },
      {
        id: 22,
        text: "Implement Typed Responses for Server Actions: Wrap outputs in standard Success/Error helper records.",
        concern: "Type Safety",
      },
      {
        id: 23,
        text: "Verify Strict TS checking in CI/CD pipeline: Add blocking type check scripts within GitHub pull workflows.",
        concern: "Type Safety",
      },
      {
        id: 24,
        text: "Implement Global Error Boundaries for Server Actions: Catch unhandled errors gracefully inside form action listeners.",
        concern: "Quality",
      },
      {
        id: 25,
        text: "Add Type Assertions for Database JSON Fields: Cast raw json metadata objects using typed interfaces.",
        concern: "Type Safety",
      },
      {
        id: 26,
        text: "Optimize route caching rules: Apply revalidation parameters to stable static lists.",
        concern: "Performance",
      },
    ],
  },
  {
    id: 3,
    name: "Phase 3 — Quality",
    duration: "2–3 weeks",
    status: "stability quality",
    description:
      "Comprehensive end-to-end integration test runs, low-latency Redis cache lookups, graceful database query fallback, visual loading shimmer blocks, Prisma N+1 query joins, and strict accessibility tags.",
    color: "from-purple-500 to-pink-500",
    textColor: "text-purple-500 dark:text-purple-400",
    bgColor: "bg-purple-50/50 dark:bg-purple-950/10 border-purple-200/60 dark:border-purple-900/30",
    tasks: [
      {
        id: 27,
        text: "Playwright E2E Flow — Authentication: Validate standard registration, login, role routing gates, and signout logs.",
        concern: "Quality",
      },
      {
        id: 28,
        text: "Playwright E2E Flow — Course Enrollment: Validate course searching, transaction triggers, and layout redirects.",
        concern: "Quality",
      },
      {
        id: 29,
        text: "Playwright E2E Flow — Marriage Matching: Verify profile options, value parameters, and mutual matching rules.",
        concern: "Quality",
      },
      {
        id: 30,
        text: "Redis Caching with Upstash Integration: Cache frequently requested blog articles and lecture contents.",
        concern: "Performance",
      },
      {
        id: 31,
        text: "Graceful Fallback for Cache Outages: Direct requests to database servers dynamically if Redis endpoints are unresponsive.",
        concern: "Performance",
      },
      {
        id: 32,
        text: "Add Shimmer Loading Skeletons: Construct elegant, bone-colored skeletons for administrative data tables.",
        concern: "Quality",
      },
      {
        id: 33,
        text: "Perform N+1 Database Query Audit: Consolidate relation fetch operations using Prisma inclusion queries.",
        concern: "Database",
      },
      {
        id: 34,
        text: "Accessibility Pass on Main Navigation: Apply aria-expanded tags and support complete arrow keyboard actions.",
        concern: "Accessibility",
      },
      {
        id: 35,
        text: "Accessibility Keyboard Audit for Input Forms: Ensure forms have visible outlines and support Tab focus loops.",
        concern: "Accessibility",
      },
      {
        id: 36,
        text: "Dark Mode Coverage Pass: Ensure visual color balances and typography match standard accessibility guidelines.",
        concern: "Quality",
      },
      {
        id: 37,
        text: "Standardize PageTransition animations: Configure framer motion views to render without introducing layouts shifts.",
        concern: "Quality",
      },
      {
        id: 38,
        text: "Implement Widget Error Boundaries: Wrap interactive dynamic widgets to protect page layouts from crashes.",
        concern: "Quality",
      },
      {
        id: 39,
        text: "Integrate axe-core tests in Playwright: Run automated accessibility checks inside E2E deployment steps.",
        concern: "Accessibility",
      },
    ],
  },
  {
    id: 4,
    name: "Phase 4 — Polish",
    duration: "ongoing",
    status: "cleanup polish",
    description:
      "General doc sanitization, barrel bundle exports audits, PostgreSQL cluster container health validations, cache builds pipelines, and production standard lint rules.",
    color: "from-emerald-500 to-teal-500",
    textColor: "text-emerald-500 dark:text-emerald-400",
    bgColor:
      "bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-200/60 dark:border-emerald-900/30",
    tasks: [
      {
        id: 40,
        text: "Clean Up Conflicting docs/ Files: Purge redundant readme and schema copies outside /src and /prisma.",
        concern: "Polish/DX",
      },
      {
        id: 41,
        text: "Perform Barrel Export Audits: Verify import directories avoid circular imports and clean compiler paths.",
        concern: "Polish/DX",
      },
      {
        id: 42,
        text: "Harden Docker Compose Healthchecks: Setup dynamic curl or pg_isready controls inside deployment services.",
        concern: "Polish/DX",
      },
      {
        id: 43,
        text: "Enable GitHub Actions Caching: Speed up pipeline actions by caching node_modules and Next.js compiler items.",
        concern: "Polish/DX",
      },
      {
        id: 44,
        text: "Remove Unused Package Dependencies: Remove inactive packages from package.json and update node modules lock files.",
        concern: "Polish/DX",
      },
      {
        id: 45,
        text: "Optimize Dockerfile Layer Sequence: Order build commands so that packages copy prior to custom source code.",
        concern: "Polish/DX",
      },
      {
        id: 46,
        text: "Sanitize Middleware Console Logs: Block printing of session structures or personal identifier records.",
        concern: "Polish/DX",
      },
      {
        id: 47,
        text: "Standardize Font Preloading: Configure Layout to fetch Google Web Fonts using next/font package headers.",
        concern: "Performance",
      },
      {
        id: 48,
        text: "Verify Vercel Config security headers: Add strict-transport-security and content-security headers inside vercel.json.",
        concern: "Polish/DX",
      },
      {
        id: 49,
        text: "Clean Leftover backup/temporary Files: Remove legacy bak files and setup gitignore bounds.",
        concern: "Polish/DX",
      },
      {
        id: 50,
        text: "Implement DB Backup Automation: Configure cron services or pg_dump tasks to secure staging records.",
        concern: "Database",
      },
      {
        id: 51,
        text: "Audit Bundle Size using bundle analyzer: Run bundle check reports and optimize library imports.",
        concern: "Performance",
      },
      {
        id: 52,
        text: "Configure Standardized Prettier/ESLint configs: Validate rules to maintain identical layout formats in IDE.",
        concern: "Polish/DX",
      },
    ],
  },
]

// Concern filter mapping
const CONCERNS: { value: "all" | ConcernType; label: string; icon: string; color: string }[] = [
  {
    value: "all",
    label: "All Concerns",
    icon: "🌐",
    color: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300",
  },
  {
    value: "Security",
    label: "Security",
    icon: "🛡️",
    color:
      "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-300 border-red-200/50 dark:border-red-900/30",
  },
  {
    value: "Database",
    label: "Database",
    icon: "🗄️",
    color:
      "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300 border-amber-200/50 dark:border-amber-900/30",
  },
  {
    value: "Type Safety",
    label: "Type Safety",
    icon: "⚙️",
    color:
      "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300 border-blue-200/50 dark:border-blue-900/30",
  },
  {
    value: "Quality",
    label: "Quality",
    icon: "🧪",
    color:
      "bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-300 border-purple-200/50 dark:border-purple-900/30",
  },
  {
    value: "Performance",
    label: "Performance",
    icon: "⚡",
    color:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-300 border-yellow-200/50 dark:border-yellow-900/30",
  },
  {
    value: "Accessibility",
    label: "Accessibility",
    icon: "♿",
    color:
      "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-300 border-indigo-200/50 dark:border-indigo-900/30",
  },
  {
    value: "Polish/DX",
    label: "Polish/DX",
    icon: "🧹",
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300 border-emerald-200/50 dark:border-emerald-900/30",
  },
]

export function TasksDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | 1 | 2 | 3 | 4>("overview")
  const [checkedTasks, setCheckedTasks] = useState<Record<number, boolean>>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [activeConcernFilter, setActiveConcernFilter] = useState<"all" | ConcernType>("all")
  const [isMounted, setIsMounted] = useState(false)

  // Initialize checklist state from localStorage
  useEffect(() => {
    setIsMounted(true)
    const stored = localStorage.getItem("phagpl_tasks_status")
    if (stored) {
      try {
        setCheckedTasks(JSON.parse(stored))
      } catch (e) {
        console.error("Failed to parse stored task status", e)
      }
    }
  }, [])

  // Persist status when modified
  const toggleTask = (id: number) => {
    const updated = {
      ...checkedTasks,
      [id]: !checkedTasks[id],
    }
    setCheckedTasks(updated)
    localStorage.setItem("phagpl_tasks_status", JSON.stringify(updated))
  }

  // Bulk check or uncheck tasks in active filter/tab view
  const bulkToggle = (phaseId: number, check: boolean) => {
    const phase = PHASES.find((p) => p.id === phaseId)
    if (!phase) return

    const updated = { ...checkedTasks }
    phase.tasks.forEach((task) => {
      // Respect current filter and search queries when doing bulk modifications
      const matchesFilter = activeConcernFilter === "all" || task.concern === activeConcernFilter
      const matchesSearch = task.text.toLowerCase().includes(searchQuery.toLowerCase())
      if (matchesFilter && matchesSearch) {
        updated[task.id] = check
      }
    })
    setCheckedTasks(updated)
    localStorage.setItem("phagpl_tasks_status", JSON.stringify(updated))
  }

  // Reset all 52 tasks
  const resetAllTasks = () => {
    if (window.confirm("Are you sure you want to reset all 52 tasks progress?")) {
      setCheckedTasks({})
      localStorage.removeItem("phagpl_tasks_status")
    }
  }

  // Calculate statistics
  const getPhaseStats = (phase: Phase) => {
    const total = phase.tasks.length
    const completed = phase.tasks.filter((t) => checkedTasks[t.id]).length
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0
    return { total, completed, percent }
  }

  const globalTotal = 52
  const globalCompleted = Object.values(checkedTasks).filter(Boolean).length
  const globalPercent = Math.round((globalCompleted / globalTotal) * 100)

  // Retrieve concern icon helper
  const getConcernBadge = (concern: ConcernType) => {
    const match = CONCERNS.find((c) => c.value === concern)
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${match?.color}`}
      >
        <span>{match?.icon}</span>
        <span>{concern}</span>
      </span>
    )
  }

  if (!isMounted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px]">
        <RefreshCw className="w-8 h-8 text-primary animate-spin mb-4" />
        <p className="text-gray-500 dark:text-gray-400 text-sm">Loading task framework...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-semibold text-sm">
            <ClipboardCheck className="w-4 h-4 text-blue-500" />
            <span className="text-blue-500">Interactive Implementation Guide</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            PHAGLP Development Dashboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Track execution across 4 structured phases containing 52 technical milestone check
            items.
          </p>
        </div>

        {/* Global Stats Board */}
        <div className="flex items-center gap-5 bg-gray-50 dark:bg-gray-800/40 p-4 rounded-xl border border-gray-100 dark:border-gray-800/60 min-w-[280px]">
          <div className="relative w-14 h-14 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-gray-200 dark:text-gray-700"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-blue-500 transition-all duration-500 ease-out"
                strokeDasharray={`${globalPercent}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                {globalPercent}%
              </span>
            </div>
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between text-xs font-medium text-gray-500 dark:text-gray-400">
              <span>Overall Progress</span>
              <span className="font-bold text-gray-800 dark:text-gray-200">
                {globalCompleted} / {globalTotal} Done
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${globalPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-800 pb-2">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-lg transition-all duration-150 ${
            activeTab === "overview"
              ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 shadow-md"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Overview Summary</span>
        </button>

        {PHASES.map((phase) => {
          const stats = getPhaseStats(phase)
          return (
            <button
              key={phase.id}
              onClick={() => setActiveTab(phase.id as any)}
              className={`flex items-center gap-2.5 px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-150 border ${
                activeTab === phase.id
                  ? "bg-blue-600 text-white border-blue-600 dark:bg-blue-500 dark:border-blue-500 shadow-sm"
                  : "bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <span>{phase.name}</span>
              <span
                className={`px-1.5 py-0.5 rounded text-xs font-bold ${
                  activeTab === phase.id
                    ? "bg-blue-700 text-white dark:bg-blue-600"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                }`}
              >
                {stats.completed}/{stats.total}
              </span>
            </button>
          )
        })}

        <button
          onClick={resetAllTasks}
          className="ml-auto flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg border border-transparent hover:border-red-200 dark:hover:border-red-900/40 transition-all"
          title="Reset tasks to zero progress"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset All</span>
        </button>
      </div>

      {/* Dynamic Body Content */}
      <AnimatePresence mode="wait">
        {activeTab === "overview" ? (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.18 }}
            className="space-y-6"
          >
            {/* Overview Cards Dashboard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PHASES.map((phase) => {
                const stats = getPhaseStats(phase)
                const isBlocked = phase.status === "block deploy"
                return (
                  <div
                    key={phase.id}
                    onClick={() => setActiveTab(phase.id as any)}
                    className="group relative flex flex-col p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-2.5 w-2.5 rounded-full bg-gradient-to-tr ${phase.color}`}
                          />
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                            {phase.name}
                          </h3>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800/80 px-2 py-0.5 rounded font-medium">
                            <Clock className="w-3.5 h-3.5" />
                            {phase.duration}
                          </span>
                          <span
                            className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                              isBlocked
                                ? "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300"
                                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                            }`}
                          >
                            {phase.status}
                          </span>
                        </div>
                      </div>

                      {/* Circle Gauge */}
                      <div className="relative w-16 h-16">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            className="text-gray-100 dark:text-gray-800"
                            strokeWidth="3.5"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className="text-blue-600 dark:text-blue-500 transition-all duration-500"
                            strokeDasharray={`${stats.percent}, 100`}
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-extrabold text-gray-800 dark:text-gray-100">
                            {stats.percent}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 leading-relaxed">
                      {phase.description}
                    </p>

                    <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-xs">
                      <span className="text-gray-500 dark:text-gray-400">
                        Tasks:{" "}
                        <span className="font-bold text-gray-700 dark:text-gray-300">
                          {stats.completed}
                        </span>{" "}
                        of <span className="font-bold">{stats.total}</span>
                      </span>
                      <span className="flex items-center gap-1 text-blue-500 font-semibold group-hover:translate-x-1 transition-transform">
                        <span>Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Quick Context Panel */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-sm">
              <h3 className="text-md font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-500" />
                <span>Plan Guidelines and Standards Summary</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
                <div className="bg-gray-50 dark:bg-gray-800/30 p-4 rounded-xl border border-gray-100 dark:border-gray-800/50 space-y-1">
                  <h4 className="font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
                    <span>Security Integrity</span>
                  </h4>
                  <p className="leading-relaxed">
                    All public-facing features require robust Auth.js verification routes. Restrict
                    layouts from leaking before routing finishes.
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/30 p-4 rounded-xl border border-gray-100 dark:border-gray-800/50 space-y-1">
                  <h4 className="font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    <Database className="w-3.5 h-3.5 text-amber-500" />
                    <span>Database Consistency</span>
                  </h4>
                  <p className="leading-relaxed">
                    Use unified client instantiations for PostgreSQL queries. Wrap database
                    modifications inside Prisma transactions.
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/30 p-4 rounded-xl border border-gray-100 dark:border-gray-800/50 space-y-1">
                  <h4 className="font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-yellow-500" />
                    <span>Performance Speed</span>
                  </h4>
                  <p className="leading-relaxed">
                    Switch client useEffect data loops over to direct Server Components, and
                    leverage Upstash Redis clusters.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          // Individual Phase Tab Layout
          (() => {
            const phase = PHASES.find((p) => p.id === activeTab)
            if (!phase) return null

            const stats = getPhaseStats(phase)
            const isBlocked = phase.status === "block deploy"

            // Filter tasks by concern AND search query
            const filteredTasks = phase.tasks.filter((task) => {
              const matchesConcern =
                activeConcernFilter === "all" || task.concern === activeConcernFilter
              const matchesSearch = task.text.toLowerCase().includes(searchQuery.toLowerCase())
              return matchesConcern && matchesSearch
            })

            const activeFilterMatchCount = filteredTasks.length

            return (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.18 }}
                className="space-y-6"
              >
                {/* Phase Info Header Card */}
                <div
                  className={`p-6 rounded-2xl border ${phase.bgColor} flex flex-col md:flex-row md:items-start justify-between gap-6`}
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded bg-white dark:bg-gray-900 shadow-sm border border-gray-200/50 dark:border-gray-800/40 ${phase.textColor}`}
                      >
                        {phase.name}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 bg-white/70 dark:bg-gray-900/50 px-2 py-1 rounded shadow-sm">
                        <Clock className="w-3.5 h-3.5" />
                        Duration:{" "}
                        <span className="font-bold text-gray-700 dark:text-gray-300">
                          {phase.duration}
                        </span>
                      </span>
                      <span
                        className={`text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-1 rounded bg-white dark:bg-gray-900 shadow-sm border border-gray-200/50 dark:border-gray-800/40 ${
                          isBlocked
                            ? "text-red-600 dark:text-red-400"
                            : "text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        {phase.status}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-relaxed max-w-4xl">
                      {phase.description}
                    </p>
                  </div>

                  {/* Phase Stats Gauge */}
                  <div className="flex items-center gap-4 bg-white/60 dark:bg-gray-900/60 p-4 rounded-xl border border-white/40 dark:border-gray-800/40 shadow-sm min-w-[240px]">
                    <div className="relative w-12 h-12 flex-shrink-0">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-gray-200 dark:text-gray-700"
                          strokeWidth="3.5"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-blue-600 dark:text-blue-500 transition-all duration-300"
                          strokeDasharray={`${stats.percent}, 100`}
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                          {stats.percent}%
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold text-gray-700 dark:text-gray-300">
                        <span>Phase progress</span>
                        <span>
                          {stats.completed}/{stats.total}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-600 dark:bg-blue-500 h-full rounded-full transition-all duration-300"
                          style={{ width: `${stats.percent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Filter and Search Box Control Bar */}
                <div className="flex flex-col lg:flex-row gap-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 rounded-xl shadow-sm">
                  {/* Search */}
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search active tasks..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-500 text-gray-800 dark:text-gray-200 transition-colors"
                    />
                  </div>

                  {/* Bulk Controls */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => bulkToggle(phase.id, true)}
                      className="px-3 py-2 text-xs font-semibold bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700/80 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-lg transition-colors"
                    >
                      Check Shown
                    </button>
                    <button
                      onClick={() => bulkToggle(phase.id, false)}
                      className="px-3 py-2 text-xs font-semibold bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700/80 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-lg transition-colors"
                    >
                      Uncheck Shown
                    </button>
                  </div>
                </div>

                {/* Concern Filters Tag Strip */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">
                    Filter Phase Tasks by Concern
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CONCERNS.map((concern) => {
                      const isActive = activeConcernFilter === concern.value
                      const countInPhase = phase.tasks.filter(
                        (t) => concern.value === "all" || t.concern === concern.value,
                      ).length

                      return (
                        <button
                          key={concern.value}
                          onClick={() => setActiveConcernFilter(concern.value)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                            isActive
                              ? "bg-gray-900 border-gray-900 text-white dark:bg-gray-100 dark:border-gray-100 dark:text-gray-900 font-bold"
                              : "bg-white border-gray-200 text-gray-600 dark:bg-gray-950 dark:border-gray-800 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900"
                          }`}
                        >
                          <span>{concern.icon}</span>
                          <span>{concern.label}</span>
                          <span
                            className={`px-1 rounded text-[10px] ${
                              isActive
                                ? "bg-gray-700 text-white dark:bg-gray-200 dark:text-gray-800"
                                : "bg-gray-100 text-gray-500 dark:bg-gray-800"
                            }`}
                          >
                            {countInPhase}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Task Checklist Items Grid */}
                <div className="space-y-2">
                  {filteredTasks.length === 0 ? (
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-16 rounded-2xl text-center text-gray-400">
                      <Filter className="w-10 h-10 mx-auto mb-3 opacity-30" />
                      <p className="font-semibold text-sm">
                        No tasks match selected filter parameters
                      </p>
                      <p className="text-xs mt-1 text-gray-500">
                        Try modifying your query or selecting another concern tag.
                      </p>
                    </div>
                  ) : (
                    filteredTasks.map((task) => {
                      const isChecked = checkedTasks[task.id]
                      return (
                        <div
                          key={task.id}
                          onClick={() => toggleTask(task.id)}
                          className={`flex items-start gap-4 p-4 rounded-xl border transition-all duration-200 cursor-pointer select-none ${
                            isChecked
                              ? "bg-gray-50/50 dark:bg-gray-900/30 border-gray-200 dark:border-gray-800/80 opacity-65"
                              : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-sm"
                          }`}
                        >
                          {/* Checked Box Visual Container */}
                          <div className="flex-shrink-0 mt-0.5">
                            {isChecked ? (
                              <motion.div
                                initial={{ scale: 0.6 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 350, damping: 20 }}
                                className="w-5 h-5 rounded border border-emerald-500 bg-emerald-500 dark:bg-emerald-600 flex items-center justify-center text-white"
                              >
                                <svg
                                  className="w-3.5 h-3.5 stroke-[3]"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </motion.div>
                            ) : (
                              <div className="w-5 h-5 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 transition-colors hover:border-blue-500" />
                            )}
                          </div>

                          {/* Task Description */}
                          <div className="flex-1 space-y-1.5 min-w-0">
                            <p
                              className={`text-sm font-semibold leading-relaxed break-words ${
                                isChecked
                                  ? "text-gray-400 dark:text-gray-500 line-through"
                                  : "text-gray-800 dark:text-gray-200"
                              }`}
                            >
                              {task.text}
                            </p>
                            <div className="flex flex-wrap items-center gap-2">
                              {/* Phase Number Badge */}
                              <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500">
                                Task #{task.id}
                              </span>
                              <span>•</span>
                              {/* Concern tag */}
                              {getConcernBadge(task.concern)}
                            </div>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>

                {/* Filter statistics counter */}
                {activeFilterMatchCount > 0 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Showing {activeFilterMatchCount} of {phase.tasks.length} tasks in {phase.name}
                  </p>
                )}
              </motion.div>
            )
          })()
        )}
      </AnimatePresence>
    </div>
  )
}
