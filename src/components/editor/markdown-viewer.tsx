"use client";

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

const ReactMarkdown = dynamic(() => import("react-markdown"), { ssr: false });

interface MarkdownViewerProps {
  value: string;
  className?: string;
}

export function MarkdownViewer({ value, className }: MarkdownViewerProps) {
  const { theme } = useTheme();

  const baseClass = `prose prose-slate dark:prose-invert max-w-none ${className ?? ""}`;

  return (
    <div className={baseClass} data-color-mode={theme === "dark" ? "dark" : "light"}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[require("rehype-raw")], rehypeSanitize]}
      >
        {value}
      </ReactMarkdown>
    </div>
  );
}
