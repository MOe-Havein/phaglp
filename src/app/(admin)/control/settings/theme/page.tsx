import { getSiteSettings } from "@/lib/server/site-settings";
import { ThemeSettingsForm } from "./theme-form";

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
      <ThemeSettingsForm
        initialData={{
          primaryColor: s.primaryColor ?? null,
          secondaryColor: s.secondaryColor ?? null,
          backgroundColor: s.backgroundColor ?? null,
          textColor: s.textColor ?? null,
          enableAdminTheme: s.enableAdminTheme ?? null,
          adminPrimaryColor: s.adminPrimaryColor ?? null,
          adminSecondaryColor: s.adminSecondaryColor ?? null,
          adminBackgroundColor: s.adminBackgroundColor ?? null,
          adminTextColor: s.adminTextColor ?? null,
          adminTheme: s.adminTheme ?? "default",
        }}
      />
    </div>
  );
}
