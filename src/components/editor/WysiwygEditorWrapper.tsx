"use client";

import { WysiwygMarkdownEditor } from "@/components/editor/wysiwyg-markdown-editor";

interface WrapperProps {
  value: string;
  onChange?: (value: string) => void;
  height: number; // required height for editor
}

export default function WysiwygEditorWrapper({
  value,
  onChange = () => {},
  height,
}: WrapperProps) {
  return (
    <WysiwygMarkdownEditor value={value} onChange={onChange} height={height} />
  );
}
