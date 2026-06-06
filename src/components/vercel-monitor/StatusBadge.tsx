"use client"

const STATE_CONFIG: Record<
  string,
  {
    label: string
    bg: string
    text: string
    dot: string
    border: string
    pulse?: boolean
  }
> = {
  READY: {
    label: "Ready",
    bg: "bg-emerald-500/15",
    text: "text-emerald-300",
    dot: "bg-emerald-400",
    border: "border-emerald-500/30",
  },
  BUILDING: {
    label: "Building",
    bg: "bg-blue-500/15",
    text: "text-blue-300",
    dot: "bg-blue-400",
    border: "border-blue-500/30",
    pulse: true,
  },
  INITIALIZING: {
    label: "Initializing",
    bg: "bg-blue-500/15",
    text: "text-blue-300",
    dot: "bg-blue-400",
    border: "border-blue-500/30",
    pulse: true,
  },
  QUEUED: {
    label: "Queued",
    bg: "bg-amber-500/15",
    text: "text-amber-300",
    dot: "bg-amber-400",
    border: "border-amber-500/30",
    pulse: true,
  },
  ERROR: {
    label: "Error",
    bg: "bg-red-500/15",
    text: "text-red-300",
    dot: "bg-red-400",
    border: "border-red-500/30",
  },
  CANCELED: {
    label: "Canceled",
    bg: "bg-red-500/15",
    text: "text-red-300",
    dot: "bg-red-400",
    border: "border-red-500/30",
  },
  BLOCKED: {
    label: "Blocked",
    bg: "bg-orange-500/15",
    text: "text-orange-300",
    dot: "bg-orange-400",
    border: "border-orange-500/30",
  },
  UNKNOWN: {
    label: "Unknown",
    bg: "bg-white/10",
    text: "text-white/40",
    dot: "bg-white/30",
    border: "border-white/10",
  },
}

interface StatusBadgeProps {
  state: string
  small?: boolean
}

export function StatusBadge({ state, small = false }: StatusBadgeProps) {
  const cfg = STATE_CONFIG[state] ?? STATE_CONFIG["UNKNOWN"]!

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium
        ${cfg.bg} ${cfg.text} ${cfg.border}
        ${small ? "text-[10px] px-2 py-0.5" : "text-xs px-2.5 py-1"}`}
    >
      <span className="relative flex">
        {cfg.pulse && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full ${cfg.dot} opacity-75`}
          />
        )}
        <span className={`relative inline-flex rounded-full ${cfg.dot} ${small ? "w-1.5 h-1.5" : "w-2 h-2"}`} />
      </span>
      {cfg.label}
    </span>
  )
}
