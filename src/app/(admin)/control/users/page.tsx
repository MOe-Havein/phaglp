import { auth } from "@/auth"
import { Role } from "@prisma/client"
import { redirect } from "next/navigation"
import prisma, { serializePrisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Calendar, UserCog } from "lucide-react"
import { format } from "date-fns"
import { UserRoleManager } from "@/components/control/user-role-manager"
import Image from "next/image"
import { AddUserDialog } from "@/components/control/add-user-dialog"

export default async function AdminUsersPage() {
  const session = await auth()

  if (session?.user?.role !== Role.ADMIN) {
    redirect("/login")
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          courses: true,
          lectures: true,
          enrollments: true,
        },
      },
    },
  })

  const getRoleBadge = (role: Role) => {
    switch (role) {
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
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex items-center justify-between border-b pb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-100 rounded-xl">
            <UserCog className="w-8 h-8 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
            <p className="text-muted-foreground">
              Monitor platform growth and manage access levels.
            </p>
          </div>
        </div>
        <AddUserDialog />
      </div>

      <div className="grid gap-4">
        {users.map((user) => (
          <Card key={user.id} className="hover:border-purple-200 transition-all overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row md:items-center p-6 gap-6">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center border-2 border-white shadow-sm overflow-hidden relative">
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

                <div className="grid grid-cols-3 gap-8 md:px-8 border-l border-r border-slate-100 dark:border-slate-800">
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

                <div className="flex flex-col md:items-end gap-2">
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
        ))}
      </div>
    </div>
  )
}
