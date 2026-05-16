"use client"

import dynamic from "next/dynamic"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import "@uiw/react-md-editor/markdown-editor.css"
import "@uiw/react-markdown-preview/markdown.css"

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false })

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  /** Editor height in pixels. Defaults to 500. */
  height?: number
  /** Preview mode. Defaults to "live" (split view). */
  preview?: "edit" | "live" | "preview"
}

export function MarkdownEditor({
  value,
  onChange,
  height = 500,
  preview = "live",
}: MarkdownEditorProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Wait for client hydration before rendering the SSR-disabled editor
    const timer = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(timer)
  }, [])

  if (!mounted) {
    return (
      <div className="border rounded-lg p-4 min-h-[500px] bg-slate-50 dark:bg-slate-900">
        <p className="text-muted-foreground text-sm">Loading editor...</p>
      </div>
    )
  }

  return (
    <div data-color-mode={theme === "dark" ? "dark" : "light"}>
      <MDEditor
        value={value}
        onChange={(val) => onChange(val || "")}
        height={height}
        preview={preview}
        // Removes non-essential toolbar items (fullscreen, etc.) for a cleaner embed
        extraCommands={[]}
      />
    </div>
  )
}
