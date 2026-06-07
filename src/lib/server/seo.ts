import "server-only";
import { Metadata } from "next";
import { getSiteSettings } from "./site-settings";
import { SEOMetadata } from "@/lib/shared/types";

export async function getSEOMetadata(
  hostname?: string | null,
): Promise<SEOMetadata> {
  const settings = await getSiteSettings(hostname);

  return {
    title: settings.siteName,
    description: settings.description,
    url: settings.siteUrl,
    ogImage: settings.ogImage || null,
  };
}

export async function generateSiteMetadata(
  hostname?: string | null,
): Promise<Metadata> {
  const seo = await getSEOMetadata(hostname);
  const base = new URL(seo.url);

  return {
    title: {
      default: seo.title,
      template: `%s | ${seo.title}`,
    },
    description: seo.description,
    metadataBase: base,
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: seo.url,
      siteName: seo.title,
      images: seo.ogImage ? [{ url: seo.ogImage }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: seo.ogImage ? [seo.ogImage] : [],
    },
  };
}
