"use client"

import { useState } from "react"
import { Role } from "@prisma/client"
import { updateUserRole, deleteUser } from "@/lib/control-actions"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Shield, Trash2, Loader2, Edit2 } from "lucide-react"
import { toast } from "sonner"
import { EditUserDialog } from "./edit-user-dialog"

interface UserRoleManagerProps {
  user: {
    id: string
    name: string | null
    email: string
    role: Role
  }
}

export function UserRoleManager({ user }: UserRoleManagerProps) {
  const [loading, setLoading] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  const handleRoleChange = async (role: Role) => {
    setLoading(true)
    try {
      const result = await updateUserRole(user.id, role)
      if (result.success) {
        toast.success(`User role updated to ${role}`)
      } else {
        toast.error(result.error || "Failed to update user role")
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return

    setLoading(true)
    try {
      const result = await deleteUser(user.id)
      if (result.success) {
        toast.success("User deleted successfully")
      } else {
        toast.error(result.error || "Failed to delete user")
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MoreHorizontal className="h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Manage Access</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <Edit2 className="mr-2 h-4 w-4" /> Edit Details
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => handleRoleChange(Role.USER)}
            disabled={user.role === Role.USER}
          >
            <Shield className="mr-2 h-4 w-4 opacity-50" /> Set as User
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleRoleChange(Role.INSTRUCTOR)}
            disabled={user.role === Role.INSTRUCTOR}
          >
            <Shield className="mr-2 h-4 w-4 text-blue-500" /> Set as Instructor
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleRoleChange(Role.ADMIN)}
            disabled={user.role === Role.ADMIN}
          >
            <Shield className="mr-2 h-4 w-4 text-red-500" /> Set as Admin
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600">
            <Trash2 className="mr-2 h-4 w-4" /> Delete User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditUserDialog user={user} open={editOpen} onOpenChange={setEditOpen} />
    </>
  )
}
