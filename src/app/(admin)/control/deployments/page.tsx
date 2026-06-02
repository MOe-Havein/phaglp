import { DeploymentsDashboard } from "@/components/control/DeploymentsDashboard"

export const metadata = {
  title: "Vercel Deployments — PHAGLP Control Hub",
  description: "Monitor, filter, and inspect Vercel deployments and project builds with real-time metadata.",
}

export default function DeploymentsPage() {
  return <DeploymentsDashboard />
}
