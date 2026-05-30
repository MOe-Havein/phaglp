"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import {
  CheckCircle2,
  ShieldAlert,
  Settings,
  Sparkles,
  Trophy,
  Timer,
  Activity,
  Check,
  RotateCcw,
  Database,
  Lock,
  GitBranch,
} from "lucide-react"

// Types
interface Task {
  id: string
  title: string
  description: string
  phase: number
  weight: "Critical" | "Major" | "Minor"
  duration: string
  impact: string
}

interface PhaseInfo {
  number: number
  title: string
  shortTitle: string
  status: string
  duration: string
  badgeColor: string
  icon: any
}

// Complete Task Definition
const ALL_TASKS: Task[] = [
  // Phase 1 - Critical
  {
    id: "jwt_hardening",
    title: "JWT Secret Hardening",
    description:
      "Enforce cryptographically secure, 32-byte production-level keys and robust encryption filters.",
    phase: 1,
    weight: "Critical",
    duration: "4h",
    impact: "Security Safeguard",
  },
  {
    id: "cookie_hardening",
    title: "httpOnly Cookie Enforcement",
    description:
      "Hardened credential session cookies configured as httpOnly, secure, and sameSite: 'lax' in production.",
    phase: 1,
    weight: "Critical",
    duration: "3h",
    impact: "Auth Isolation",
  },
  {
    id: "csrf_xss_prevention",
    title: "CSRF & XSS Prevention Shield",
    description:
      "Construct advanced customized CSP headers, X-Frame restrictions, and sanitizers inside active middleware.",
    phase: 1,
    weight: "Critical",
    duration: "6h",
    impact: "XSS Defense",
  },
  {
    id: "rbac_middleware",
    title: "Strict Route Authorization Check",
    description:
      "Enforce role-based access checks (RBAC) against user.role verification in admin and control namespaces.",
    phase: 1,
    weight: "Critical",
    duration: "5h",
    impact: "Access Management",
  },
  {
    id: "db_migrations_baseline",
    title: "Database Migration Baselines",
    description:
      "Structure resilient container-ready migrate scripts to reconcile SQLite local and PostgreSQL production schema shifts.",
    phase: 1,
    weight: "Critical",
    duration: "8h",
    impact: "Data Integrity",
  },
  {
    id: "strict_validation",
    title: "Strict Payload Sanitization",
    description:
      "Implement unified Zod schema filters across all API routes and server action entry buffers.",
    phase: 1,
    weight: "Critical",
    duration: "6h",
    impact: "Payload Validation",
  },

  // Phase 2 - Core
  {
    id: "stoic_curriculums",
    title: "STOIC Course Scaffolding",
    description:
      "Draft comprehensive modular schemas representing courses, modules, lessons, and varying payment types.",
    phase: 2,
    weight: "Major",
    duration: "1.5 days",
    impact: "Core Curriculum",
  },
  {
    id: "adaptive_pathing",
    title: "Genius Adaptive Pathing Core",
    description:
      "Configure dynamic algorithms routing custom lessons in alignment with individual IQ levels and preferences.",
    phase: 2,
    weight: "Major",
    duration: "2 days",
    impact: "AI Adaptive Engine",
  },
  {
    id: "marriage_matching",
    title: "Halal Values-Based Marriage Registry",
    description:
      "Build robust profile frameworks encompassing detailed marriage preferences, guardian authorization scopes, and world tiers.",
    phase: 2,
    weight: "Major",
    duration: "2.5 days",
    impact: "Marriage Framework",
  },
  {
    id: "cms_homepage_override",
    title: "Dynamic CMS Homepage Controllers",
    description:
      "Provide complete admin controls to override site menus, page structure sections, and logo/favicons database records dynamically.",
    phase: 2,
    weight: "Major",
    duration: "1.5 days",
    impact: "Content CMS Control",
  },
  {
    id: "ai_fallacy_checking",
    title: "AI Argument fallacy Analyzer",
    description:
      "Integrate Gemini API wrappers parser analyzing philosophical arguments to detect formal and informal logical fallacies.",
    phase: 2,
    weight: "Major",
    duration: "2 days",
    impact: "Interactive AI Utility",
  },
  {
    id: "asset_allocation_ledger",
    title: "Academy Asset Allocation System",
    description:
      "Implement conditional ledger checking tracking supplier details, allocation timestamps, and hardware wear parameters.",
    phase: 2,
    weight: "Minor",
    duration: "1 day",
    impact: "Inventory Operations",
  },

  // Phase 3 - Quality
  {
    id: "vitest_unit_testing",
    title: "Vitest Unit Test Suites",
    description:
      "Write intensive logic assertions covering utils, custom hooks, and dynamic course algorithms.",
    phase: 3,
    weight: "Major",
    duration: "1.5 days",
    impact: "Logic Stability",
  },
  {
    id: "playwright_e2e",
    title: "Playwright E2E User Flows",
    description:
      "Run automated workflows validating student registration, course enrollment, and comprehensive admin settings updates.",
    phase: 3,
    weight: "Major",
    duration: "2 days",
    impact: "Lifecycle Validation",
  },
  {
    id: "lighthouse_score",
    title: "Lighthouse Performance Boosts",
    description:
      "Configure external media domains, apply lazy imports, and optimize large assets to hit a minimum 90 speed index.",
    phase: 3,
    weight: "Major",
    duration: "1 day",
    impact: "Speed & SEO",
  },
  {
    id: "strict_typescript",
    title: "Strict TypeScript Compliance",
    description:
      "Purge code warnings, eradicate implicit 'any' declarations, clean up unused vars, and enable strict compiler outputs.",
    phase: 3,
    weight: "Critical",
    duration: "1.5 days",
    impact: "Type Safety",
  },
  {
    id: "error_boundaries",
    title: "Global Custom Error Boundaries",
    description:
      "Inject user-friendly failure page states capturing system disruptions, network lapses, or database timeouts gracefully.",
    phase: 3,
    weight: "Minor",
    duration: "1 day",
    impact: "Error Management",
  },

  // Phase 4 - Polish
  {
    id: "hsl_aesthetic",
    title: "Unified HSL Aesthetic Themes",
    description:
      "Update next-themes color parameters with sleek dark grids, refined typography weights, and glowing focus borders.",
    phase: 4,
    weight: "Major",
    duration: "1 day",
    impact: "Premium UI/UX",
  },
  {
    id: "framer_motion_animations",
    title: "Framer Motion Layout Transitions",
    description:
      "Scaffold organic visual flows, interactive micro-scaling hover items, and springy drawer overlays.",
    phase: 4,
    weight: "Minor",
    duration: "1 day",
    impact: "Micro-Interactions",
  },
  {
    id: "rtl_responsiveness",
    title: "Arabic RTL Fluent Layouts",
    description:
      "Ensure exact multi-device support automatically adjusting text streams, navigation elements, and grid sizes for Arabic readers.",
    phase: 4,
    weight: "Major",
    duration: "1.5 days",
    impact: "Accessibility Support",
  },
  {
    id: "seo_tags_manifests",
    title: "SEO Meta Tags & Sitemaps",
    description:
      "Generate structured social open-graph tags, canonical configurations, robots settings, and automated sitemap XML feeds.",
    phase: 4,
    weight: "Minor",
    duration: "1 day",
    impact: "Search Indexing",
  },
  {
    id: "standalone_dryrun",
    title: "Standalone Docker Readiness Dryrun",
    description:
      "Perform staging verification inside production standalone container modules with healthchecks enabled.",
    phase: 4,
    weight: "Critical",
    duration: "1.5 days",
    impact: "Release Readiness",
  },
]

