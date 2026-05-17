"use client"

import React, { useState, useEffect } from "react"
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd"
import { Plus } from "lucide-react"
import { HomepageSection, SectionType } from "@/types/homepage"
import { SectionCard } from "./SectionCard"
import { SectionTypeModal } from "./SectionTypeModal"
import { SectionEditModal } from "./SectionEditModal"

interface HomepageEditorProps {
  initialSections: HomepageSection[]
}

export function HomepageEditor({ initialSections }: HomepageEditorProps) {
  const [sections, setSections] = useState<HomepageSection[]>(initialSections)
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const [sectionToEdit, setSectionToEdit] = useState<HomepageSection | null>(null)
  const [newSectionType, setNewSectionType] = useState<SectionType | null>(null)

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return

    const startIndex = result.source.index
    const endIndex = result.destination.index

    if (startIndex === endIndex) return

    // Reorder locally
    const reordered = Array.from(sections)
    const [removed] = reordered.splice(startIndex, 1)
    reordered.splice(endIndex, 0, removed)

    setSections(reordered)

    // Save to backend
    const orderedIds = reordered.map((s) => s.id)
    try {
      await fetch("/api/homepage/sections/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds }),
      })
    } catch (e) {
      console.error("Failed to reorder sections", e)
    }
  }

  const handleAddClick = () => {
    setSectionToEdit(null)
    setIsTypeModalOpen(true)
  }

  const handleTypeSelect = (type: SectionType) => {
    setIsTypeModalOpen(false)
    setNewSectionType(type)
    setIsEditModalOpen(true)
  }

  const handleEditClick = (section: HomepageSection) => {
    setSectionToEdit(section)
    setNewSectionType(null)
    setIsEditModalOpen(true)
  }

  const handleSectionSaved = (savedSection: HomepageSection) => {
    setIsEditModalOpen(false)

    if (sectionToEdit) {
      setSections(sections.map((s) => (s.id === savedSection.id ? savedSection : s)))
    } else {
      setSections([...sections, savedSection])
    }
  }

  const handleSectionDelete = (id: string) => {
    setSections(sections.filter((s) => s.id !== id))
  }

  if (!mounted) return null // Prevent hydration errors with DnD context

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Homepage Builder</h1>
          <p className="text-sm text-text-muted mt-1">
            Drag to reorder sections. Changes save automatically.
          </p>
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors font-medium shadow-sm"
        >
          <Plus size={18} />
          <span>Add Section</span>
        </button>
      </div>

      {sections.length === 0 ? (
        <div className="p-12 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-center">
          <p className="text-text-muted font-medium mb-4">No sections yet. Build your page!</p>
          <button
            onClick={handleAddClick}
            className="flex items-center gap-2 text-primary font-medium hover:underline"
          >
            <Plus size={18} />
            <span>Add your first section</span>
          </button>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="homepage-sections">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                {sections.map((section, index) => (
                  <SectionCard
                    key={section.id}
                    section={section}
                    index={index}
                    onEdit={handleEditClick}
                    onDelete={handleSectionDelete}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      <SectionTypeModal
        isOpen={isTypeModalOpen}
        onClose={() => setIsTypeModalOpen(false)}
        onSelect={handleTypeSelect}
      />

      <SectionEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        sectionToEdit={sectionToEdit}
        defaultType={newSectionType}
        onSaved={handleSectionSaved}
      />
    </div>
  )
}
