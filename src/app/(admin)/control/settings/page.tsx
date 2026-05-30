import { Settings } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { SettingsForm } from "@/components/control/settings-form"

export const metadata = {
  title: "Site Settings — PHAGLP Control",
}

async function getSettings() {
  try {
    return await prisma.siteSettings.findUnique({ where: { id: "global" } })
  } catch {
    return null
  }
}

export default async function SettingsPage() {
  const settings = await getSettings()

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
          <Settings className="w-4 h-4" />
          <span>Configuration</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
          Site Settings
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Global platform configuration and feature flags.
        </p>
      </div>

      <SettingsForm initialData={settings} />
    </div>
  )
}
