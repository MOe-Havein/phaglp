import type { Metadata } from "next";
import { VercelMonitorDashboard } from "@/components/vercel-monitor/VercelMonitorDashboard";

export const metadata: Metadata = {
  title: "Vercel Deployment Monitor",
  description:
    "Real-time monitoring dashboard for Vercel project deployments with automated failure alerts.",
};

// Revalidate every 30 seconds
export const revalidate = 30;

export default function VercelMonitorPage() {
  return <VercelMonitorDashboard />;
}
