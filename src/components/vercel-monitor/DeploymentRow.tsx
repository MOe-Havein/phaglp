"use client";

import type { VercelDeployment } from "@/app/api/vercel-monitor/route";
import { StatusBadge } from "./StatusBadge";

interface DeploymentRowProps {
  deployment: VercelDeployment;
}

function formatDuration(ms: number): string {
  if (ms < 60_000) return `${Math.round(ms / 1000)}s`;
  const mins = Math.floor(ms / 60_000);
  const secs = Math.round((ms % 60_000) / 1000);
  return `${mins}m ${secs}s`;
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

export function DeploymentRow({ deployment: dep }: DeploymentRowProps) {
  const commitMsg = dep.meta?.githubCommitMessage?.split("\n")[0];
  const commitSha = dep.meta?.githubCommitSha?.slice(0, 7);
  const author = dep.meta?.githubCommitAuthorLogin ?? dep.creator.username;

  return (
    <div
      className={`flex items-start gap-4 px-5 py-4 hover:bg-white/[0.03] transition-colors duration-150
        ${dep.isAlert ? "bg-red-500/5" : ""}`}
    >
      {/* State indicator dot */}
      <div className="flex-shrink-0 mt-1">
        <StatusBadge state={dep.state} />
      </div>

      {/* Main info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="min-w-0">
            <span className="text-sm font-medium text-white/80">
              {dep.name}
            </span>
            {dep.target && (
              <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded-md bg-violet-500/15 text-violet-400 border border-violet-500/20">
                {dep.target}
              </span>
            )}
          </div>
          <span className="text-xs text-white/30 flex-shrink-0">
            {timeAgo(dep.createdAt)}
          </span>
        </div>

        {commitMsg && (
          <p className="text-xs text-white/40 truncate mt-1">{commitMsg}</p>
        )}

        <div className="flex flex-wrap items-center gap-4 mt-2 text-[10px] text-white/25">
          {commitSha && (
            <span className="font-mono bg-white/5 px-1.5 py-0.5 rounded">
              {commitSha}
            </span>
          )}
          {dep.meta?.githubCommitRef && (
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
              {dep.meta.githubCommitRef}
            </span>
          )}
          {author && <span>@{author}</span>}
          {dep.durationMs !== undefined && (
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {formatDuration(dep.durationMs)}
            </span>
          )}
          <a
            href={`https://${dep.url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-violet-400/50 hover:text-violet-300 transition-colors flex items-center gap-1"
          >
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
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            Open
          </a>
        </div>
      </div>
    </div>
  );
}
