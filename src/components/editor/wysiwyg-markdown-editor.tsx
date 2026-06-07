"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { Markdown } from "tiptap-markdown";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import "highlight.js/styles/github-dark.css"; // Add styles for syntax highlighting
import CustomTextDirection from "@/components/editor/custom-text-direction";
import { CldUploadWidget } from "next-cloudinary";
import { useEffect, useRef, useCallback, useMemo } from "react";
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
  CodeSquare,
} from "lucide-react";

const lowlight = createLowlight(common);

// Custom extension for RTL/LTR direction on paragraphs


interface WysiwygMarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: number;
  placeholder?: string;
}

export function WysiwygMarkdownEditor({
  value,
  onChange,
  height = 500,
  placeholder = "Start typing here... Visual editor that outputs pure Markdown!",
}: WysiwygMarkdownEditorProps) {
  const isInternalChange = useRef(false);

  const extensions = useMemo(
    () => [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: false, // We use the lowlight code block instead
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      TextStyle,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      CustomTextDirection.configure({
        types: ["paragraph", "heading", "blockquote"],
      }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Image.configure({ inline: false, allowBase64: true }),
      Youtube.configure({ width: 640, height: 360, nocookie: true }),
      Placeholder.configure({ placeholder }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "underline text-blue-600" },
      }),
      Markdown.configure({
        html: true,
        transformPastedText: true,
      }),
    ],
    [placeholder],
  );

  const editor = useEditor({
    immediatelyRender: false,
    extensions,
    content: value,
    onUpdate: ({ editor }) => {
      isInternalChange.current = true;
      onChange((editor.storage as any).markdown.getMarkdown());
    },
    editorProps: {
      attributes: {
        class:
          "outline-none min-h-[inherit] px-6 py-4 prose max-w-none dark:prose-invert prose-table:border prose-td:border prose-td:border-gray-300 prose-th:border prose-th:border-gray-300",
        style: `min-height: ${height}px`,
      },
    },
  });

  // Sync external value changes without causing loops
  useEffect(() => {
    if (!editor) return;
    if (isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }
    const current = (editor.storage as any).markdown.getMarkdown();
    if (current !== value) {
      editor.commands.setContent(value || "");
    }
  }, [editor, value]);

  const insertTable = useCallback(() => {
    editor
      ?.chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  }, [editor]);

  const insertImage = useCallback(
    (src: string, alt = "Image") => {
      editor?.chain().focus().setImage({ src, alt }).run();
    },
    [editor],
  );

  const insertYoutube = useCallback(() => {
    const url = window.prompt("Enter YouTube or Vimeo URL:");
    if (url) editor?.chain().focus().setYoutubeVideo({ src: url }).run();
  }, [editor]);

  const insertLink = useCallback(() => {
    const url = window.prompt("Enter URL:");
    if (url) {
      editor
        ?.chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    }
  }, [editor]);

  

  const ToolbarButton = ({
    onClick,
    active,
    title,
    children,
  }: {
    onClick: () => void;
    active?: boolean;
    title: string;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      title={title}
      className={`p-1.5 rounded hover:bg-accent transition-colors ${active ? "bg-accent text-accent-foreground" : "text-muted-foreground"}`}
    >
      {children}
    </button>
  );

  const Divider = () => <div className="w-px h-5 bg-border mx-1 self-center" />;

  const cloudinaryOptions = useMemo(
    () => ({
      multiple: false,
      folder: "phaglp/lectures",
    }),
    [],
  );
if (!editor) return null;
  return (
    <div className="border rounded-lg overflow-hidden bg-background">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 p-2 border-b bg-muted/30">
        {/* History */}
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          title="Redo"
        >
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
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive("codeBlock")}
          title="Code Block"
        >
          <CodeSquare className="w-4 h-4" />
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
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          active={editor.isActive("heading", { level: 1 })}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          active={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
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

        {/* Image upload widget */}
        <CldUploadWidget
          signatureEndpoint="/api/sign-cloudinary-params"
          options={cloudinaryOptions}
          onSuccess={(result: any) => {
            if (result?.info?.secure_url) {
              insertImage(result.info.secure_url);
            }
          }}
        >
          {({ open }) => (
            <ToolbarButton onClick={() => open()} title="Insert Image">
              <ImageIcon className="w-4 h-4" />
            </ToolbarButton>
          )}
        </CldUploadWidget>

        {/* Video embed */}
        <ToolbarButton
          onClick={insertYoutube}
          title="Embed YouTube / Vimeo Video"
        >
          <Video className="w-4 h-4" />
        </ToolbarButton>
      </div>

      {/* Editor content area */}
      <EditorContent editor={editor} />
    </div>
  );
}
