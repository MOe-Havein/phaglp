"use client"

import React, { useState } from "react"
import { Draggable } from "@hello-pangea/dnd"
import { GripVertical, Edit, Trash2, Eye, EyeOff } from "lucide-react"
import { HomepageSection } from "@/types/homepage"

interface SectionCardProps {
  section: HomepageSection
  index: number
  onEdit: (section: HomepageSection) => void
  onDelete: (id: string) => void
}

export function SectionCard({ section, index, onEdit, onDelete }: SectionCardProps) {
  const [isVisible, setIsVisible] = useState(section.visible)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleToggle = async () => {
    setIsVisible(!isVisible) // Optimistic UI update
    try {
      const res = await fetch(`/api/homepage/sections/${section.id}/toggle`, {
        method: "PATCH",
      })
      if (!res.ok) {
        setIsVisible(isVisible) // Revert on failure
      }
    } catch (e) {
      setIsVisible(isVisible)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this section?")) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/homepage/sections/${section.id}`, {
        method: "DELETE",
      })
      if (res.ok) {
        onDelete(section.id)
      }
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Draggable draggableId={section.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          style={provided.draggableProps.style as React.CSSProperties}
          className={`flex items-center justify-between p-4 mb-2 border rounded-md surface ${
            snapshot.isDragging ? "shadow-lg border-primary opacity-90" : "border-border shadow-sm"
          } bg-surface`}
        >
          <div className="flex items-center gap-4 flex-1">
            <div
              {...provided.dragHandleProps}
              className="text-muted cursor-grab active:cursor-grabbing hover:text-primary transition-colors p-1"
            >
              <GripVertical size={20} />
            </div>

            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary uppercase tracking-wide">
                {section.type}
              </span>
              <span className="font-medium text-foreground">
                {section.title || "Untitled Section"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleToggle}
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${isVisible ? "text-primary" : "text-muted"}`}
              title="Toggle Visibility"
            >
              {isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>

            <div className="w-px h-6 bg-border mx-1"></div>

            <button
              onClick={() => onEdit(section)}
              className="p-1.5 text-muted hover:text-primary transition-colors rounded-md hover:bg-primary/5"
              title="Edit Section"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-1.5 text-muted hover:text-red-500 transition-colors rounded-md hover:bg-red-500/10 disabled:opacity-50"
              title="Delete Section"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      )}
    </Draggable>
  )
}
