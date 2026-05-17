"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Table } from "@tiptap/extension-table"
import { TableRow } from "@tiptap/extension-table-row"
import { TableHeader } from "@tiptap/extension-table-header"
import { TableCell } from "@tiptap/extension-table-cell"
import Image from "@tiptap/extension-image"
import Youtube from "@tiptap/extension-youtube"
import Placeholder from "@tiptap/extension-placeholder"
import Link from "@tiptap/extension-link"
import TextAlign from "@tiptap/extension-text-align"
import { TextStyle } from "@tiptap/extension-text-style"
import { Extension } from "@tiptap/core"
import { useEffect, useRef, useCallback } from "react"
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Table as TableIcon,
  Image as ImageIcon,
  Video,
  AlignLeft,
  AlignRight,
  AlignCenter,
  Link as LinkIcon,
  Quote,
  Minus,
  Undo,
  Redo,
} from "lucide-react"

// Custom extension for RTL/LTR direction on paragraphs
const TextDirection = Extension.create({
  name: "textDirection",
  addOptions() {
    return { types: ["paragraph", "heading", "blockquote"] }
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          dir: {
            default: null,
            parseHTML: (el) => el.getAttribute("dir"),
            renderHTML: (attrs) => (attrs.dir ? { dir: attrs.dir } : {}),
          },
        },
      },
    ]
  },
  addCommands() {
    return {
      setTextDirection:
        (direction: "ltr" | "rtl") =>
        ({ commands }: any) => {
          return this.options.types.every((type: string) =>
            commands.updateAttributes(type, { dir: direction }),
          )
        },
    } as any
  },
})

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  height?: number
  placeholder?: string
}

export function RichTextEditor({
  value,
  onChange,
  height = 500,
  placeholder = "Start writing your lecture content here...",
}: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isInternalChange = useRef(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      TextStyle,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TextDirection.configure({ types: ["paragraph", "heading", "blockquote"] }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Image.configure({ inline: false, allowBase64: true }),
      Youtube.configure({ width: 640, height: 360, nocookie: true }),
      Placeholder.configure({ placeholder }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "underline text-blue-600" } }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      isInternalChange.current = true
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: "outline-none min-h-[inherit] px-6 py-4 prose max-w-none dark:prose-invert prose-table:border prose-td:border prose-td:border-gray-300 prose-th:border prose-th:border-gray-300",
        style: `min-height: ${height}px`,
      },
    },
  })

  // Sync external value changes without causing loops
  useEffect(() => {
    if (!editor) return
    if (isInternalChange.current) {
      isInternalChange.current = false
      return
    }
    const current = editor.getHTML()
    if (current !== value) {
      editor.commands.setContent(value || "")
    }
  }, [editor, value])

  const insertTable = useCallback(() => {
    editor
      ?.chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run()
  }, [editor])

  const insertImage = useCallback(
    (src: string, alt = "Image") => {
      editor?.chain().focus().setImage({ src, alt }).run()
    },
    [editor],
  )

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      if (file.size > 4 * 1024 * 1024) {
        alert("Image size must be less than 4MB")
        return
      }
      try {
        const formData = new FormData()
        formData.append("file", file)
        const res = await fetch("/api/upload", { method: "POST", body: formData })
        if (!res.ok) throw new Error("Upload failed")
        const data = await res.json()
        insertImage(data.secure_url)
      } catch {
        // Fallback: insert as base64 local preview
        const reader = new FileReader()
        reader.onloadend = () => insertImage(reader.result as string)
        reader.readAsDataURL(file)
      }
      e.target.value = ""
    },
    [insertImage],
  )

  const insertYoutube = useCallback(() => {
    const url = window.prompt("Enter YouTube or Vimeo URL:")
    if (url) editor?.chain().focus().setYoutubeVideo({ src: url }).run()
  }, [editor])

  const insertLink = useCallback(() => {
    const url = window.prompt("Enter URL:")
    if (url) {
      editor
        ?.chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run()
    }
  }, [editor])

  if (!editor) return null

  const ToolbarButton = ({
    onClick,
    active,
    title,
    children,
  }: {
    onClick: () => void
    active?: boolean
    title: string
    children: React.ReactNode
  }) => (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault()
        onClick()
      }}
      title={title}
      className={`p-1.5 rounded hover:bg-accent transition-colors ${active ? "bg-accent text-accent-foreground" : "text-muted-foreground"}`}
    >
      {children}
    </button>
  )

  const Divider = () => <div className="w-px h-5 bg-border mx-1 self-center" />

  return (
    <div className="border rounded-lg overflow-hidden bg-background">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 p-2 border-b bg-muted/30">
        {/* History */}
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Undo">
          <Undo className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Redo">
          <Redo className="w-4 h-4" />
        </ToolbarButton>

        <Divider />

        {/* Text formatting */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="Blockquote"
        >
          <Quote className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Rule"
        >
          <Minus className="w-4 h-4" />
        </ToolbarButton>

        <Divider />

        {/* Headings */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive("heading", { level: 1 })}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </ToolbarButton>

        <Divider />

        {/* Lists */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Ordered List"
        >
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>

        <Divider />

        {/* Alignment */}
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          active={editor.isActive({ textAlign: "left" })}
          title="Align Left (LTR)"
        >
          <AlignLeft className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          active={editor.isActive({ textAlign: "center" })}
          title="Align Center"
        >
          <AlignCenter className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          active={editor.isActive({ textAlign: "right" })}
          title="Align Right (RTL)"
        >
          <AlignRight className="w-4 h-4" />
        </ToolbarButton>

        {/* RTL / LTR direction buttons */}
        <ToolbarButton
          onClick={() => (editor.commands as any).setTextDirection("rtl")}
          title="Right-to-Left (Arabic)"
        >
          <span className="text-xs font-bold px-1">RTL</span>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => (editor.commands as any).setTextDirection("ltr")}
          title="Left-to-Right (English)"
        >
          <span className="text-xs font-bold px-1">LTR</span>
        </ToolbarButton>

        <Divider />

        {/* Link */}
        <ToolbarButton
          onClick={insertLink}
          active={editor.isActive("link")}
          title="Insert Link"
        >
          <LinkIcon className="w-4 h-4" />
        </ToolbarButton>

        {/* Table */}
        <ToolbarButton onClick={insertTable} title="Insert Table">
          <TableIcon className="w-4 h-4" />
        </ToolbarButton>

        {/* Image upload */}
        <ToolbarButton
          onClick={() => fileInputRef.current?.click()}
          title="Insert Image"
        >
          <ImageIcon className="w-4 h-4" />
        </ToolbarButton>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />

        {/* Video embed */}
        <ToolbarButton onClick={insertYoutube} title="Embed YouTube / Vimeo Video">
          <Video className="w-4 h-4" />
        </ToolbarButton>
      </div>

      {/* Editor content area */}
      <EditorContent editor={editor} />
    </div>
  )
}
