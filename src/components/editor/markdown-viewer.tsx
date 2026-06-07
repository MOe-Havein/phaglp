"use client";

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import "@uiw/react-markdown-preview/markdown.css";

import rehypeSanitize from "rehype-sanitize";

const MarkdownPreview = dynamic(
  () => import("@uiw/react-markdown-preview").then((mod) => mod.default),
  { ssr: false },
);

interface MarkdownViewerProps {
  value: string;
  className?: string;
}

export function MarkdownViewer({ value, className }: MarkdownViewerProps) {
  const { theme } = useTheme();
  console.log('MarkdownViewer value:', value);
  return (
    <div
      className={className}
      data-color-mode={theme === "dark" ? "dark" : "light"}
    >
      <MarkdownPreview
        source={value}
        style={{ backgroundColor: "transparent" }}
        rehypePlugins={[[require("rehype-raw")], rehypeSanitize]}
      />
    </div>
  );
}
