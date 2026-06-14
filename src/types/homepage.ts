import { HomepageSection as PrismaHomepageSection } from "@prisma/client";

export const SECTION_TYPES = [
  "hero",
  "features",
  "cta",
  "media",
  "testimonials",
  "lectures",
  "blogs",
  "footer", // 🆕 Added footer section type
] as const;

export type SectionType = typeof SECTION_TYPES[number];

/**
 * 1. Specialized Footer Data Interfaces
 */
export interface FooterLinkItem {
  label: string;
  href: string;
  isExternal?: boolean;
}

export interface FooterLinkGroup {
  headline: string;
  links: FooterLinkItem[];
}

export interface FooterSocials {
  twitter?: string;
  linkedin?: string;
  github?: string;
  youtube?: string;
}

export interface FooterSectionConfig {
  layout: "simple" | "multi-column" | "minimal";
  decriptionText?: string;
  copyrightText?: string;
  showNewsletterInput?: boolean;
  socials?: FooterSocials;
  linkGroups?: FooterLinkGroup[]; // Handles dynamic structural column lists
}

/**
 * 2. Pre-Existing Component Configurations
 */
export interface BlogSectionConfig {
  limit: number;
  layout: "grid" | "list" | "carousel";
  categorySlug?: string;
  showDate?: boolean;
}

export interface FeaturesSectionConfig {
  columns: 2 | 3 | 4;
  items: Array<{ icon?: string; title: string; description: string }>;
}

export interface LecturesSectionConfig {
  limit: number;
  featuredOnly?: boolean;
  sortBy?: "date" | "popularity";
}

/**
 * 3. Base Structural Columns
 */
interface BaseSectionFields {
  title?: string | null;
  body?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  mediaUrl?: string | null; // Can double as the Footer Brand Logo URL
  mediaAlt?: string | null; // Can double as Footer Logo Alt text
  seoTitle?: string | null;
  seoDescription?: string | null;
  visible?: boolean;
  order?: number;
}

/**
 * 4. The Discriminated Input Union
 */
export type CreateSectionInput =
  | (BaseSectionFields & { type: "hero" })
  | (BaseSectionFields & { type: "cta" })
  | (BaseSectionFields & { type: "media" })
  | (BaseSectionFields & { type: "testimonials" })
  | (BaseSectionFields & { type: "features"; extraConfig?: FeaturesSectionConfig })
  | (BaseSectionFields & { type: "lectures"; extraConfig?: LecturesSectionConfig })
  | (BaseSectionFields & { type: "blogs"; extraConfig?: BlogSectionConfig })
  | (BaseSectionFields & { type: "footer"; extraConfig?: FooterSectionConfig }); // 🆕 Type-safe structure for footers

export type UpdateSectionInput = Partial<CreateSectionInput>;

export type HomepageSection = Omit<PrismaHomepageSection, "type" | "extraConfig"> & CreateSectionInput & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};
