import React from "react";
import { Metadata } from "next";
import prisma from "@/lib/db/prisma"; // Ensure this path matches your actual prisma client location

import { SaaSHero } from "@/components/home/SaaSHero";
import { LatestLETURES } from "@/components/home/LatestLETURES";
import dynamic from "next/dynamic";

const Features = dynamic(() =>
  import("@/components/home/Features").then((mod) => mod.Features),
);
/*const CTA = dynamic(() =>
  import("@/components/home/CTA").then((mod) => mod.CTA),
);
const Media = dynamic(() =>
  import("@/components/home/Media").then((mod) => mod.Media),
);
const Testimonials = dynamic(() =>
  import("@/components/home/testimonials").then((mod) => mod.Testimonials),
);
*/
const LatestBlogPosts = dynamic(() =>
  import("@/components/home/LatestBlogPosts").then(
    (mod) => mod.LatestBlogPosts,
  ),
);
const CoursesPricing = dynamic(() =>
  import("@/components/home/CoursesPricing").then((mod) => mod.CoursesPricing),
);

export async function generateMetadata(): Promise<Metadata> {
  let settings = null;
  try {
    settings = await prisma.siteSettings.findFirst();
  } catch (error) {
    console.error("Failed to fetch site settings for SEO metadata", error);
  }

  return {
    title: settings?.metaTitle || "Welcome to FreshNextJS",
    description: settings?.metaDescription || "Supercharge your workflow",
  };
}

export default function PublicHomepage() {
  return (
    <main className="w-full flex flex-col">
      <SaaSHero
        badgeText="Phaglp - Philosophical Platform"
        headlinePre="THE PHILOSOPHICAL ACADEMY "
        headlineHighlight="FOR GENIUSES LIFE PLANNING"
        headlinePost="A modern application for philosophical education."
        primaryCtaText="Get Started"
        primaryCtaHref="/courses"
        secondaryCtaText="Read Lectures"
        secondaryCtaHref="/lectures"
      />
      
      <div className="h-1 w-full bg-tinfoil" />

      <Features
        title="Explore Our Core Pillars"
        body="A comprehensive approach to education, science, and philosophical wisdom"
        mediaUrl=""
        mediaAlt="Explore Our Core Pillars"
      />

      <CoursesPricing />
      <LatestLETURES />
      
      {/* Fixed capitalization: bg-Platinum is now bg-platinum */}
      <div className="h-1 w-full bg-platinum" />

      <LatestBlogPosts />
    </main>
  );
}
