import { z } from "zod"

export const sectionTypeSchema = z.enum(["hero", "features", "cta", "media", "testimonials"])

export const sectionSchema = z.object({
  type: sectionTypeSchema,
  title: z.string().nullable().optional(),
  body: z.string().nullable().optional(),
  ctaLabel: z.string().nullable().optional(),
  ctaHref: z.string().nullable().optional(),
  mediaUrl: z.string().nullable().optional(),
  mediaAlt: z.string().nullable().optional(),
  seoTitle: z.string().nullable().optional(),
  seoDescription: z.string().nullable().optional(),
  visible: z.boolean().default(true).optional(),
  order: z.number().int().default(0).optional(),
})

export const updateSectionSchema = sectionSchema.partial()
