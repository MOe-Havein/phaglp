"use client"

import DOMPurify from "isomorphic-dompurify"

interface RichTextViewerProps {
  html: string
  className?: string
}

// Tailwind prose + custom RTL / table styles injected as a style tag
const viewerStyles = `
  .rich-viewer [dir="rtl"] {
    direction: rtl;
    text-align: right;
    font-family: inherit;
  }
  .rich-viewer [dir="ltr"] {
    direction: ltr;
    text-align: left;
  }
  .rich-viewer table {
    border-collapse: collapse;
    width: 100%;
    margin: 1rem 0;
  }
  .rich-viewer th,
  .rich-viewer td {
    border: 1px solid #cbd5e1;
    padding: 8px 12px;
    text-align: inherit;
  }
  .rich-viewer th {
    background: #f1f5f9;
    font-weight: 600;
  }
  .rich-viewer img {
    max-width: 100%;
    border-radius: 0.5rem;
    margin: 0.5rem 0;
  }
  .rich-viewer iframe {
    max-width: 100%;
    border-radius: 0.5rem;
    margin: 0.5rem 0;
  }
  .dark .rich-viewer th {
    background: #1e293b;
  }
  .dark .rich-viewer th,
  .dark .rich-viewer td {
    border-color: #334155;
  }
`

export function RichTextViewer({ html, className }: RichTextViewerProps) {
  const clean = DOMPurify.sanitize(html, {
    ADD_TAGS: ["iframe"],
    ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling", "dir", "style"],
  })

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: viewerStyles }} />
      <div
        className={`rich-viewer prose prose-slate max-w-none dark:prose-invert ${className ?? ""}`}
        dangerouslySetInnerHTML={{ __html: clean }}
      />
    </>
  )
}
