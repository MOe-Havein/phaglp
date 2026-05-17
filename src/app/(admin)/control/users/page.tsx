import { auth } from "@/auth"
import { Role } from "@prisma/client"
import { redirect } from "next/navigation"
import prisma, { serializePrisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Calendar, UserCog, Inbox } from "lucide-react"
import { format } from "date-fns"
import { UserRoleManager } from "@/components/control/user-role-manager"
import Image from "next/image"
import { AddUserDialog } from "@/components/control/add-user-dialog"
import { UserFilterBar } from "@/components/control/user-filter-bar"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface PageProps {
  searchParams: Promise<{
    search?: string
    role?: string
    sort?: string
    page?: string
  }>
}

export default async function AdminUsersPage({ searchParams }: PageProps) {
  const session = await auth()

  if (session?.user?.role !== Role.ADMIN) {
    redirect("/login")
  }

  // Await search params since they are a Promise in Next.js 15
  const params = await searchParams
  const search = params.search || ""
  const role = params.role || ""
  const sort = params.sort || "createdAt_desc"
  const page = parseInt(params.page || "1", 10)
  const limit = 6

  // Build the dynamic query options
  const where: any = {}
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ]
  }
  if (role && role !== "ALL") {
    where.role = role as Role
  }

  let orderBy: any = { createdAt: "desc" }
  if (sort === "createdAt_asc") {
    orderBy = { createdAt: "asc" }
  } else if (sort === "name_asc") {
    orderBy = { name: "asc" }
  } else if (sort === "name_desc") {
    orderBy = { name: "desc" }
  }

  // Query database in parallel for total count and users
  const [users, totalCount] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        _count: {
          select: {
            courses: true,
            lectures: true,
            enrollments: true,
          },
        },
      },
    }),
    prisma.user.count({ where }),
  ])

  const totalPages = Math.ceil(totalCount / limit)

  const getPageUrl = (pageNumber: number) => {
    const urlParams = new URLSearchParams()
    if (search) urlParams.set("search", search)
    if (role && role !== "ALL") urlParams.set("role", role)
    if (sort) urlParams.set("sort", sort)
    urlParams.set("page", pageNumber.toString())
    return `/control/users?${urlParams.toString()}`
  }

  const getRoleBadge = (userRole: Role) => {
    switch (userRole) {
      case Role.ADMIN:
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200">Admin</Badge>
        )
      case Role.INSTRUCTOR:
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200">
            Instructor
          </Badge>
        )
      default:
        return <Badge variant="outline">User</Badge>
    }
  }

  return (
    <div className="container mx-auto py-10 space-y-8 px-4 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-6 gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-100 rounded-xl">
            <UserCog className="w-8 h-8 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-700 to-indigo-600 bg-clip-text text-transparent">
              User Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Monitor platform growth and manage security roles.
            </p>
          </div>
        </div>
        <AddUserDialog />
      </div>

      {/* Filter and Search Bar */}
      <UserFilterBar />

      {/* Grid List */}
      <div className="grid gap-4">
        {users.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed rounded-2xl bg-slate-50/50">
            <Inbox className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground text-lg font-medium">No matches found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your search query or filters.
            </p>
          </div>
        ) : (
          users.map((user) => (
            <Card
              key={user.id}
              className="hover:border-purple-200 transition-all shadow-sm overflow-hidden bg-card"
            >
              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row lg:items-center p-6 gap-6 justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center border-2 border-white shadow-sm overflow-hidden relative flex-shrink-0">
                      {user.image ? (
                        <Image
                          src={user.image}
                          alt={user.name || "User profile"}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{user.name || "Anonymous User"}</span>
                        {getRoleBadge(user.role)}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                        <Mail className="w-3.5 h-3.5" /> {user.email}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-8 px-6 lg:px-12 py-3 lg:py-0 border-t border-b lg:border-t-0 lg:border-b-0 lg:border-l lg:border-r border-slate-100 dark:border-slate-800 flex-shrink-0">
                    <div className="text-center">
                      <div className="text-sm font-bold">{user._count.enrollments}</div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        Courses
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold">{user._count.lectures}</div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        Lectures
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold">{user._count.courses}</div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        Taught
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-4 lg:gap-2 flex-shrink-0">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5" /> Joined{" "}
                      {format(new Date(user.createdAt), "MMM d, yyyy")}
                    </div>
                    <div className="flex items-center gap-2">
                      <UserRoleManager user={serializePrisma(user)} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pt-4">
          <Pagination>
            <PaginationContent>
              {page > 1 && (
                <PaginationItem>
                  <PaginationPrevious href={getPageUrl(page - 1)} />
                </PaginationItem>
              )}

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <PaginationItem key={p}>
                  <PaginationLink href={getPageUrl(p)} isActive={p === page}>
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {page < totalPages && (
                <PaginationItem>
                  <PaginationNext href={getPageUrl(page + 1)} />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}
