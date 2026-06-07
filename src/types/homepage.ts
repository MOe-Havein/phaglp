import { HomepageSection as PrismaHomepageSection } from "@prisma/client";

export type HomepageSection = PrismaHomepageSection;

export type SectionType =
  | "hero"
  | "features"
  | "cta"
  | "media"
  | "testimonials"
  | "lectures";

export interface CreateSectionInput {
  type: SectionType;
  title?: string | null;
  body?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  mediaUrl?: string | null;
  mediaAlt?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  visible?: boolean;
  order?: number;
}

export type UpdateSectionInput = Partial<CreateSectionInput>;
