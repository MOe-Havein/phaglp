import { NextResponse } from "next/server"

// Vercel Deployment states that require alerting
const BUILDING_STATES = ["BUILDING", "INITIALIZING", "QUEUED"]

export interface VercelDeployment {
  id: string
  name: string
  url: string
  state: string
  target: string | null
  createdAt: number
  buildingAt?: number | undefined
  readyAt?: number | undefined
  creator: {
    username: string
    email: string
  }
  meta: {
    githubCommitMessage?: string | undefined
    githubCommitRef?: string | undefined
    githubCommitSha?: string | undefined
    githubCommitAuthorLogin?: string | undefined
  }
  isAlert: boolean
  alertLevel: "critical" | "warning" | "info" | "success"
  durationMs?: number | undefined
}

export interface VercelProject {
  id: string
  name: string
  framework: string | null
  latestDeployment: VercelDeployment | null
  productionStatus: string
  healthScore: number // 0-100
  hasAlerts: boolean
}

export interface MonitorData {
  timestamp: string
  teamId: string
  projects: VercelProject[]
  recentDeployments: VercelDeployment[]
  summary: {
    totalProjects: number
    healthyProjects: number
    alertProjects: number
    buildingCount: number
    errorCount: number
    blockedCount: number
    totalDeployments: number
  }
  alerts: Array<{
    id: string
    severity: "critical" | "warning"
    message: string
    projectName: string
    deploymentId: string
    createdAt: number
  }>
}

function classifyDeployment(state: string): {
  alertLevel: "critical" | "warning" | "info" | "success"
  isAlert: boolean
} {
  if (state === "ERROR" || state === "CANCELED") {
    return { alertLevel: "critical", isAlert: true }
  }
  if (state === "BLOCKED") {
    return { alertLevel: "warning", isAlert: true }
  }
  if (BUILDING_STATES.includes(state)) {
    return { alertLevel: "info", isAlert: false }
  }
  if (state === "READY") {
    return { alertLevel: "success", isAlert: false }
  }
  return { alertLevel: "warning", isAlert: true }
}

function computeHealthScore(deployments: VercelDeployment[]): number {
  if (deployments.length === 0) return 100
  const latest = deployments[0]
  if (!latest) return 100
  if (latest.state === "READY") return 100
  if (latest.state === "BUILDING" || latest.state === "INITIALIZING") return 70
  if (latest.state === "BLOCKED") return 40
  if (latest.state === "ERROR" || latest.state === "CANCELED") return 10
  return 50
}

