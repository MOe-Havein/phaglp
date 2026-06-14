"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      
      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/control");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-900 transition-colors duration-300">
      <div className="w-full max-w-md space-y-6">
        
        {/* Application Branding Header Layer */}
        <div className="flex flex-col items-center space-y-2 text-center">
          <Link href="/" className="flex flex-col items-center gap-2 hover:opacity-95 transition-opacity group">
            <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-white p-2 shadow-sm border border-slate-100 dark:border-slate-800 dark:bg-slate-950">
              <Image
                src="/phaglp-logo.png"
                alt="phaglp"
                fill
                priority
                className="object-contain p-1"
              />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-blue-400">
              {siteConfig.siteName}
            </span>
          </Link>
        </div>

        {/* High-Contrast Interactive Login Form Container */}
        <Card className="shadow-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Sign In
            </CardTitle>
            <CardDescription className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Enter your credentials to access the administrative control panel.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 p-3 text-sm font-medium text-red-700 dark:bg-red-950/20 dark:border-red-900/30 dark:text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  disabled={loading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl border-slate-300 bg-slate-50/50 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100"
                />
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  minLength={6}
                  autoComplete="current-password"
                  disabled={loading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-xl border-slate-300 bg-slate-50/50 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100"
                />
              </div>

              <Button
                type="submit"
                variant="default"
                disabled={loading}
                className="w-full mt-2 font-semibold"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
