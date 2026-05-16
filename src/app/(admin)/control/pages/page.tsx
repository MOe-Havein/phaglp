import { auth } from "@/auth"
import { Role } from "@prisma/client"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, FileCode, Edit, Globe, Lock, ExternalLink } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { DeletePageButton } from "@/components/control/delete-page-button"

export default async function AdminPagesPage() {
  const session = await auth()

  if (session?.user?.role !== Role.ADMIN) {
    redirect("/login")
  }

  const pages = await prisma.page.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="container mx-auto py-10 space-y-8 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-xl">
            <FileCode className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Page Management</h1>
            <p className="text-muted-foreground">
              Create and manage custom static pages (About, Terms, etc.)
            </p>
          </div>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
          <Link href="/control/pages/new">
            <Plus className="mr-2 h-4 w-4" /> Create Page
          </Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {pages.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed rounded-2xl">
            <FileCode className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground">No custom pages created yet.</p>
          </div>
        ) : (
          pages.map((page) => (
            <Card key={page.id} className="hover:border-blue-200 transition-all group">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold group-hover:text-blue-600 transition-colors">
                        {page.title}
                      </h3>
                      {page.published ? (
                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200">
                          <Globe className="w-3 h-3 mr-1" /> Published
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-slate-100 text-slate-600">
                          <Lock className="w-3 h-3 mr-1" /> Draft
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="font-mono text-xs bg-slate-50 px-1.5 py-0.5 rounded border">
                        /{page.slug}
                      </span>
                      <span>•</span>
                      <span>Updated {format(new Date(page.updatedAt), "MMM d, yyyy")}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/${page.slug}`} target="_blank">
                        <ExternalLink className="w-4 h-4 mr-2" /> View
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/control/pages/${page.id}`}>
                        <Edit className="w-4 h-4 mr-2" /> Edit
                      </Link>
                    </Button>
                    <DeletePageButton id={page.id} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
