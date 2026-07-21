"use client";
import type { ThemeDashboardData } from "../types";
import { sectionRenderers } from "./sectionRenderers";

type Renderer = (props: { data: ThemeDashboardData }) => React.ReactNode;
const renderers = sectionRenderers as Record<string, Renderer>;

export function DashboardSection({ section, data }: { section: string; data: ThemeDashboardData }) {
  const Renderer = renderers[section];
  if (!Renderer) return <div className="rounded-xl border border-black/10 bg-white p-6">Unknown section: {section}</div>;
  return <Renderer data={data} />;
}
