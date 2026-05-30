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
  { title: "Implementation Plan", href: "/control/tasks", icon: ClipboardCheck },
  { title: "Homepage CMS", href: "/control/homepage", icon: Home },
  { title: "Users", href: "/control/users", icon: Users },
  { title: "Courses", href: "/control/courses", icon: BookOpen },
  { title: "Lectures", href: "/control/lectures", icon: FileText },
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
  <div className="flex flex-col h-full bg-white dark:bg-gray-900">
    <div className="p-6">
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
    <nav className="flex-1 px-4 py-2">
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
                <item.icon className="w-4 h-4" />
                {item.title}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
    <div className="p-4 border-t mt-auto flex items-center justify-between">
      <ThemeToggle />
      <form action="/api/auth/signout" method="POST">
        <Button variant="ghost" size="sm" type="submit">
          Sign Out
        </Button>
      </form>
    </div>
  </div>
)

export function ControlSidebar({ userName }: { userName?: string | null | undefined }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-900 border-r hidden md:block shrink-0">
        <SidebarContent userName={userName} pathname={pathname} onLinkClick={() => {}} />
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-900 border-b">
        <Link href="/" className="font-bold text-lg text-primary dark:text-blue-400">
          PHAGLP Control
        </Link>
        {isMounted ? (
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
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
    </>
  )
}
