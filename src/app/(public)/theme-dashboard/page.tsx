import { DashboardShell } from "@/theme-dashboard/components/DashboardShell";
import { dashboardData } from "@/theme-dashboard/data";

export const metadata = {
  title: "Theme Management — Implementation Dashboard",
  description: "Interactive artifact for PHAGLP theme system implementation.",
};

export default function ThemeDashboardPage() {
  return (
    <DashboardShell data={dashboardData} />
  );
}
