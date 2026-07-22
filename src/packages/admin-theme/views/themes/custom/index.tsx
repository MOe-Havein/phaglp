"use client";

import { ThemeColorProvider } from "@/components/ui/theme-color-provider";
import { ControlSidebar } from "@/components/control/ControlSidebar";

type Props = {
  children: React.ReactNode;
  userName: string | null;
  themeColors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
};

export function CustomAdminShell({ children, userName, themeColors }: Props) {
  return (
    <ThemeColorProvider initial={themeColors}>
      <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-background text-text">
        <ControlSidebar
          userName={userName}
          aria-label="Custom admin navigation"
        />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl p-6 md:p-10 space-y-8">
            {children}
          </div>
        </main>
      </div>
    </ThemeColorProvider>
  );
}
