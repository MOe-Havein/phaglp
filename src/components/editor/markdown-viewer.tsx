"use client";

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import rehypeRaw from "rehype-raw";
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
    <div
      className={baseClass}
      data-color-mode={theme === "dark" ? "dark" : "light"}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={{
          img: ({ src, alt, ...props }) => {
            const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "phaglp";
            const isStringSrc = typeof src === "string";
            const isPublicId = isStringSrc && !src.startsWith("http") && !src.startsWith("/");
            const resolvedSrc = isPublicId
              ? `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto/${src}`
              : src;
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={resolvedSrc}
                alt={alt || "Blog post image"}
                className="rounded-xl border border-slate-200 dark:border-slate-800 my-6 max-h-[500px] object-contain shadow-sm"
                {...props}
              />
            );
          }
        }}
      >
        {value}
      </ReactMarkdown>
    </div>
  );
}
