import { getSiteSettings } from "@/lib/server/site-settings";
import { SettingsForm } from "@/components/control/settings-form";

export default async function AdminThemeSettingsPage() {
  const s = await getSiteSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Theme Settings</h1>
        <p className="text-muted-foreground">
          Manage public and admin theme colors.
        </p>
      </div>
      <SettingsForm
        initialData={{
          siteName: s.siteName,
          siteUrl: s.siteUrl,
          description: s.description ?? "",
          maintenanceMode: s.maintenanceMode,
          allowRegistration: s.allowRegistration ?? false,
          enableGoogleAnalytics: s.enableGoogleAnalytics ?? false,
          enableAdminTheme: s.enableAdminTheme ?? null,
          googleAnalyticsId: s.googleAnalyticsId ?? "",
          metaTitle: s.metaTitle ?? "",
          metaDescription: s.metaDescription ?? "",
          primaryColor: s.primaryColor ?? "",
          secondaryColor: s.secondaryColor ?? "",
          backgroundColor: s.backgroundColor ?? "",
          textColor: s.textColor ?? "",
          adminPrimaryColor: s.adminPrimaryColor ?? "",
          adminSecondaryColor: s.adminSecondaryColor ?? "",
          adminBackgroundColor: s.adminBackgroundColor ?? "",
          adminTextColor: s.adminTextColor ?? "",
          fullAddress: s.fullAddress ?? "",
          logoUrl: s.logoUrl ?? "",
          ogImage: s.ogImage ?? "",
          faviconUrl: s.faviconUrl ?? "",
        }}
      />
    </div>
  );
}
