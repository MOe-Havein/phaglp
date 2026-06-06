"use client"

import dynamic from "next/dynamic"
import React, { useRef, useState, useCallback, useEffect, useMemo } from "react"
import { useTheme } from "next-themes"
import { toast } from "sonner"
import { Loader2, ImagePlus } from "lucide-react"
import "@uiw/react-md-editor/markdown-editor.css"
import "@uiw/react-markdown-preview/markdown.css"
import { commands, ICommand } from "@uiw/react-md-editor"

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false })

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  height?: number
  preview?: "edit" | "live" | "preview"
  placeholder?: string
}

export function MarkdownEditor({
  value,
  onChange,
  height = 500,
  preview = "live",
  placeholder = "Start writing your content in Markdown/MDX...",
}: MarkdownEditorProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [uploading, setUploading] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Core asset handler with placeholder replacement hooks
  const handleImageUpload = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("File must be an image format")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB")
      return
    }

    setUploading(true)
    
    // Create an identifiable uniquely named placeholder text
    const placeholderText = `![Uploading ${file.name || "image"}...]()`
    
    // Step 1: Find cursor location and drop placeholder instantly 
    const textarea = containerRef.current?.querySelector("textarea")
    let startPos = textarea?.selectionStart ?? value.length
    let endPos = textarea?.selectionEnd ?? value.length
    
    const beforeText = value.substring(0, startPos)
    const afterText = value.substring(endPos, value.length)
    
    // Set baseline state with placeholder embedded
    const valueWithPlaceholder = `${beforeText}${placeholderText}${afterText}`
    onChange(valueWithPlaceholder)

    try {
      const formData = new FormData()
      formData.append("file", file)
      
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Upload failed")
      }

      const data = await res.json()
      const imageMarkdown = `![${file.name || "Image"}](${data.secure_url})`
      
      // Step 2: Swap the temporary string out for the real link asset
      // We read fresh state directly from valueWithPlaceholder wrapper to prevent collision bugs
      const finalizedValue = valueWithPlaceholder.replace(placeholderText, imageMarkdown)
      onChange(finalizedValue)
      
      toast.success("Image uploaded successfully!")
    } catch (error) {
      console.error("Image upload failed:", error)
      toast.error(error instanceof Error ? error.message : "Failed to upload image")
      
      // Rollback: If upload fails, strip out the broken placeholder string
      const rollbackValue = valueWithPlaceholder.replace(placeholderText, "")
      onChange(rollbackValue)
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }, [value, onChange])

  const customCommands = useMemo(() => {
    const uploadImageCommand: ICommand = {
      name: "uploadImage",
      keyCommand: "uploadImage",
      buttonProps: { "aria-label": "Upload Image to Cloudinary" },
      icon: <ImagePlus style={{ width: '12px', height: '12px' }} />,
      execute: () => {
        fileInputRef.current?.click()
      },
    }

    return [
      ...commands.getCommands(),
      commands.divider,
      uploadImageCommand,
    ]
  }, [])

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    const file = files?.[0]
    if (file) {
      handleImageUpload(file)
    }
  }, [handleImageUpload])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }, [])

  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData?.items
    if (!items) return

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (item && item.type.indexOf("image") !== -1) {
        const file = item.getAsFile()
        if (file) {
          e.preventDefault()
          handleImageUpload(file)
          break
        }
      }
    }
  }, [handleImageUpload])

  if (!mounted) {
    return (
      <div style={{ height }} className="w-full border rounded-lg p-4 flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading content editor...</span>
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={containerRef}
      className="relative w-full" 
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onPaste={handlePaste}
    >
      {/* Tiny clean indicator badge instead of locking the whole screen */}
      {uploading && (
        <div className="absolute bottom-4 right-4 z-50 flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-900 border text-xs font-medium rounded-full shadow-md text-primary dark:text-blue-400 animate-pulse">
          <Loader2 className="h-3 w-3 animate-spin" />
          <span>Syncing media...</span>
        </div>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleImageUpload(file)
        }}
      />

      <div data-color-mode={theme === "dark" ? "dark" : "light"} className="w-full">
        <MDEditor
          value={value}
          onChange={(val) => onChange(val || "")}
          height={height}
          preview={preview}
          textareaProps={{ placeholder }}
          commands={customCommands}
          extraCommands={[]}
        />
      </div>
    </div>
  )
}
