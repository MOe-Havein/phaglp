import * as React from "react"
import Link from "next/link"
import { Search, ChevronDown, GraduationCap, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
      <div className="container mx-auto max-w-[1200px] px-4 md:px-8 h-20 flex items-center justify-between gap-8">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
            <GraduationCap className="w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tight text-foreground hidden sm:block">
            PHAGLP
          </span>
        </Link>

        {/* Desktop Mega-Menu Nav */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-bold text-foreground">
          <button className="flex items-center gap-1 hover:text-primary transition-colors">
            Explore Courses <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>
          <Link href="/learning-path" className="hover:text-primary transition-colors">
            Learning Paths
          </Link>
          <Link href="/certificates" className="hover:text-primary transition-colors">
            Certifications
          </Link>
          <Link href="/dashboard" className="hover:text-primary transition-colors">
            Enterprise
          </Link>
        </nav>

        {/* Global Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            type="search" 
            placeholder="What do you want to learn today?" 
            className="w-full pl-10 rounded-full bg-surface-container-low border-transparent focus-visible:bg-white"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <Button variant="ghost" className="hidden sm:inline-flex font-bold">
            Sign In
          </Button>
          <Button variant="default" className="font-bold shadow-sm">
            Join for Free
          </Button>
          
          {/* Mobile Menu Toggle */}
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
            <Menu className="w-6 h-6" />
          </Button>
        </div>
        
      </div>
    </header>
  )
}
