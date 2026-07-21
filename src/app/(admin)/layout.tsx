import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Role } from "@prisma/client";
import { ControlSidebar } from "@/components/control/ControlSidebar";
import { getSiteSettings } from "@/lib/server/site-settings";
import { normalizeThemeColors } from "@/lib/get-theme-colors";
import { ThemeColorProvider } from "@/components/ui/theme-color-provider";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== Role.ADMIN) {
    redirect("/dashboard");
  }

  const siteConfig = await getSiteSettings();
  const colors = normalizeThemeColors({
    primaryColor: siteConfig.adminPrimaryColor ?? siteConfig.primaryColor,
    secondaryColor: siteConfig.adminSecondaryColor ?? siteConfig.secondaryColor,
    backgroundColor:
      siteConfig.adminBackgroundColor ?? siteConfig.backgroundColor,
    textColor: siteConfig.adminTextColor ?? siteConfig.textColor,
  });

  return (
    <ThemeColorProvider initial={colors}>
      <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-background text-text">
        <ControlSidebar userName={session.user.name ?? null} />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 md:p-8 max-w-screen-2xl mx-auto">{children}</div>
        </main>
      </div>
    </ThemeColorProvider>
  );
}
