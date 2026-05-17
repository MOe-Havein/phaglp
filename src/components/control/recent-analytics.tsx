import { formatDistanceToNow } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, User, Globe, LogIn, UserPlus } from "lucide-react"

interface AnalyticsEntry {
  id: string
  event: string
  path: string | null
  createdAt: Date
  user: {
    name: string | null
    email: string | null
  } | null
}

export function RecentAnalytics({ data }: { data: AnalyticsEntry[] }) {
  const getIcon = (event: string) => {
    switch (event) {
      case "LOGIN":
        return <LogIn className="w-4 h-4 text-blue-500" />
      case "SIGNUP":
        return <UserPlus className="w-4 h-4 text-green-500" />
      case "PAGE_VIEW":
        return <Globe className="w-4 h-4 text-purple-500" />
      default:
        return <Activity className="w-4 h-4 text-slate-500" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Recent Activity (Audit Log)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {data.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No recent activity found.</p>
          ) : (
            data.map((item) => (
              <div key={item.id} className="flex items-start gap-4 text-sm">
                <div className="mt-1 p-2 bg-muted rounded-full">{getIcon(item.event)}</div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between">
                    <p className="font-medium text-slate-900 dark:text-slate-100">
                      {item.event.replace("_", " ")}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <User className="w-3 h-3" />
                    <span>{item.user?.name || item.user?.email || "Anonymous"}</span>
                    {item.path && (
                      <>
                        <span className="text-slate-300">•</span>
                        <span className="font-mono bg-muted px-1 rounded">{item.path}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
