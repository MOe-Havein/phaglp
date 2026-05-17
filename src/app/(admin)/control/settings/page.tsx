import { auth } from "@/auth"
import { Role } from "@prisma/client"
import { redirect } from "next/navigation"
import prisma, { serializePrisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SettingsForm } from "@/components/control/settings-form"
import { FeaturesList } from "@/components/control/features-list"
import { ShieldCheck, Settings, Flag } from "lucide-react"

export default async function AdminSettingsPage() {
  const session = await auth()

  if (session?.user?.role !== Role.ADMIN) {
    redirect("/login")
  }

  const [settings, flags] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: "global" } }),
    prisma.featureFlag.findMany({ orderBy: { key: "asc" } }),
  ])

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex items-center gap-4 border-b pb-6">
        <div className="p-3 bg-primary/10 rounded-xl">
          <ShieldCheck className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Nerve Center</h1>
          <p className="text-muted-foreground">
            Manage platform settings, feature flags, and global configuration.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-primary/10 shadow-sm">
            <CardHeader className="flex flex-row items-center gap-4">
              <Settings className="w-5 h-5 text-primary" />
              <div>
                <CardTitle>Site Configuration</CardTitle>
                <CardDescription>Branding, SEO, and maintenance mode settings.</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <SettingsForm initialData={serializePrisma(settings)} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="border-primary/10 shadow-sm">
            <CardHeader className="flex flex-row items-center gap-4">
              <Flag className="w-5 h-5 text-primary" />
              <div>
                <CardTitle>Feature Flags</CardTitle>
                <CardDescription>Enable or disable beta features instantly.</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <FeaturesList initialFlags={serializePrisma(flags)} />
            </CardContent>
          </Card>

          <Card className="bg-primary text-primary-foreground overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <ShieldCheck className="w-24 h-24" />
            </div>
            <CardHeader>
              <CardTitle>Security Status</CardTitle>
              <CardDescription className="text-primary-foreground/70">
                System is running on Next.js 15.5
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">
                All administrative actions are logged in the audit trail.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
