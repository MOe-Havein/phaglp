"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useState, useEffect, useTransition } from "react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Role } from "@prisma/client"
import { Search, Loader2 } from "lucide-react"

export function UserFilterBar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // Local state for the search input to allow smooth typing without lag
  const [searchVal, setSearchVal] = useState(searchParams.get("search") || "")

  const roleVal = searchParams.get("role") || "ALL"
  const sortVal = searchParams.get("sort") || "createdAt_desc"

  // Effect to update searchParams with debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (searchVal) {
        params.set("search", searchVal)
      } else {
        params.delete("search")
      }
      // Reset to page 1 on search
      params.set("page", "1")

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`)
      })
    }, 400) // 400ms debounce

    return () => clearTimeout(handler)
  }, [searchVal, pathname, router])

  const handleSelectChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== "ALL") {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    // Reset to page 1 on filter/sort change
    params.set("page", "1")

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center bg-card p-4 rounded-xl border shadow-sm">
      <div className="relative w-full md:flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or email..."
          className="pl-10 w-full"
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
        />
        {isPending && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-purple-600" />
        )}
      </div>

      <div className="flex flex-row gap-4 w-full md:w-auto">
        <div className="w-full md:w-[160px]">
          <Select value={roleVal} onValueChange={(val) => handleSelectChange("role", val)}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Roles</SelectItem>
              <SelectItem value={Role.USER}>User</SelectItem>
              <SelectItem value={Role.INSTRUCTOR}>Instructor</SelectItem>
              <SelectItem value={Role.ADMIN}>Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-[180px]">
          <Select value={sortVal} onValueChange={(val) => handleSelectChange("sort", val)}>
            <SelectTrigger>
              <SelectValue placeholder="Sort order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt_desc">Newest Joined</SelectItem>
              <SelectItem value="createdAt_asc">Oldest Joined</SelectItem>
              <SelectItem value="name_asc">Name A-Z</SelectItem>
              <SelectItem value="name_desc">Name Z-A</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