const PHASES: PhaseInfo[] = [
  {
    number: 1,
    title: "Phase 1 — Critical",
    shortTitle: "Phase 1",
    status: "Blocker Fixes",
    duration: "~3–5 days",
    badgeColor:
      "bg-red-500/10 text-red-500 border-red-500/20 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30",
    icon: ShieldAlert,
  },
  {
    number: 2,
    title: "Phase 2 — Core",
    shortTitle: "Phase 2",
    status: "Core Features",
    duration: "~5–7 days",
    badgeColor:
      "bg-indigo-500/10 text-indigo-500 border-indigo-500/20 dark:bg-indigo-500/20 dark:text-indigo-400 dark:border-indigo-500/30",
    icon: Settings,
  },
  {
    number: 3,
    title: "Phase 3 — Quality",
    shortTitle: "Phase 3",
    status: "Stabilization & QA",
    duration: "~4–6 days",
    badgeColor:
      "bg-amber-500/10 text-amber-500 border-amber-500/20 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30",
    icon: Activity,
  },
  {
    number: 4,
    title: "Phase 4 — Polish",
    shortTitle: "Phase 4",
    status: "Meta Tuning",
    duration: "~2–3 days",
    badgeColor:
      "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30",
    icon: Sparkles,
  },
]

interface Props {
  user?: any
}

