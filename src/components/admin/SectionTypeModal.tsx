"use client";

import React from "react";
import { SectionType } from "@/types/homepage";
import {
  LayoutTemplate,
  Image as ImageIcon,
  MessageSquare,
  Handshake,
  Columns,
  GraduationCap,
} from "lucide-react";

interface SectionTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: SectionType) => void;
}

export function SectionTypeModal({
  isOpen,
  onClose,
  onSelect,
}: SectionTypeModalProps) {
  if (!isOpen) return null;

  const types: {
    type: SectionType;
    icon: React.ReactNode;
    label: string;
    desc: string;
  }[] = [
    {
      type: "hero",
      icon: <LayoutTemplate size={24} />,
      label: "Hero",
      desc: "Main headline and primary call-to-action",
    },
    {
      type: "features",
      icon: <Columns size={24} />,
      label: "Features",
      desc: "Highlight key benefits with grid layouts",
    },
    {
      type: "cta",
      icon: <Handshake size={24} />,
      label: "Call to Action",
      desc: "A strong banner to drive conversions",
    },
    {
      type: "media",
      icon: <ImageIcon size={24} />,
      label: "Media",
      desc: "Image or video showcase block",
    },
    {
      type: "testimonials",
      icon: <MessageSquare size={24} />,
      label: "Testimonials",
      desc: "Customer quotes and social proof",
    },
    {
      type: "lectures",
      icon: <GraduationCap size={24} />,
      label: "Latest Lectures",
      desc: "Horizontal Coursera-styled grid displaying the latest lectures",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-surface border border-border w-full max-w-lg rounded-xl shadow-xl overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">
            Add New Section
          </h2>
          <button
            onClick={onClose}
            className="text-muted hover:text-foreground text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        <div className="p-6 grid gap-3 max-h-[70vh] overflow-y-auto">
          {types.map((t) => (
            <button
              key={t.type}
              onClick={() => onSelect(t.type)}
              className="flex items-center gap-4 p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all text-left group"
            >
              <div className="text-muted group-hover:text-primary transition-colors">
                {t.icon}
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{t.label}</h3>
                <p className="text-sm text-text-muted mt-0.5">{t.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
