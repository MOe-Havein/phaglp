"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { createMenu, updateMenu } from "@/lib/menu-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, Link2, FileCode, Folder } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface PageItem {
  id: string
  title: string
  slug: string
}

interface NavigationFormProps {
  initialData?: {
    id: string
    name: string
    href: string | null
    icon: string | null
    isOpenNewTab: boolean
    isActive: boolean
    showInHeader: boolean
    showInFooter: boolean
  }
  pages: PageItem[]
}

export function NavigationForm({ initialData, pages }: NavigationFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  
  // State variables
  const [name, setName] = useState(initialData?.name || "")
  const [href, setHref] = useState(initialData?.href || "")
  const [icon, setIcon] = useState(initialData?.icon || "Folder")
  const [isOpenNewTab, setIsOpenNewTab] = useState(initialData?.isOpenNewTab ?? false)
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true)
  const [showInHeader, setShowInHeader] = useState(initialData?.showInHeader ?? true)
  const [showInFooter, setShowInFooter] = useState(initialData?.showInFooter ?? true)
  
  // Determine if it is a dynamic page link or custom URL
  const isPageLink = pages.some((p) => `/${p.slug}` === href)
  const [isPageType, setIsPageType] = useState(isPageLink)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) {
      toast.error("Please enter a category name.")
      return
    }

    startTransition(async () => {
      try {
        const menuData = {
          name,
          href: href || null,
          icon: icon || null,
          isOpenNewTab,
          isActive,
          showInHeader,
          showInFooter,
        }

        let result
        if (initialData) {
          result = await updateMenu(initialData.id, menuData)
        } else {
          result = await createMenu(menuData)
        }

        if (result.success) {
          toast.success(initialData ? "Navigation updated" : "Navigation created")
          router.push("/control/navigation")
          router.refresh()
        } else {
          toast.error(result.error || "Action failed")
        }
      } catch (error: any) {
        toast.error(error.message || "An unexpected error occurred")
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="container mx-auto py-10 space-y-8 max-w-5xl px-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/control/navigation">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {initialData ? "Edit Menu Link" : "Create Menu Link"}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Configure dynamic routing, icons, and visibility in header or footer.
            </p>
          </div>
        </div>
        <div>
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-slate-900 text-white rounded-md py-2 px-4 text-sm font-medium hover:bg-slate-800 disabled:opacity-50 transition-all duration-[8000ms] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900"
          >
            {isPending ? "Processing..." : "Save Navigation Item"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-primary/10 shadow-sm overflow-hidden">
            <CardHeader>
              <CardTitle>Link Configuration</CardTitle>
              <CardDescription>Specify name and destination routing details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Link Name / Title</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Services, About Us"
                  required
                  className="rounded-xl border-gray-200 dark:border-gray-800"
                />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-500">Destination Type</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={!isPageType ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setIsPageType(false)
                        setHref("")
                      }}
                      className="w-full text-xs rounded-xl"
                    >
                      <Link2 className="w-3.5 h-3.5 mr-1.5" /> Custom URL / Path
                    </Button>
                    <Button
                      type="button"
                      variant={isPageType ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setIsPageType(true)
                        if (pages.length > 0) {
                          setHref(`/${pages[0]?.slug || ""}`)
                        }
                      }}
                      className="w-full text-xs rounded-xl"
                    >
                      <FileCode className="w-3.5 h-3.5 mr-1.5" /> Dynamic Page
                    </Button>
                  </div>
                </div>

                {isPageType ? (
                  <div className="space-y-2">
                    <Label htmlFor="pageSelect">Select Dynamic Page</Label>
                    <Select
                      value={pages.find((p) => `/${p.slug}` === href)?.slug || ""}
                      onValueChange={(val) => setHref(`/${val}`)}
                    >
                      <SelectTrigger id="pageSelect" className="rounded-xl bg-slate-50 dark:bg-slate-900 border-gray-200 dark:border-gray-800">
                        <SelectValue placeholder="Choose an integrated page..." />
                      </SelectTrigger>
                      <SelectContent>
                        {pages.map((p) => (
                          <SelectItem key={p.id} value={p.slug}>
                            {p.title} (/{p.slug})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="href">Custom Destination URL / Path</Label>
                    <Input
                      id="href"
                      value={href}
                      onChange={(e) => setHref(e.target.value)}
                      placeholder="e.g. /contact or https://example.com"
                      className="rounded-xl border-gray-200 dark:border-gray-800"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-primary/10 shadow-sm">
            <CardHeader>
              <CardTitle>Display & Styling</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="icon">Lucide Icon Name</Label>
                <div className="flex gap-2 items-center">
                  <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500">
                    <Folder className="w-4 h-4" />
                  </div>
                  <Input
                    id="icon"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    placeholder="e.g. GraduationCap, Cpu, Settings"
                    className="rounded-xl border-gray-200 dark:border-gray-800"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/10 shadow-sm">
            <CardHeader>
              <CardTitle>Visibility Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-xl border p-3 bg-slate-50/50 dark:bg-slate-900/30">
                <div className="space-y-0.5">
                  <Label htmlFor="isActive" className="cursor-pointer">Active State</Label>
                  <p className="text-[10px] text-muted-foreground">Enabled for visitors</p>
                </div>
                <Switch
                  id="isActive"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
              </div>

              <div className="flex items-center justify-between rounded-xl border p-3 bg-slate-50/50 dark:bg-slate-900/30">
                <div className="space-y-0.5">
                  <Label htmlFor="showInHeader" className="cursor-pointer">Header Visibility</Label>
                  <p className="text-[10px] text-muted-foreground">Show in navbar header</p>
                </div>
                <Switch
                  id="showInHeader"
                  checked={showInHeader}
                  onCheckedChange={setShowInHeader}
                />
              </div>

              <div className="flex items-center justify-between rounded-xl border p-3 bg-slate-50/50 dark:bg-slate-900/30">
                <div className="space-y-0.5">
                  <Label htmlFor="showInFooter" className="cursor-pointer">Footer Visibility</Label>
                  <p className="text-[10px] text-muted-foreground">Show in footer directories</p>
                </div>
                <Switch
                  id="showInFooter"
                  checked={showInFooter}
                  onCheckedChange={setShowInFooter}
                />
              </div>

              <div className="flex items-center justify-between rounded-xl border p-3 bg-slate-50/50 dark:bg-slate-900/30">
                <div className="space-y-0.5">
                  <Label htmlFor="isOpenNewTab" className="cursor-pointer">New Tab Link</Label>
                  <p className="text-[10px] text-muted-foreground">Open in a separate window</p>
                </div>
                <Switch
                  id="isOpenNewTab"
                  checked={isOpenNewTab}
                  onCheckedChange={setIsOpenNewTab}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
