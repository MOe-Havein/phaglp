"use client";
import { useState } from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardSection } from "./DashboardSection";

export function DashboardShell({ data }: { data: import("../types").ThemeDashboardData }) {
  const [section, setSection] = useState("file-scan");
  return (
    <div className="flex min-h-[100svh] bg-[var(--surface-container-low,#f8f9ff)] text-[var(--on-surface,#181c22)]">
      <noscript>
        <div className="p-6 text-sm text-[var(--on-surface-variant,#424654)]">
          Enable JavaScript to navigate the Theme Management Implementation Dashboard.
        </div>
      </noscript>
      <DashboardSidebar current={section} onChange={setSection} />
      <main className="flex-1 overflow-auto p-6 md:p-8">
        <DashboardSection key={section} section={section} data={data} />
      </main>
    </div>
  );
}
