"use client";

import type { MonitorData } from "@/app/api/vercel-monitor/route";

interface SummaryStatsProps {
  summary: MonitorData["summary"];
}

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  highlight?: "success" | "danger" | "warning" | "neutral" | "info";
}

function StatCard({
  label,
  value,
  icon,
  highlight = "neutral",
}: StatCardProps) {
  const colors = {
    success: {
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      text: "text-emerald-400",
      value: "text-emerald-300",
    },
    danger: {
      bg: value > 0 ? "bg-red-500/15" : "bg-white/[0.025]",
      border: value > 0 ? "border-red-500/30" : "border-white/10",
      text: value > 0 ? "text-red-400" : "text-white/30",
      value: value > 0 ? "text-red-300" : "text-white/60",
    },
    warning: {
      bg: value > 0 ? "bg-orange-500/10" : "bg-white/[0.025]",
      border: value > 0 ? "border-orange-500/25" : "border-white/10",
      text: value > 0 ? "text-orange-400" : "text-white/30",
      value: value > 0 ? "text-orange-300" : "text-white/60",
    },
    info: {
      bg: value > 0 ? "bg-blue-500/10" : "bg-white/[0.025]",
      border: value > 0 ? "border-blue-500/20" : "border-white/10",
      text: value > 0 ? "text-blue-400" : "text-white/30",
      value: value > 0 ? "text-blue-300" : "text-white/60",
    },
    neutral: {
      bg: "bg-white/[0.025]",
      border: "border-white/10",
      text: "text-white/40",
      value: "text-white/80",
    },
  };

  const c = colors[highlight];

  return (
    <div
      className={`rounded-2xl border p-4 flex items-center gap-4 transition-all duration-300 hover:scale-[1.02]
        ${c.bg} ${c.border}`}
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 ${c.text}`}
      >
        {icon}
      </div>
      <div>
        <p
          className={`text-[11px] uppercase tracking-wider font-medium ${c.text}`}
        >
          {label}
        </p>
        <p className={`text-2xl font-bold leading-none mt-0.5 ${c.value}`}>
          {value}
        </p>
      </div>
    </div>
  );
}

export function SummaryStats({ summary }: SummaryStatsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      <StatCard
        label="Projects"
        value={summary.totalProjects}
        highlight="neutral"
        icon={
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
            />
          </svg>
        }
      />
      <StatCard
        label="Healthy"
        value={summary.healthyProjects}
        highlight="success"
        icon={
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        }
      />
      <StatCard
        label="Alerts"
        value={summary.alertProjects}
        highlight="danger"
        icon={
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        }
      />
      <StatCard
        label="Building"
        value={summary.buildingCount}
        highlight="info"
        icon={
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
            />
          </svg>
        }
      />
      <StatCard
        label="Errors"
        value={summary.errorCount}
        highlight="danger"
        icon={
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        }
      />
      <StatCard
        label="Blocked"
        value={summary.blockedCount}
        highlight="warning"
        icon={
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
            />
          </svg>
        }
      />
    </div>
  );
}
