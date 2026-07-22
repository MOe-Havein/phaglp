import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Role } from "@prisma/client";
import { adminThemeRegistry } from "@/packages/admin-theme/theme.registry";
import { applyAdminThemeHooks } from "@/packages/admin-theme/theme.provider";
import { DefaultAdminShell } from "@/packages/admin-theme/views/layouts/default-shell";
import { getSiteSettings } from "@/lib/server/site-settings";
import { normalizeThemeColors } from "@/lib/get-theme-colors";

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
  applyAdminThemeHooks(adminThemeRegistry);
  const adminTheme = (siteConfig as any).adminTheme;
  const theme =
    adminThemeRegistry.get(adminTheme ?? "default") ??
    adminThemeRegistry.get("default")!;
  const colors = normalizeThemeColors({
    primaryColor: siteConfig.adminPrimaryColor ?? siteConfig.primaryColor,
    secondaryColor: siteConfig.adminSecondaryColor ?? siteConfig.secondaryColor,
    backgroundColor:
      siteConfig.adminBackgroundColor ?? siteConfig.backgroundColor,
    textColor: siteConfig.adminTextColor ?? siteConfig.textColor,
  });

  const Shell =
    theme.viewsRoot === "default" ? DefaultAdminShell : DefaultAdminShell;

  return (
    <Shell
      userName={session.user.name ?? null}
      themeColors={colors}
      themeId={theme.id}
    >
      {children}
    </Shell>
  );
}
