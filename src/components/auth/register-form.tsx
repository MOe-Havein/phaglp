"use client"

import { registerUser } from "@/lib/auth-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Sparkles, Mail, Lock, User, ArrowRight } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export function RegisterForm() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const result = await registerUser({ name, email, password })
      if (!result.success) {
        setError(result.error || "Registration failed")
      } else {
        // Success! Redirect to dashboard as they are now auto-logged in
        router.push("/dashboard")
        router.refresh()
      }
    } catch (err) {
      setError("An unexpected error occurred.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md shadow-xl border-t-4 border-t-primary animate-in fade-in zoom-in duration-500 bg-white dark:bg-slate-900 border-slate-200/60 dark:border-slate-800">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Create an Account</CardTitle>
        <CardDescription>Join PHAGLP to access exclusive courses and content</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-md text-center">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="name" className="font-medium text-slate-700 dark:text-slate-300">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                required
                className="pl-10 rounded-xl border-slate-200 dark:border-slate-800"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="font-medium text-slate-700 dark:text-slate-300">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                className="pl-10 rounded-xl border-slate-200 dark:border-slate-800"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="font-medium text-slate-700 dark:text-slate-300">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="pl-10 rounded-xl border-slate-200 dark:border-slate-800"
              />
            </div>
          </div>
          <Button type="submit" className="w-full rounded-xl bg-primary text-white" disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </form>
        <div className="text-center text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Log In
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
