"use client"

import { Button } from "@/components/ui/button"
import { Menu, ChevronDown, LayoutDashboard, Shield, LogOut, ExternalLink } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { siteConfig } from "@/config/site"
import { ThemeToggle } from "@/components/ui/ThemeToggle"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet"
import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DynamicMenu } from "@/lib/server/menus"
import * as Icons from "lucide-react"

// Clean dynamic icon loader
function NavIcon({ name, className }: { name: string | null; className?: string }) {
  if (!name) return null
  const IconComponent = (Icons as any)[name]
  if (!IconComponent) return <Icons.ChevronRight className={className} />
  return <IconComponent className={className} />
}

interface NavbarProps {
  initialMenus?: DynamicMenu[]
}

export function Navbar({ initialMenus = [] }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession()
  const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  // Use initialMenus if present; filter to only show in header
  const menusToRender = initialMenus.length > 0 ? initialMenus.filter((m) => m.showInHeader) : []

  const toggleMobileCategory = (id: string) => {
    setExpandedMobileMenu(expandedMobileMenu === id ? null : id)
  }

  return (
    <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Link href="/" className="flex items-center gap-1.5 hover:opacity-95 transition-opacity">
            <Image
              src="/phaglp-logo.png"
              alt="PHAGLP Logo"
              width={64}
              height={64}
              className="h-9 w-auto object-contain"
            />
            <span className="text-xl font-bold tracking-tight text-primary dark:text-blue-400">
              {siteConfig.siteName}
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-4">
          {menusToRender.map((menu) => {
            // Case 1: Dropdown Menu (has sub-items and no direct link)
            if (menu.items && menu.items.length > 0 && !menu.href) {
              return (
                <DropdownMenu key={menu.id}>
                  <DropdownMenuTrigger asChild={false}>
                    <button
                      className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground focus:outline-none transition-colors px-2.5 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900/60"
                      aria-controls={`dropdown-${menu.id}`}
                    >
                      {menu.name}
                      <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="w-56 rounded-2xl shadow-xl p-2 border mt-1"
                    id={`dropdown-${menu.id}`}
                  >
                    {menu.items.map((subItem) => (
                      <DropdownMenuItem
                        key={subItem.id}
                        asChild
                        className="rounded-xl cursor-pointer"
                      >
                        <Link
                          href={subItem.href}
                          target={subItem.isOpenNewTab ? "_blank" : undefined}
                          rel={subItem.isOpenNewTab ? "noopener noreferrer" : undefined}
                          className="flex items-center gap-2.5 w-full py-2 px-3 text-sm"
                        >
                          <NavIcon name={subItem.icon} className="w-4 h-4 text-primary" />
                          <span className="flex-1 truncate">{subItem.name}</span>
                          {subItem.isOpenNewTab && (
                            <ExternalLink className="w-3 h-3 text-muted-foreground" />
                          )}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )
            }

            // Case 2: Direct Link
            const linkHref = menu.href || "#"
            return (
              <Link
                key={menu.id}
                href={linkHref}
                target={menu.isOpenNewTab ? "_blank" : undefined}
                rel={menu.isOpenNewTab ? "noopener noreferrer" : undefined}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900/60 flex items-center gap-1"
              >
                {menu.name}
                {menu.isOpenNewTab && <ExternalLink className="w-3 h-3" />}
              </Link>
            )
          })}

          {/* If no menus seeded yet, show default fallback items */}
          {menusToRender.length === 0 &&
            siteConfig.navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5"
              >
                {item.title}
              </Link>
            ))}

          <div className="flex items-center gap-2 border-l pl-4 ml-1">
            {mounted && <ThemeToggle />}
            {session ? (
              <div className="flex items-center gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild={true}>
                    <button
                      className="flex items-center gap-2 hover:opacity-90 focus:outline-none transition-all bg-slate-50 dark:bg-slate-900 border px-3 py-1.5 rounded-full shadow-sm"
                      aria-controls="user-dropdown"
                    >
                      <Avatar className="w-7 h-7 border border-primary/20">
                        <AvatarImage src={session.user.image || ""} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold uppercase">
                          {session.user.name ? session.user.name.substring(0, 2) : "US"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-semibold text-foreground max-w-[100px] truncate">
                        {session.user.name || "Student"}
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 rounded-2xl shadow-xl p-2 border mt-1"
                    id="user-dropdown"
                  >
                    <DropdownMenuLabel className="px-3 py-2">
                      <div className="text-sm font-bold truncate">
                        {session.user.name || "User"}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {session.user.email}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                      <Link href="/dashboard" className="flex items-center gap-2 w-full">
                        <LayoutDashboard className="w-4 h-4 text-primary" />
                        My Dashboard
                      </Link>
                    </DropdownMenuItem>
                    {session.user.role === "ADMIN" && (
                      <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                        <Link href="/control" className="flex items-center gap-2 w-full">
                          <Shield className="w-4 h-4 text-red-500" />
                          Control Panel
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => signOut()}
                      className="rounded-xl cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="text-primary border-primary hover:bg-primary/10 rounded-xl"
                >
                  <Link href="/login">Login</Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="bg-accent text-white hover:bg-accent/90 rounded-xl"
                >
                  <Link href="/register">Register</Link>
                </Button>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div className="flex items-center gap-2 xl:hidden">
          {mounted && <ThemeToggle />}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            {mounted && (
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
            )}
            <SheetContent
              side="right"
              className="w-[320px] sm:w-[360px] p-0 flex flex-col h-full rounded-l-3xl border-l border-primary/10 bg-background"
            >
              <SheetHeader className="p-6 border-b">
                <SheetTitle className="text-left text-primary dark:text-blue-400 flex items-center gap-2">
                  <Image
                    src="/phaglp-logo.png"
                    alt="PHAGLP Logo"
                    width={32}
                    height={32}
                    className="h-8 w-auto object-contain"
                  />
                  <span>Navigation Menu</span>
                </SheetTitle>
                <SheetDescription className="sr-only">
                  Navigation menu items
                </SheetDescription>
              </SheetHeader>

              <div className="flex-grow overflow-y-auto px-6 py-4 space-y-4">
                {menusToRender.map((menu) => {
                  const hasSubItems = menu.items && menu.items.length > 0
                  const isExpanded = expandedMobileMenu === menu.id

                  if (hasSubItems && !menu.href) {
                    return (
                      <div key={menu.id} className="border-b pb-2">
                        <button
                          onClick={() => toggleMobileCategory(menu.id)}
                          className="flex items-center justify-between w-full py-2.5 text-base font-semibold text-foreground"
                        >
                          <span>{menu.name}</span>
                          <ChevronDown
                            className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                              isExpanded ? "rotate-180 text-primary" : ""
                            }`}
                          />
                        </button>
                        {isExpanded && (
                          <div className="pl-3 mt-1 space-y-2 border-l border-slate-100 dark:border-slate-800/80">
                            {menu.items.map((subItem) => (
                              <Link
                                key={subItem.id}
                                href={subItem.href}
                                onClick={() => setIsOpen(false)}
                                target={subItem.isOpenNewTab ? "_blank" : undefined}
                                rel={subItem.isOpenNewTab ? "noopener noreferrer" : undefined}
                                className="flex items-center gap-2 py-2 text-sm text-muted-foreground hover:text-foreground"
                              >
                                <NavIcon name={subItem.icon} className="w-3.5 h-3.5 text-primary" />
                                <span className="flex-1 truncate">{subItem.name}</span>
                                {subItem.isOpenNewTab && (
                                  <ExternalLink className="w-3 h-3 scale-75" />
                                )}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  }

                  const linkHref = menu.href || "#"
                  return (
                    <Link
                      key={menu.id}
                      href={linkHref}
                      onClick={() => setIsOpen(false)}
                      target={menu.isOpenNewTab ? "_blank" : undefined}
                      className="flex items-center justify-between py-3 border-b text-base font-semibold text-foreground hover:text-primary transition-colors"
                    >
                      <NavIcon name={menu.icon} className="w-3.5 h-3.5 text-primary" />
                      <span>{menu.name}</span>
                      {menu.isOpenNewTab && (
                        <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                      )}
                    </Link>
                  )
                })}

                {menusToRender.length === 0 &&
                  siteConfig.navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="block py-3 border-b text-base font-semibold text-foreground hover:text-primary"
                    >
                   // FIX: Safe string indexing to read optional static icons dynamically
<NavIcon name={(item as Record<string, any>)["icon"]} className="w-3.5 h-3.5 text-primary" />

                      {item.title}
                    </Link>
                  ))}
              </div>

              {/* Mobile Auth Actions at the bottom */}
              <div className="p-6 border-t mt-auto space-y-3 bg-slate-50/50 dark:bg-slate-900/20">
                {session ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 px-1 py-1">
                      <Avatar className="w-10 h-10 border border-primary/20">
                        <AvatarImage src={session.user.image || ""} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold uppercase">
                          {session.user.name ? session.user.name.substring(0, 2) : "US"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-foreground truncate">
                          {session.user.name || "Student"}
                        </span>
                        <span className="text-xs text-muted-foreground truncate">
                          {session.user.email}
                        </span>
                      </div>
                    </div>

                    <Button
                      asChild
                      variant="outline"
                      className="w-full justify-start gap-2 rounded-xl"
                      onClick={() => setIsOpen(false)}
                    >
                      <Link href="/dashboard">
                        <LayoutDashboard className="w-4 h-4 text-primary" />
                        My Dashboard
                      </Link>
                    </Button>

                    {session.user.role === "ADMIN" && (
                      <Button
                        asChild
                        variant="outline"
                        className="w-full justify-start gap-2 rounded-xl"
                        onClick={() => setIsOpen(false)}
                      >
                        <Link href="/control">
                          <Shield className="w-4 h-4 text-red-500" />
                          Control Panel
                        </Link>
                      </Button>
                    )}

                    <Button
                      onClick={() => {
                        signOut()
                        setIsOpen(false)
                      }}
                      className="bg-red-600 text-white hover:bg-red-700 w-full rounded-xl mt-1"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button
                      asChild
                      variant="outline"
                      className="text-primary border-primary hover:bg-primary/10 w-full rounded-xl"
                      onClick={() => setIsOpen(false)}
                    >
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button
                      asChild
                      className="bg-accent text-white hover:bg-accent/90 w-full rounded-xl"
                      onClick={() => setIsOpen(false)}
                    >
                      <Link href="/register">Register</Link>
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
