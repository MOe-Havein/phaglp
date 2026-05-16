"use client"

import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { siteConfig } from "@/config/site"
import { ModeToggle } from "@/components/mode-toggle"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"
import { useSession, signOut } from "next-auth/react"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession()

  return (
    <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Link href="/" className="flex items-center gap-1">
            <Image
              src="/phaglp-logo.png"
              alt="PHAGLP Logo"
              width={64}
              height={64}
              className="h-8 w-auto object-contain"
            />
            <span className="text-xl font-bold text-primary dark:text-blue-400">
              {siteConfig.siteName}
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {siteConfig.navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.title}
            </Link>
          ))}
          <div className="flex items-center gap-2 border-l pl-6 ml-2">
            <ModeToggle />
            {session ? (
              <Button onClick={() => signOut()} className="bg-red-600 text-white hover:bg-red-700">
                Logout
              </Button>
            ) : (
              <>
                <Button
                  asChild
                  variant="outline"
                  className="text-primary border-primary hover:bg-primary/10"
                >
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild className="bg-accent text-white hover:bg-accent/90">
                  <Link href="/register">Register</Link>
                </Button>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div className="flex items-center gap-2 md:hidden">
          <ModeToggle />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle className="text-left text-primary dark:text-blue-400">Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 mt-8">
                {siteConfig.navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-medium text-muted-foreground hover:text-foreground"
                  >
                    {item.title}
                  </Link>
                ))}
                {session ? (
                  <Button
                    onClick={() => {
                      signOut()
                      setIsOpen(false)
                    }}
                    className="bg-red-600 text-white hover:bg-red-700 mt-4"
                  >
                    Logout
                  </Button>
                ) : (
                  <div className="flex flex-col gap-2 mt-4">
                    <Button
                      asChild
                      variant="outline"
                      className="text-primary border-primary hover:bg-primary/10 w-full"
                    >
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        Login
                      </Link>
                    </Button>
                    <Button asChild className="bg-accent text-white hover:bg-accent/90 w-full">
                      <Link href="/register" onClick={() => setIsOpen(false)}>
                        Register
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
