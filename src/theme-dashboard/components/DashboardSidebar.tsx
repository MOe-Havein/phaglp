"use client";
const SECTIONS = [
  { id: "file-scan", title: "File Scan" },
  { id: "architecture", title: "Architecture" },
  { id: "database", title: "Database" },
  { id: "file-structure", title: "File Structure" },
  { id: "admin-ui", title: "Admin UI" },
  { id: "server-actions", title: "Server Actions" },
  { id: "preview-diff", title: "Preview Diff" },
  { id: "roadmap", title: "Implementation Phases" },
] as const;

export function DashboardSidebar({ current, onChange }: { current: string; onChange: (id: string) => void }) {
  return (
    <nav
      className="sticky top-0 h-screen w-64 border-r border-[var(--bg-black, transparent)] bg-white/70"
      aria-label="Theme dashboard sections"
    >
      <div className="p-4">
        <h1 className="text-sm font-bold text-[var(--primary,#0056D2)]">Theme Management</h1>
        <p className="text-xs text-[var(--on-surface-variant,#424654)] mt-1">PHAGLP Implementation Artifact</p>
      </div>
      <ul className="m-2 list-none p-0">
        {SECTIONS.map((item) => {
          const active = current === item.id;
          return (
            <li key={item.id} className="px-2 py-1">
              <button
                type="button"
                aria-current={active ? "page" : undefined}
                onClick={() => onChange(item.id)}
                className={
                  "w-full rounded-lg px-3 py-2 text-left text-sm transition " +
                  (active
                    ? "bg-[var(--primary,#0056D2)] text-white shadow"
                    : "text-[var(--on-surface,#181c22)] hover:bg-[var(--surface-container,#ebeef6)]")
                }
              >
                {item.title}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
