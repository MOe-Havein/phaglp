"use client"

import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { sectionSchema } from "@/lib/homepage/sectionSchema"
import { CreateSectionInput, HomepageSection } from "@/types/homepage"

interface SectionEditModalProps {
  isOpen: boolean
  onClose: () => void
  sectionToEdit: HomepageSection | null
  defaultType: CreateSectionInput["type"] | null
  onSaved: (section: HomepageSection) => void
}

export function SectionEditModal({
  isOpen,
  onClose,
  sectionToEdit,
  defaultType,
  onSaved,
}: SectionEditModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateSectionInput>({
    resolver: zodResolver(sectionSchema),
    defaultValues: { visible: true },
  })

  useEffect(() => {
    if (isOpen) {
      if (sectionToEdit) {
        reset({ ...sectionToEdit, type: sectionToEdit.type as CreateSectionInput["type"] })
      } else {
        reset({ type: defaultType || "hero", visible: true })
      }
    }
  }, [isOpen, sectionToEdit, defaultType, reset])

  if (!isOpen) return null

  const onSubmit = async (data: CreateSectionInput) => {
    try {
      const url = sectionToEdit
        ? `/api/homepage/sections/${sectionToEdit.id}`
        : `/api/homepage/sections`
      const method = sectionToEdit ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error("Failed to save section")
      const savedSection = await res.json()
      onSaved(savedSection)
    } catch (error) {
      console.error(error)
      alert("Failed to save. Please try again.")
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-surface border border-border w-full max-w-2xl rounded-xl shadow-xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-text-primary">
            {sectionToEdit ? "Edit Section" : "Configure Section"}
          </h2>
          <button
            onClick={onClose}
            className="text-muted hover:text-text-primary text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          <form id="section-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input type="hidden" {...register("type")} />

            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Title</label>
              <input
                {...register("title")}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Section Headline"
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Body Text</label>
              <textarea
                {...register("body")}
                rows={4}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Add text content here..."
              />
              {errors.body && <p className="text-red-500 text-xs mt-1">{errors.body.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">CTA Label</label>
                <input
                  {...register("ctaLabel")}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g. Get Started"
                />
                {errors.ctaLabel && (
                  <p className="text-red-500 text-xs mt-1">{errors.ctaLabel.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">CTA Href</label>
                <input
                  {...register("ctaHref")}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g. /signup"
                />
                {errors.ctaHref && (
                  <p className="text-red-500 text-xs mt-1">{errors.ctaHref.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">Media URL</label>
                <input
                  {...register("mediaUrl")}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="https://..."
                />
                {errors.mediaUrl && (
                  <p className="text-red-500 text-xs mt-1">{errors.mediaUrl.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">
                  Media Alt Text
                </label>
                <input
                  {...register("mediaAlt")}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Description of media"
                />
                {errors.mediaAlt && (
                  <p className="text-red-500 text-xs mt-1">{errors.mediaAlt.message}</p>
                )}
              </div>
            </div>

            <div className="border-t border-border pt-4 mt-4">
              <h3 className="text-sm font-semibold text-text-primary mb-3">SEO Overrides</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1">
                    SEO Title
                  </label>
                  <input
                    {...register("seoTitle")}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1">
                    SEO Description
                  </label>
                  <input
                    {...register("seoDescription")}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("visible")}
                  className="w-4 h-4 rounded text-primary focus:ring-primary bg-background border-border"
                />
                <span className="text-sm font-medium text-text-primary">Visible publicly</span>
              </label>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-border flex justify-end gap-3 bg-surface rounded-b-xl">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-text-primary hover:bg-background rounded-md border border-transparent transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="section-form"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-md transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Section"}
          </button>
        </div>
      </div>
    </div>
  )
}
