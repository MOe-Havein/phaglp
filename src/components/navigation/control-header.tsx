import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface ControlHeaderProps {
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

export function ControlHeader({ title, description, actionLabel, onAction }: ControlHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {actionLabel && (
        <Button onClick={onAction} className="bg-primary text-white">
          <Plus className="w-4 h-4 mr-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