export function ImplementationPlanClient({ user: _user }: Props) {
  const [activeTab, setActiveTab] = useState<string>("1")
  const [checkedTasks, setCheckedTasks] = useState<string[]>([])
  const [mounted, setMounted] = useState<boolean>(false)

  // Initialize checked items from LocalStorage
  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem("phaglp_implementation_progress")
    if (stored) {
      try {
        setCheckedTasks(JSON.parse(stored))
      } catch (e) {
        console.error("Failed to parse stored implementation progress.", e)
      }
    }
  }, [])

  // Persist checked items
  const persistChecked = (newChecked: string[]) => {
    setCheckedTasks(newChecked)
    localStorage.setItem("phaglp_implementation_progress", JSON.stringify(newChecked))
  }

  // Toggle checklist item
  const toggleTask = (taskId: string, taskTitle: string) => {
    const isCurrentlyChecked = checkedTasks.includes(taskId)
    let updated: string[]

    if (isCurrentlyChecked) {
      updated = checkedTasks.filter((id) => id !== taskId)
      toast.info(`Marked "${taskTitle}" as incomplete.`)
    } else {
      updated = [...checkedTasks, taskId]
      toast.success(`Completed task: "${taskTitle}"!`)
    }

    persistChecked(updated)

    // Optional congratulations when a phase is complete
    if (!isCurrentlyChecked) {
      const taskObj = ALL_TASKS.find((t) => t.id === taskId)
      if (taskObj) {
        const phaseTasks = ALL_TASKS.filter((t) => t.phase === taskObj.phase)
        const isPhaseComplete = phaseTasks.every((t) => t.id === taskId || updated.includes(t.id))
        if (isPhaseComplete) {
          toast.success(`🎉 Phase ${taskObj.phase} has been fully completed! Spectacular job!`, {
            duration: 5000,
          })
        }
      }
    }
  }

  // Complete entire current phase
  const completePhase = (phaseNum: number) => {
    const phaseTasks = ALL_TASKS.filter((t) => t.phase === phaseNum).map((t) => t.id)
    const uniqueChecked = Array.from(new Set([...checkedTasks, ...phaseTasks]))
    persistChecked(uniqueChecked)
    toast.success(`Completed all tasks in Phase ${phaseNum}!`)
  }

  // Reset entire current phase
  const resetPhase = (phaseNum: number) => {
    const phaseTasks = ALL_TASKS.filter((t) => t.phase === phaseNum).map((t) => t.id)
    const updated = checkedTasks.filter((id) => !phaseTasks.includes(id))
    persistChecked(updated)
    toast.info(`Reset progress for Phase ${phaseNum}.`)
  }

  // Complete everything
  const completeAll = () => {
    const allIds = ALL_TASKS.map((t) => t.id)
    persistChecked(allIds)
    toast.success("Completed all tasks across the entire roadmap! Ready for launch!")
  }

  // Reset everything
  const resetAll = () => {
    persistChecked([])
    toast.info("Implementation progress has been fully reset.")
  }

  // Computations
  const totalTasksCount = ALL_TASKS.length
  const completedTasksCount = checkedTasks.filter((id) => ALL_TASKS.some((t) => t.id === id)).length
  const progressPercent =
    totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0

  const getPhaseTasksCount = (phaseNum: number) =>
    ALL_TASKS.filter((t) => t.phase === phaseNum).length
  const getPhaseCompletedCount = (phaseNum: number) =>
    checkedTasks.filter((id) => ALL_TASKS.some((t) => t.phase === phaseNum && t.id === id)).length
  const getPhasePercent = (phaseNum: number) => {
    const total = getPhaseTasksCount(phaseNum)
    return total > 0 ? Math.round((getPhaseCompletedCount(phaseNum) / total) * 100) : 0
  }

  if (!mounted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary border-r-2" />
        <p className="text-muted-foreground text-xs font-semibold">
          Loading Implementation Canvas...
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b pb-6 bg-white/20 dark:bg-slate-900/10 p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-bold tracking-tight py-0.5 px-3 rounded-full">
              Platform Engineering
            </Badge>
            <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
              <Timer className="w-3.5 h-3.5" />
              Roadmap Active
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
            PHAGLP — implementation plan
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            Based on FreshNextJS guidelines audit · Next.js 15 · TypeScript strict · Prisma +
            Auth.js v5
          </p>
        </div>

        {/* Global Controls */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={resetAll}
            disabled={completedTasksCount === 0}
            className="rounded-xl text-xs gap-1 border-red-500/20 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 font-semibold"
          >
            <RotateCcw className="w-3 h-3" />
            Reset Progress
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={completeAll}
            disabled={completedTasksCount === totalTasksCount}
            className="rounded-xl text-xs gap-1 border-emerald-500/20 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-emerald-600 font-semibold"
          >
            <Check className="w-3 h-3" />
            Complete All
          </Button>
        </div>
      </div>

      {/* Progress Section */}
      <Card className="bg-white/80 dark:bg-slate-900/60 border-slate-200/60 dark:border-slate-800/80 shadow-md backdrop-blur-sm rounded-3xl overflow-hidden relative group">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-24 h-24 bg-primary/5 rounded-full blur-2xl animate-pulse" />
        <CardContent className="p-6 md:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg font-bold flex items-center gap-1.5">
                <Activity className="w-5 h-5 text-primary animate-pulse" />
                Overall Roadmap Progress
              </CardTitle>
              <CardDescription className="text-xs">
                Check off structural engineering components dynamically. Your session progress is
                saved.
              </CardDescription>
            </div>
            <div className="text-right shrink-0">
              <span className="text-2xl font-black text-primary tracking-tight">
                {progressPercent}%
              </span>
              <p className="text-xs text-muted-foreground font-semibold">
                {completedTasksCount} / {totalTasksCount} done
              </p>
            </div>
          </div>

          <div className="relative pt-1">
            <Progress
              value={progressPercent}
              className="h-3.5 rounded-full bg-slate-100 dark:bg-slate-800"
            />
            <div className="flex items-center justify-between text-[10px] text-muted-foreground font-semibold mt-2.5 px-1">
              <span>0% Start</span>
              <span>Phase 1 Limit (27%)</span>
              <span>Phase 2 Limit (54%)</span>
              <span>Phase 3 Limit (77%)</span>
              <span>100% Launch Ready</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Tabs Row */}
      <div className="grid grid-cols-2 md:grid-flow-col md:auto-cols-fr gap-2 border p-2 rounded-2xl bg-white/40 dark:bg-slate-900/40">
        {PHASES.map((phase) => {
          const isActive = activeTab === phase.number.toString()
          const percent = getPhasePercent(phase.number)
          const Icon = phase.icon

          return (
            <button
              key={phase.number}
              onClick={() => setActiveTab(phase.number.toString())}
              className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition-all duration-300 font-semibold relative overflow-hidden group ${
                isActive
                  ? "bg-white dark:bg-slate-900 shadow-md border-primary/20 scale-[1.02]"
                  : "border-transparent hover:bg-white/50 dark:hover:bg-slate-900/50 text-muted-foreground"
              }`}
            >
              {/* Completed glow indicator */}
              {percent === 100 && (
                <div className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 rounded-bl-lg" />
              )}

              <div className="flex items-center gap-1.5 mb-1 text-xs">
                <Icon
                  className={`w-4 h-4 ${isActive ? "text-primary animate-pulse" : "opacity-60"}`}
                />
                <span className={isActive ? "text-foreground font-extrabold" : "font-medium"}>
                  {phase.shortTitle}
                </span>
              </div>
              <span className={`text-[10px] uppercase font-bold tracking-wider mb-2 leading-none`}>
                {phase.number === 1
                  ? "Critical"
                  : phase.number === 2
                    ? "Core"
                    : phase.number === 3
                      ? "Quality"
                      : "Polish"}
              </span>

              {/* Individual Phase Progress bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-0.5">
                <div
                  className={`h-full transition-all duration-500 ${
                    percent === 100 ? "bg-emerald-500" : "bg-primary"
                  }`}
                  style={{ width: `${percent}%` }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground mt-1.5 font-bold leading-none">
                {percent}% done
              </span>
            </button>
          )
        })}

        <button
          onClick={() => setActiveTab("overview")}
          className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition-all duration-300 font-semibold relative overflow-hidden ${
            activeTab === "overview"
              ? "bg-white dark:bg-slate-900 shadow-md border-primary/20 scale-[1.02]"
              : "border-transparent hover:bg-white/50 dark:hover:bg-slate-900/50 text-muted-foreground"
          }`}
        >
          <div className="flex items-center gap-1.5 mb-1 text-xs">
            <Trophy
              className={`w-4 h-4 ${activeTab === "overview" ? "text-yellow-500" : "opacity-60"}`}
            />
            <span
              className={
                activeTab === "overview" ? "text-foreground font-extrabold" : "font-medium"
              }
            >
              Overview
            </span>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider mb-2 leading-none">
            Roadmap Stats
          </span>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full" />
          <span className="text-[10px] text-muted-foreground mt-1.5 font-bold leading-none">
            Global Summary
          </span>
        </button>
      </div>

      {/* Tab Panels */}
      {PHASES.map((phase) => {
        if (activeTab !== phase.number.toString()) return null

        const phaseTasks = ALL_TASKS.filter((t) => t.phase === phase.number)
        const completedCount = getPhaseCompletedCount(phase.number)
        const totalCount = getPhaseTasksCount(phase.number)
        const isPhaseFullyDone = completedCount === totalCount

        return (
          <div key={phase.number} className="space-y-6">
            {/* Phase Info Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-50 border border-slate-200/60 dark:bg-slate-900/30 dark:border-slate-800/80 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
              <div className="flex items-center gap-3">
                <span className="relative flex h-3.5 w-3.5">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${phase.number === 1 ? "bg-red-400" : phase.number === 2 ? "bg-indigo-400" : phase.number === 3 ? "bg-amber-400" : "bg-emerald-400"}`}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-3.5 w-3.5 ${phase.number === 1 ? "bg-red-500" : phase.number === 2 ? "bg-indigo-500" : phase.number === 3 ? "bg-amber-500" : "bg-emerald-500"}`}
                  />
                </span>
                <div>
                  <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                    {phase.title}
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-bold py-0.5 rounded-full ${phase.badgeColor}`}
                    >
                      {phase.status}
                    </Badge>
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {phase.number === 1
                      ? "Fix immediately — security, auth, and data integrity issues. Block deploy until done."
                      : phase.number === 2
                        ? "Implement core system features: course module architecture, cognitive matching engine, and CMS controls."
                        : phase.number === 3
                          ? "Perform Vitest, E2E checks, eliminate TypeScript flags, and guarantee maximum lighthouse score."
                          : "Refine CSS variables, Framer transitions, Arabic RTL grids, manifest settings, and release standalone checks."}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
                <Badge variant="secondary" className="text-xs font-semibold py-1 px-3 rounded-full">
                  {phase.duration}
                </Badge>
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => resetPhase(phase.number)}
                    disabled={completedCount === 0}
                    title="Reset Phase Tasks"
                    className="h-8 w-8 hover:bg-slate-200 dark:hover:bg-slate-800 text-muted-foreground rounded-lg"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => completePhase(phase.number)}
                    disabled={isPhaseFullyDone}
                    title="Complete Phase Tasks"
                    className="h-8 w-8 hover:bg-emerald-50 hover:text-emerald-500 dark:hover:bg-emerald-950/20 text-muted-foreground rounded-lg"
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Task Cards Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              {phaseTasks.map((task) => {
                const isChecked = checkedTasks.includes(task.id)

                return (
                  <div
                    key={task.id}
                    onClick={() => toggleTask(task.id, task.title)}
                    className={`group cursor-pointer rounded-2xl border p-5 transition-all duration-300 flex items-start gap-4 relative overflow-hidden bg-white dark:bg-slate-900 ${
                      isChecked
                        ? "border-emerald-500/30 bg-emerald-500/[0.01] hover:border-emerald-500/50 shadow-sm"
                        : "border-slate-200/60 dark:border-slate-800/80 hover:border-primary/30 hover:bg-slate-50/40 dark:hover:bg-slate-900/40 hover:shadow-md"
                    }`}
                  >
                    {/* Checkbox circle element */}
                    <div className="shrink-0 mt-1">
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                          isChecked
                            ? "bg-emerald-500 border-emerald-500 text-white"
                            : "border-slate-300 dark:border-slate-700 group-hover:border-primary text-transparent"
                        }`}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    </div>

                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2.5">
                        <h4
                          className={`text-sm font-bold truncate transition-colors leading-tight ${
                            isChecked
                              ? "text-slate-500 dark:text-slate-400 line-through"
                              : "text-foreground"
                          }`}
                        >
                          {task.title}
                        </h4>
                        <Badge
                          variant="outline"
                          className={`text-[9px] shrink-0 font-extrabold uppercase py-0 px-2 rounded-full border-0 leading-none ${
                            task.weight === "Critical"
                              ? "bg-red-500/10 text-red-500 dark:bg-red-500/20"
                              : task.weight === "Major"
                                ? "bg-indigo-500/10 text-indigo-500 dark:bg-indigo-500/20"
                                : "bg-slate-100 text-slate-500 dark:bg-slate-800"
                          }`}
                        >
                          {task.weight}
                        </Badge>
                      </div>
                      <p
                        className={`text-xs leading-relaxed line-clamp-2 ${isChecked ? "text-slate-400 dark:text-slate-500" : "text-muted-foreground"}`}
                      >
                        {task.description}
                      </p>

                      {/* Detail Pill row */}
                      <div className="flex flex-wrap items-center gap-2 pt-2 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                        <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/50 py-0.5 px-2 rounded-md border border-slate-100 dark:border-slate-800/40">
                          <Timer className="w-3 h-3 text-primary opacity-70" />
                          {task.duration}
                        </span>
                        <span className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800/50 py-0.5 px-2 rounded-md border border-slate-100 dark:border-slate-800/40">
                          {task.impact}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      {/* Overview Panel */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Health Stats Banner */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white/80 dark:bg-slate-900/60 border-slate-200/60 dark:border-slate-800/80 shadow-sm rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  System Health Score
                </CardTitle>
                <Trophy className="w-4.5 h-4.5 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-foreground">A+</div>
                <p className="text-xs text-muted-foreground mt-1">Excellent compliance status</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-slate-900/60 border-slate-200/60 dark:border-slate-800/80 shadow-sm rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Active Safe Guards
                </CardTitle>
                <Lock className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-foreground">6 / 6</div>
                <p className="text-xs text-muted-foreground mt-1">Phase 1 defenses deployed</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-slate-900/60 border-slate-200/60 dark:border-slate-800/80 shadow-sm rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500" />
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Estimated Delivery
                </CardTitle>
                <Timer className="w-4.5 h-4.5 text-indigo-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-foreground">~14-21</div>
                <p className="text-xs text-muted-foreground mt-1">Days total estimated scope</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-slate-900/60 border-slate-200/60 dark:border-slate-800/80 shadow-sm rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500" />
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Checklist Complete
                </CardTitle>
                <CheckCircle2 className="w-4.5 h-4.5 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-foreground">
                  {completedTasksCount}{" "}
                  <span className="text-lg text-muted-foreground font-normal">
                    / {totalTasksCount}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Dynamic live progress index</p>
              </CardContent>
            </Card>
          </div>

          {/* Interactive Timeline */}
          <Card className="bg-white/80 dark:bg-slate-900/60 border-slate-200/60 dark:border-slate-800/80 shadow-md rounded-3xl p-6 md:p-8">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-1.5">
              <GitBranch className="w-5 h-5 text-primary" />
              Interactive Timeline Roadmap
            </h3>

            <div className="space-y-6 md:space-y-0 md:grid md:grid-cols-4 gap-6 relative">
              {/* Desktop timeline line */}
              <div className="hidden md:block absolute top-[21px] left-[15%] right-[15%] h-0.5 bg-slate-200 dark:bg-slate-800 -z-10" />

              {PHASES.map((p) => {
                const percent = getPhasePercent(p.number)
                const isFullyComplete = percent === 100
                const isStarted = percent > 0

                return (
                  <div
                    key={p.number}
                    className="relative flex md:flex-col items-start gap-4 md:gap-0 md:text-center md:items-center"
                  >
                    {/* Phase Circle Node */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border font-bold text-sm shrink-0 md:mb-4 transition-all duration-300 ${
                        isFullyComplete
                          ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                          : isStarted
                            ? "bg-primary border-primary text-white shadow-md"
                            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-muted-foreground"
                      }`}
                    >
                      {isFullyComplete ? <Check className="w-5 h-5 stroke-[3]" /> : p.number}
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider block">
                        Phase {p.number}
                      </span>
                      <h4 className="text-sm font-bold text-foreground leading-tight">
                        {p.title.split("—")[1].trim()}
                      </h4>
                      <p className="text-[11px] text-muted-foreground font-semibold uppercase">
                        {p.duration}
                      </p>
                      <div className="mt-1.5 flex items-center justify-start md:justify-center gap-1 text-[10px]">
                        <span
                          className={`font-black ${
                            isFullyComplete
                              ? "text-emerald-500"
                              : isStarted
                                ? "text-primary"
                                : "text-slate-400"
                          }`}
                        >
                          {percent}%
                        </span>
                        <span className="text-slate-300 dark:text-slate-700">•</span>
                        <span className="text-muted-foreground">
                          {getPhaseCompletedCount(p.number)} done
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Tech Spec Box */}
          <Card className="bg-white/80 dark:bg-slate-900/60 border-slate-200/60 dark:border-slate-800/80 shadow-md rounded-3xl p-6 md:p-8">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-1.5">
              <Database className="w-5 h-5 text-indigo-500" />
              Technical Stack & Compliance Auditing
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed mb-6">
              The PHAGLP Platform incorporates rigorous structural auditing, aligning itself with
              strict development rulesets. We employ optimized client engines, strict compilation
              filters, and baseline security validations to establish robust standalone containers.
            </p>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs font-semibold">
              <div className="p-4 rounded-xl border bg-slate-50/50 dark:bg-slate-900/20 space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                  Framework
                </span>
                <p className="text-sm font-black text-foreground">Next.js 15 (App Router)</p>
                <p className="text-[10px] text-muted-foreground leading-tight">
                  Server Components, dynamic Webpack ignore wrappers, edge jose compilation
                  compatibility.
                </p>
              </div>

              <div className="p-4 rounded-xl border bg-slate-50/50 dark:bg-slate-900/20 space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                  Type Safety
                </span>
                <p className="text-sm font-black text-foreground">TypeScript strict mode</p>
                <p className="text-[10px] text-muted-foreground leading-tight">
                  Elimination of implicit parameters, robust helper utilities, clean local imports,
                  zero build warning overrides.
                </p>
              </div>

              <div className="p-4 rounded-xl border bg-slate-50/50 dark:bg-slate-900/20 space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                  Authentication
                </span>
                <p className="text-sm font-black text-foreground">Auth.js v5 (NextAuth)</p>
                <p className="text-[10px] text-muted-foreground leading-tight">
                  httpOnly session tokens, redirect error propagation hooks, robust salt password
                  hashing schemes.
                </p>
              </div>

              <div className="p-4 rounded-xl border bg-slate-50/50 dark:bg-slate-900/20 space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                  Database layer
                </span>
                <p className="text-sm font-black text-foreground">Prisma Client & SQLite</p>
                <p className="text-[10px] text-muted-foreground leading-tight">
                  Optimized relation mappings, indexed user tier scopes, baseline migration setups,
                  singleton instances.
                </p>
              </div>

              <div className="p-4 rounded-xl border bg-slate-50/50 dark:bg-slate-900/20 space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                  Container Staging
                </span>
                <p className="text-sm font-black text-foreground">Docker Standalone Runner</p>
                <p className="text-[10px] text-muted-foreground leading-tight">
                  Prepackaged local CLI builders, standalone node configs, container healthcheck
                  monitoring modules.
                </p>
              </div>

              <div className="p-4 rounded-xl border bg-slate-50/50 dark:bg-slate-900/20 space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                  Testing Suite
                </span>
                <p className="text-sm font-black text-foreground">Vitest & Playwright</p>
                <p className="text-[10px] text-muted-foreground leading-tight">
                  Unit logic validators, automated browser regression tests, E2E checkouts,
                  multi-browser configurations.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
