import { prisma } from '@/lib/prisma';
import { SettingsForm } from '@/components/control/settings-form';

export const metadata = {
  title: 'Theme Settings — PHAGLP Control',
};

async function getSettings() {
  try {
    return await prisma.siteSettings.findUnique({ where: { id: 'global' } });
  } catch {
    return null;
  }
}

export default async function AdminThemePage() {
  const settings = await getSettings();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
          Theme Settings
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage public theme colors and optional admin panel overrides.
        </p>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Note: this route currently uses the shared full-settings save flow, so saving here also persists non-theme fields.
        </p>
      </div>

      <SettingsForm initialData={settings} />
    </div>
  );
}
