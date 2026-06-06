"use client"

import Link from "next/link"
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileText,
  Settings,
  Menu,
  FileCode,
  Mail,
  Navigation,
  Home,
  Package,
  ClipboardCheck,
  Award,
  Rocket,
  DollarSign,
} from "lucide-react"
import { type LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/ui/ThemeToggle"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface SidebarItem {
  title: string
  href: string
  icon: LucideIcon
}

const sidebarItems: SidebarItem[] = [
  { title: "Dashboard", href: "/control", icon: LayoutDashboard },
  { title: "Sales (Foxy)", href: "/control/sales", icon: DollarSign },
  { title: "Implementation Plan", href: "/control/tasks", icon: ClipboardCheck },
  { title: "Deployments", href: "/control/deployments", icon: Rocket },
  { title: "Homepage CMS", href: "/control/homepage", icon: Home },
  { title: "Users", href: "/control/users", icon: Users },
  { title: "Courses", href: "/control/courses", icon: BookOpen },
  { title: "Certificates", href: "/control/certificates", icon: Award },
  { title: "Lectures", href: "/control/lectures", icon: FileText },
  { title: "Blog Posts", href: "/control/blog", icon: FileText },
  { title: "Monitoring", href: "/control/vercel-monitor", icon: Rocket },
  { title: "Assets", href: "/control/assets", icon: Package },
  { title: "Pages", href: "/control/pages", icon: FileCode },
  { title: "Messages", href: "/control/messages", icon: Mail },
  { title: "Menus", href: "/control/menus", icon: Navigation },
  { title: "Settings", href: "/control/settings", icon: Settings },
]

interface SidebarContentProps {
  userName?: string | null | undefined
  pathname: string
  onLinkClick: () => void
}

const SidebarContent = ({ userName, pathname, onLinkClick }: SidebarContentProps) => (
  <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
    <div className="p-6 border-b border-gray-100 dark:border-gray-800 shrink-0">
      <Link
        href="/"
        className="flex items-center gap-2 font-bold text-xl text-primary dark:text-blue-400"
      >
        PHAGLP Control
      </Link>
      {userName && (
        <p className="text-xs text-muted-foreground mt-1 truncate">Logged as: {userName}</p>
      )}
    </div>
    
    {/* Added overflow-y-auto to allow scrolling through long menu items */}
    <nav className="flex-1 px-4 py-4 overflow-y-auto custom-scrollbar">
      <ul className="space-y-1">
        {sidebarItems.map((item) => {
          const isActive =
            item.href === "/control" ? pathname === "/control" : pathname.startsWith(item.href)
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onLinkClick}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-primary text-white"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white",
                )}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.title}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
    
    <div className="p-4 border-t border-gray-200 dark:border-gray-800 mt-auto flex items-center justify-between shrink-0 bg-white dark:bg-gray-900">
      <ThemeToggle />
      <form action="/api/auth/signout" method="POST">
        <Button variant="ghost" size="sm" type="submit" className="text-gray-600 dark:text-gray-300">
          Sign Out
        </Button>
      </form>
    </div>
  </div>
)

export function ControlSidebar({ 
  userName,
  children
}: { 
  userName?: string | null | undefined
  children?: React.ReactNode
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full">
      {/* Desktop Sidebar Layout */}
      <aside className="fixed inset-y-0 left-0 z-20 w-64 hidden md:block shrink-0 h-screen">
        <SidebarContent userName={userName} pathname={pathname} onLinkClick={() => {}} />
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 h-16">
        <Link href="/" className="font-bold text-lg text-primary dark:text-blue-400">
          PHAGLP Control
        </Link>
        {isMounted ? (
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-300">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64 border-none">
              <SidebarContent
                userName={userName}
                pathname={pathname}
                onLinkClick={() => setIsOpen(false)}
              />
            </SheetContent>
          </Sheet>
        ) : (
          <Button variant="ghost" size="icon" aria-label="Open navigation menu">
            <Menu className="w-6 h-6" />
          </Button>
        )}
      </header>

      {/* Main Content Layout Adjustments wrapper */}
      <div className="flex-1 md:pl-64 pt-16 md:pt-0 min-h-screen w-full bg-gray-50 dark:bg-gray-950 flex flex-col">
        {children}
      </div>
    </div>
  )
}

