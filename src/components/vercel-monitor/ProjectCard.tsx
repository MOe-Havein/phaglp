"use client";

import type { VercelProject } from "@/app/api/vercel-monitor/route";
import { StatusBadge } from "./StatusBadge";

interface ProjectCardProps {
  project: VercelProject;
}

function HealthRing({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 20;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? "#34d399" : score >= 50 ? "#f59e0b" : "#ef4444";

  return (
    <div className="relative w-14 h-14 flex-shrink-0">
      <svg className="-rotate-90" width="56" height="56" viewBox="0 0 56 56">
        <circle
          cx="28"
          cy="28"
          r="20"
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="4"
        />
        <circle
          cx="28"
          cy="28"
          r="20"
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease, stroke 0.5s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold" style={{ color }}>
          {score}
        </span>
      </div>
    </div>
  );
}

export function ProjectCard({ project }: ProjectCardProps) {
  const dep = project.latestDeployment;
  const commitMsg = dep?.meta?.githubCommitMessage?.split("\n")[0] ?? null;
  const commitRef = dep?.meta?.githubCommitRef ?? null;
  const commitSha = dep?.meta?.githubCommitSha?.slice(0, 7) ?? null;
  const author =
    dep?.meta?.githubCommitAuthorLogin ?? dep?.creator?.username ?? null;

  const frameworkIcons: Record<string, string> = {
    nextjs: "▲",
    nuxtjs: "△",
    react: "⚛",
    vue: "◆",
    svelte: "◉",
    gatsby: "◈",
    astro: "✦",
  };

  const frameworkIcon = project.framework
    ? (frameworkIcons[project.framework] ?? "⬡")
    : "⬡";

  return (
    <div
      className={`relative rounded-2xl border p-5 transition-all duration-300 hover:scale-[1.01]
        ${
          project.hasAlerts
            ? "bg-red-950/20 border-red-500/25 shadow-lg shadow-red-500/5 hover:border-red-400/35"
            : "bg-white/[0.025] border-white/10 hover:bg-white/[0.04] hover:border-white/20"
        }`}
    >
      {/* Alert pulse overlay */}
      {project.hasAlerts && (
        <div className="absolute inset-0 rounded-2xl bg-red-500/5 animate-pulse pointer-events-none" />
      )}

      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          {/* Framework icon */}
          <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-lg flex-shrink-0">
            {frameworkIcon}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-white/90 truncate text-sm leading-tight">
              {project.name}
            </h3>
            <p className="text-[10px] text-white/35 mt-0.5 capitalize">
              {project.framework ?? "Unknown framework"}
            </p>
          </div>
        </div>
        <HealthRing score={project.healthScore} />
      </div>

      {/* Status */}
      <div className="flex items-center justify-between mb-4">
        <StatusBadge state={project.productionStatus} />
        {project.hasAlerts && (
          <span className="text-xs text-red-400 font-medium flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            Alert
          </span>
        )}
      </div>

      {/* Latest commit */}
      {commitMsg && (
        <div className="rounded-lg bg-white/[0.04] border border-white/[0.06] p-3 space-y-2">
          <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">
            {commitMsg}
          </p>
          <div className="flex items-center gap-3 text-[10px] text-white/30">
            {commitRef && (
              <span className="flex items-center gap-1">
                <svg
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                {commitRef}
              </span>
            )}
            {commitSha && <span className="font-mono">{commitSha}</span>}
            {author && <span>@{author}</span>}
          </div>
        </div>
      )}

      {/* Deployment URL */}
      {dep?.url && (
        <a
          href={`https://${dep.url}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center gap-1.5 text-[11px] text-violet-400/70 hover:text-violet-300 transition-colors truncate"
        >
          <svg
            className="w-3 h-3 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
          <span className="truncate">{dep.url}</span>
        </a>
      )}
    </div>
  );
}
