"use client";

import Link from "next/link";
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
} from "lucide-react";
import { type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface SidebarItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

interface SidebarGroup {
  label: string;
  items: SidebarItem[];
}

const sidebarGroups: SidebarGroup[] = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", href: "/control", icon: LayoutDashboard },
      { title: "Sales (Foxy)", href: "/control/sales", icon: DollarSign },
      { title: "Deployments", href: "/control/deployments", icon: Rocket },
    ],
  },
  {
    label: "Content Management",
    items: [
      { title: "Courses", href: "/control/courses", icon: BookOpen },
      { title: "Lectures", href: "/control/lectures", icon: FileText },
      { title: "Certificates", href: "/control/certificates", icon: Award },
      { title: "Blog Posts", href: "/control/blog", icon: FileText },
      { title: "Pages", href: "/control/pages", icon: FileCode },
      { title: "Homepage CMS", href: "/control/homepage", icon: Home },
      { title: "Menus", href: "/control/menus", icon: Navigation },
      { title: "Assets", href: "/control/assets", icon: Package },
    ],
  },
  {
    label: "System & Admin",
    items: [
      { title: "Users", href: "/control/users", icon: Users },
      { title: "Messages", href: "/control/messages", icon: Mail },
      { title: "Tasks & Plan", href: "/control/tasks", icon: ClipboardCheck },
      { title: "Monitoring", href: "/control/vercel-monitor", icon: Rocket },
      { title: "Settings", href: "/control/settings", icon: Settings },
    ],
  },
];

interface SidebarContentProps {
  userName?: string | null | undefined;
  pathname: string;
  onLinkClick: () => void;
}

const SidebarContent = ({
  userName,
  pathname,
  onLinkClick,
}: SidebarContentProps) => (
  <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
    <div className="p-6 border-b border-gray-100 dark:border-gray-800 shrink-0">
      <Link
        href="/"
        className="flex items-center gap-2 font-bold text-xl text-primary dark:text-blue-400 tracking-tight"
      >
        <Rocket className="w-5 h-5 text-primary" />
        PHAGLP Control
      </Link>
      {userName && (
        <p className="text-xs font-medium text-muted-foreground mt-2 truncate">
          Logged as: <span className="text-foreground">{userName}</span>
        </p>
      )}
    </div>

    <nav className="flex-1 px-4 py-6 overflow-y-auto custom-scrollbar space-y-8">
      {sidebarGroups.map((group) => (
        <div key={group.label}>
          <h3 className="px-3 mb-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">
            {group.label}
          </h3>
          <ul className="space-y-1">
            {group.items.map((item) => {
              const isActive =
                item.href === "/control"
                  ? pathname === "/control"
                  : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onLinkClick}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                      isActive
                        ? "bg-primary/10 text-primary dark:bg-primary/20"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100",
                    )}
                  >
                    <item.icon
                      className={cn(
                        "w-4 h-4 shrink-0",
                        isActive ? "text-primary" : "",
                      )}
                    />
                    <span className="truncate">{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>

    <div className="p-4 border-t border-gray-200 dark:border-gray-800 shrink-0 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground px-2">
          Theme
        </span>
        <ThemeToggle />
      </div>
      <form action="/api/auth/signout" method="POST" className="w-full">
        <Button
          variant="outline"
          size="sm"
          type="submit"
          className="w-full justify-start text-red-600 dark:text-red-400 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
        >
          <Mail className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </form>
    </div>
  </div>
);

export function ControlSidebar({
  userName,
}: {
  userName?: string | null | undefined;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="w-64 shrink-0 hidden md:flex flex-col h-screen sticky top-0 shadow-sm z-20">
        <SidebarContent
          userName={userName}
          pathname={pathname}
          onLinkClick={() => {}}
        />
      </aside>

      {/* Mobile Sticky Top Navigation Menu */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b sticky top-0 z-30 shadow-sm">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-lg text-primary dark:text-blue-400"
        >
          <Rocket className="w-5 h-5 text-primary" />
          Control Panel
        </Link>
        {isMounted ? (
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-600 dark:text-gray-300"
              >
                <Menu className="w-6 h-6" />
                <span className="sr-only">Toggle mobile menu</span>
              </Button>
            </SheetTrigger>
            {/* Mobile Overlay Drawer */}
            <SheetContent
              side="left"
              className="p-0 w-[280px] border-none shadow-2xl"
            >
              <SheetTitle className="sr-only">Sidebar Navigation</SheetTitle>
              <SheetDescription className="sr-only">
                Access control panel sections
              </SheetDescription>
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
  );
}
