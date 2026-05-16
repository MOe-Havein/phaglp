import prisma from "@/lib/prisma"
import { groupBySession } from "@/lib/chat-utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, User, TrendingUp, MessageSquare } from "lucide-react"

export default async function ChatMonitoringPage() {
  // Accurate totals via dedicated count queries
  const [totalMessages, totalSessions] = await Promise.all([
    prisma.chatMessage.count(),
    prisma.chatMessage.groupBy({ by: ["sessionId"], _count: true }).then((r) => r.length),
  ])

  // Fetch the 50 most recent messages for display purposes
  const recentChats = await prisma.chatMessage.findMany({
    take: 50,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  })

  // Group recent messages by session using shared helper
  const sessionMap = groupBySession(recentChats)

  // Stats
  const avgMessagesPerSession = totalSessions > 0 ? (totalMessages / totalSessions).toFixed(1) : "0"

  // 10 most recent user questions
  const recentQuestions = recentChats
    .filter((m) => m.role === "USER")
    .slice(0, 10)
    .map((m) => ({
      content: m.content,
      timestamp: m.createdAt,
    }))

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Chatbot Monitoring</h1>
        <p className="text-muted-foreground mt-2">
          Monitor chatbot conversations and analyze user interactions
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSessions}</div>
            <p className="text-xs text-muted-foreground">All-time chat sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMessages}</div>
            <p className="text-xs text-muted-foreground">All-time messages sent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. per Session</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgMessagesPerSession}</div>
            <p className="text-xs text-muted-foreground">Messages per conversation</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Questions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent User Questions</CardTitle>
            <CardDescription>Last 10 questions asked by users</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {recentQuestions.map((q, idx) => (
                  <div
                    key={`${q.timestamp.toISOString()}-${idx}`}
                    className="border-b pb-3 last:border-0"
                  >
                    <p className="text-sm">{q.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(q.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Recent Conversations (from last 50 messages) */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Conversations</CardTitle>
            <CardDescription>Latest chat sessions (from last 50 messages)</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-6">
                {Array.from(sessionMap.entries())
                  .slice(0, 5)
                  .map(([sessionId, messages]) => (
                    <div key={sessionId} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="outline" className="text-xs">
                          Session: {sessionId.slice(0, 8)}...
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {messages.length} messages
                        </span>
                      </div>
                      <div className="space-y-2">
                        {messages.slice(0, 3).map((msg) => (
                          <div key={msg.id} className="flex gap-2">
                            {msg.role === "USER" ? (
                              <User className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                            ) : (
                              <Bot className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                            )}
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {msg.content}
                            </p>
                          </div>
                        ))}
                        {messages.length > 3 && (
                          <p className="text-xs text-muted-foreground text-center">
                            +{messages.length - 3} more messages
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
