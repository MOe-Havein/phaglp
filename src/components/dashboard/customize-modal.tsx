"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { SlidersHorizontal, Loader2, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface CustomizeModalProps {
  initialPreferences: string[]
  availableCategories: string[]
}

export function CustomizeModal({ initialPreferences, availableCategories }: CustomizeModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<string[]>(initialPreferences)
  const router = useRouter()

  const handleToggle = (category: string) => {
    setSelected((prev) =>
      prev.includes(category) ? prev.filter((item) => item !== category) : [...prev, category],
    )
  }

  const handleSelectAll = () => {
    setSelected(availableCategories)
  }

  const handleClearAll = () => {
    setSelected([])
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/user/preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ preferences: selected }),
      })

      if (!res.ok) {
        throw new Error("Failed to save preferences")
      }

      toast.success("Dashboard preferences updated!")
      setOpen(false)
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2 border-primary/20 hover:border-primary/50 bg-white/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all font-semibold rounded-xl">
          <SlidersHorizontal className="w-4 h-4 text-primary" />
          Customize Dashboard
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px] rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 backdrop-blur-2xl p-6 shadow-2xl">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-black tracking-tight flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            Personalize Lectures
          </DialogTitle>
          <DialogDescription className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
            Customize which philosophical focus areas and lecture categories appear on your active learning dashboard.
          </DialogDescription>
        </DialogHeader>

        <div className="my-6 space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground border-b pb-2">
            <span>AVAILABLE TOPICS ({availableCategories.length})</span>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleSelectAll}
                className="hover:text-primary transition-colors uppercase"
              >
                Select All
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={handleClearAll}
                className="hover:text-primary transition-colors uppercase"
              >
                Clear All
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 max-h-[220px] overflow-y-auto pr-1">
            {availableCategories.map((category) => {
              const isChecked = selected.includes(category)
              return (
                <div
                  key={category}
                  onClick={() => handleToggle(category)}
                  className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer select-none transition-all duration-200 ${
                    isChecked
                      ? "border-primary/50 bg-primary/5 text-primary dark:bg-primary/10 dark:text-primary-foreground font-semibold shadow-sm scale-[0.98]"
                      : "border-slate-200/60 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-900/50"
                  }`}
                >
                  <Checkbox
                    id={`cat-${category}`}
                    checked={isChecked}
                    onCheckedChange={() => handleToggle(category)}
                    className="rounded-md border-slate-300 dark:border-slate-700 pointer-events-none"
                  />
                  <label
                    htmlFor={`cat-${category}`}
                    className="text-sm font-medium leading-none cursor-pointer flex-grow text-inherit pointer-events-none"
                  >
                    {category}
                  </label>
                </div>
              )
            })}
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100 dark:border-slate-900">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setOpen(false)}
            className="w-full sm:w-auto rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl shadow-md min-w-[120px]"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Focus"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
