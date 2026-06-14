import { z } from "zod";
import DOMPurify from "isomorphic-dompurify";

/**
 * 1. Updated Section Enum Types Matrix
 * Includes 'blogs' and 'footer' to match types/homepage.ts
 */
export const sectionTypeSchema = z.enum([
  "hero",
  "features",
  "cta",
  "media",
  "testimonials",
  "lectures",
  "blogs",  // 🆕 Added validation for latest blogs section
  "footer", // 🆕 Added validation for dynamic footer section
]);

const sanitizedString = () =>
  z
    .string()
    .nullable()
    .optional()
    .transform((val) => {
      if (!val) return val;
      return DOMPurify.sanitize(val, {
        ALLOWED_TAGS: [
          "b",
          "i",
          "em",
          "strong",
          "a",
          "p",
          "br",
          "ul",
          "ol",
          "li",
          "h1",
          "h2",
          "h3",
          "span",
        ],
        ALLOWED_ATTR: ["href", "target", "rel", "class"],
      });
    });

/**
 * 2. Nested Metadata Schemas for Complex Extra Config Layouts
 * This validates JSON configurations before writing them to the database.
 */
const blogSectionConfigSchema = z.object({
  limit: z.number().int().min(1).max(20).default(3),
  layout: z.enum(["grid", "list", "carousel"]).default("grid"),
  categorySlug: z.string().optional(),
  showDate: z.boolean().default(true),
});

const footerSectionConfigSchema = z.object({
  layout: z.enum(["simple", "multi-column", "minimal"]).default("multi-column"),
  copyrightText: z.string().optional(),
  showNewsletterInput: z.boolean().default(false),
  socials: z.object({
    twitter: z.string().url().optional().or(z.literal("")),
    linkedin: z.string().url().optional().or(z.literal("")),
    github: z.string().url().optional().or(z.literal("")),
    youtube: z.string().url().optional().or(z.literal("")),
  }).optional(),
  linkGroups: z.array(
    z.object({
      headline: z.string(),
      links: z.array(
        z.object({
          label: z.string(),
          href: z.string(),
          isExternal: z.boolean().optional(),
        })
      ),
    })
  ).optional(),
});

/**
 * 3. Unified Validation Layout Parser Object
 */
export const sectionSchema = z.object({
  type: sectionTypeSchema,
  title: sanitizedString(),
  body: sanitizedString(),
  ctaLabel: z.string().nullable().optional(),
  ctaHref: z.string().nullable().optional(),
  mediaUrl: z.string().nullable().optional(),
  mediaAlt: z.string().nullable().optional(),
  seoTitle: z.string().nullable().optional(),
  seoDescription: z.string().nullable().optional(),
  visible: z.boolean().default(true).optional(),
  order: z.number().int().default(0).optional(),
  
  // 🆕 Extra Dynamic Data Column Configuration Interceptor
  // Use z.union or z.any depending on whether your Prisma model type is an JSON object field.
  extraConfig: z.union([
    blogSectionConfigSchema,
    footerSectionConfigSchema,
    z.any()
  ]).nullable().optional(),
});

export const updateSectionSchema = sectionSchema.partial();
