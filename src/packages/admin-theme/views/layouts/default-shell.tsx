"use client";

import { ThemeColorProvider } from "@/components/ui/theme-color-provider";
import { ControlSidebar } from "@/components/control/ControlSidebar";
import { AdminThemeAssets } from "@/packages/admin-theme/views/layouts/admin-theme-assets";

type Props = {
  children: React.ReactNode;
  userName: string | null;
  themeColors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  themeId: string;
};

export function DefaultAdminShell({
  children,
  userName,
  themeColors,
  themeId,
}: Props) {
  return (
    <ThemeColorProvider initial={themeColors}>
      <AdminThemeAssets themeId={themeId} />
      <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-background text-text">
        <ControlSidebar userName={userName} />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 md:p-8 max-w-screen-2xl mx-auto">{children}</div>
        </main>
      </div>
    </ThemeColorProvider>
  );
}
