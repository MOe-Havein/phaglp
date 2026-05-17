import { auth } from "@/auth"
import { Role } from "@prisma/client"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Calendar, User, CheckCircle2, Circle } from "lucide-react"
import { format } from "date-fns"
import { MessageActions } from "@/components/control/message-actions"

export default async function AdminMessagesPage() {
  const session = await auth()

  if (session?.user?.role !== Role.ADMIN) {
    redirect("/login")
  }

  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  })

  const unreadCount = messages.filter((m) => !m.isRead).length

  return (
    <div className="container mx-auto py-10 space-y-8 px-4">
      <div className="flex items-center gap-4 border-b pb-6">
        <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
          <Mail className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inbox</h1>
          <p className="text-muted-foreground">Manage inquiries and feedback from users.</p>
        </div>
        <div className="ml-auto">
          {unreadCount > 0 && (
            <Badge className="bg-blue-600 text-white">{unreadCount} Unread</Badge>
          )}
        </div>
      </div>

      <div className="grid gap-4">
        {messages.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed rounded-2xl">
            <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground">No messages yet.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <Card
              key={msg.id}
              className={`hover:shadow-md transition-all ${!msg.isRead ? "border-l-4 border-l-blue-600" : ""}`}
            >
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {!msg.isRead ? (
                          <Circle className="w-2.5 h-2.5 fill-blue-600 text-blue-600" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        )}
                        <span
                          className={`font-bold ${!msg.isRead ? "text-slate-900" : "text-slate-600"}`}
                        >
                          {msg.subject}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />{" "}
                        {format(new Date(msg.createdAt), "MMM d, HH:mm")}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" /> {msg.name}
                      </span>
                      <span>•</span>
                      <span>{msg.email}</span>
                    </div>

                    <p className="text-sm leading-relaxed text-slate-700 bg-slate-50 p-3 rounded-lg border">
                      {msg.message}
                    </p>
                  </div>

                  <div className="flex md:flex-col justify-end items-end gap-2">
                    <MessageActions id={msg.id} isRead={msg.isRead} />
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
