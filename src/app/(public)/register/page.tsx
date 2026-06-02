import { prisma } from "@/lib/prisma"
import { RegisterForm } from "@/components/auth/register-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldAlert, MessageCircle } from "lucide-react"
import Link from "next/link"

// Ensure dynamic rendering to read database configuration
export const dynamic = "force-dynamic"

export default async function RegisterPage() {
  let allowRegistration = true
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "global" },
      select: { allowRegistration: true },
    })
    if (settings) {
      allowRegistration = settings.allowRegistration
    }
  } catch (error) {
    console.error("Failed to query registration site settings:", error)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors duration-500">
      {allowRegistration ? (
        <RegisterForm />
      ) : (
        <Card className="w-full max-w-md shadow-xl border-t-4 border-t-red-500 animate-in fade-in zoom-in duration-500 bg-white dark:bg-slate-900 border-slate-200/60 dark:border-slate-800">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-xl flex items-center justify-center shadow-lg">
                <ShieldAlert className="w-6 h-6 text-red-600 dark:text-red-500" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Registration Closed
            </CardTitle>
            <CardDescription>Public enrollment is currently paused.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              We are currently not accepting new public member signups at this time. If you already have an account, you can log in below.
            </p>

            <div className="flex flex-col gap-2 pt-2">
              <Link
                href="/login"
                className="inline-flex items-center justify-center w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Go to Login
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Contact Support
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
