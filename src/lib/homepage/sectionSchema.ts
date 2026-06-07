import { z } from "zod";
import DOMPurify from "isomorphic-dompurify";

export const sectionTypeSchema = z.enum([
  "hero",
  "features",
  "cta",
  "media",
  "testimonials",
  "lectures",
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
});

export const updateSectionSchema = sectionSchema.partial();