async function fetchVercelAPI(path: string, teamId?: string): Promise<unknown> {
  const token = process.env.VERCEL_API_TOKEN
  if (!token) throw new Error("VERCEL_API_TOKEN is not set")

  const url = new URL(`https://api.vercel.com${path}`)
  if (teamId) url.searchParams.set("teamId", teamId)

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 30 }, // Cache for 30s
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Vercel API error ${res.status}: ${text}`)
  }
  return res.json()
}

export async function GET() {
  try {
    const token = process.env.VERCEL_API_TOKEN
    if (!token) {
      return NextResponse.json(
        { error: "VERCEL_API_TOKEN not configured" },
        { status: 500 }
      )
    }

    // 1. List all projects
    const projectsRes = (await fetchVercelAPI("/v9/projects?limit=20")) as {
      projects: Array<{
        id: string
        name: string
        framework: string | null
        accountId: string
        latestDeployments?: Array<{
          id: string
          name: string
          url: string
          readyState: string
          target: string | null
          createdAt: number
          buildingAt?: number
          readyAt?: number
          creator?: { username: string; email: string }
          meta?: Record<string, string>
        }>
      }>
    }

    const rawProjects = projectsRes.projects ?? []
    const teamId = rawProjects[0]?.accountId ?? undefined

    // 2. Fetch recent deployments (last 20, all states)
    const deploymentsRes = (await fetchVercelAPI(
      `/v6/deployments?limit=20${teamId ? `&teamId=${teamId}` : ""}`
    )) as {
      deployments: Array<{
        uid: string
        name: string
        url: string
        state: string
        target: string | null
        createdAt: number
        buildingAt?: number
        readyAt?: number
        creator?: { username: string; email: string }
        meta?: Record<string, string>
      }>
    }

    const rawDeployments = deploymentsRes.deployments ?? []

    // 3. Transform deployments
    const allDeployments: VercelDeployment[] = rawDeployments.map((d) => {
      const { alertLevel, isAlert } = classifyDeployment(d.state)
      const dep: VercelDeployment = {
        id: d.uid,
        name: d.name,
        url: d.url,
        state: d.state,
        target: d.target,
        createdAt: d.createdAt,
        creator: {
          username: d.creator?.username ?? "unknown",
          email: d.creator?.email ?? "",
        },
        meta: {},
        isAlert,
        alertLevel,
      }
      if (d.buildingAt !== undefined) dep.buildingAt = d.buildingAt
      if (d.readyAt !== undefined) dep.readyAt = d.readyAt
      if (d.meta?.githubCommitMessage) dep.meta.githubCommitMessage = d.meta.githubCommitMessage
      if (d.meta?.githubCommitRef) dep.meta.githubCommitRef = d.meta.githubCommitRef
      if (d.meta?.githubCommitSha) dep.meta.githubCommitSha = d.meta.githubCommitSha
      if (d.meta?.githubCommitAuthorLogin) dep.meta.githubCommitAuthorLogin = d.meta.githubCommitAuthorLogin
      if (d.readyAt && d.buildingAt) dep.durationMs = d.readyAt - d.buildingAt
      return dep
    })

    // 4. Transform projects
    const projects: VercelProject[] = rawProjects.map((p) => {
      const latestRaw = p.latestDeployments?.[0]
      let latestDeployment: VercelDeployment | null = null

      if (latestRaw) {
        const { alertLevel, isAlert } = classifyDeployment(
          latestRaw.readyState
        )
        const built: VercelDeployment = {
          id: latestRaw.id,
          name: latestRaw.name,
          url: latestRaw.url,
          state: latestRaw.readyState,
          target: latestRaw.target,
          createdAt: latestRaw.createdAt,
          creator: {
            username: latestRaw.creator?.username ?? "unknown",
            email: latestRaw.creator?.email ?? "",
          },
          meta: {},
          isAlert,
          alertLevel,
        }
        if (latestRaw.buildingAt !== undefined) built.buildingAt = latestRaw.buildingAt
        if (latestRaw.readyAt !== undefined) built.readyAt = latestRaw.readyAt
        if (latestRaw.meta?.githubCommitMessage) built.meta.githubCommitMessage = latestRaw.meta.githubCommitMessage
        if (latestRaw.meta?.githubCommitRef) built.meta.githubCommitRef = latestRaw.meta.githubCommitRef
        if (latestRaw.meta?.githubCommitSha) built.meta.githubCommitSha = latestRaw.meta.githubCommitSha
        if (latestRaw.meta?.githubCommitAuthorLogin) built.meta.githubCommitAuthorLogin = latestRaw.meta.githubCommitAuthorLogin
        latestDeployment = built
      }

      // Collect project-specific deployments from allDeployments
      const projectDeployments = allDeployments.filter((d) => d.name === p.name)

      return {
        id: p.id,
        name: p.name,
        framework: p.framework,
        latestDeployment,
        productionStatus: latestDeployment?.state ?? "UNKNOWN",
        healthScore: computeHealthScore(projectDeployments),
        hasAlerts: latestDeployment?.isAlert ?? false,
      }
    })

    // 5. Build alerts list
    const alerts: MonitorData["alerts"] = []

    allDeployments.forEach((d) => {
      if (!d.isAlert) return
      const severity: "critical" | "warning" =
        d.alertLevel === "critical" ? "critical" : "warning"
      alerts.push({
        id: d.id,
        severity,
        message:
          d.state === "ERROR"
            ? `Build failed for ${d.name}`
            : d.state === "CANCELED"
              ? `Deployment canceled for ${d.name}`
              : d.state === "BLOCKED"
                ? `Deployment blocked for ${d.name} (hobby plan concurrent limit)`
                : `Unexpected state "${d.state}" for ${d.name}`,
        projectName: d.name,
        deploymentId: d.id,
        createdAt: d.createdAt,
      })
    })

    // 6. Summary
    const errorCount = allDeployments.filter((d) => d.state === "ERROR").length
    const blockedCount = allDeployments.filter(
      (d) => d.state === "BLOCKED"
    ).length
    const buildingCount = allDeployments.filter((d) =>
      BUILDING_STATES.includes(d.state)
    ).length
    const alertProjects = projects.filter((p) => p.hasAlerts).length

    const monitorData: MonitorData = {
      timestamp: new Date().toISOString(),
      teamId: teamId ?? "",
      projects,
      recentDeployments: allDeployments,
      summary: {
        totalProjects: projects.length,
        healthyProjects: projects.length - alertProjects,
        alertProjects,
        buildingCount,
        errorCount,
        blockedCount,
        totalDeployments: allDeployments.length,
      },
      alerts: alerts.sort((a, b) => b.createdAt - a.createdAt),
    }

    return NextResponse.json(monitorData, {
      headers: {
        "Cache-Control": "no-store",
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    console.error("[vercel-monitor] Error:", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
