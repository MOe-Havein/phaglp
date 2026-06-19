import React from "react";
import { Metadata } from "next";
import prisma from "@/lib/db/prisma";

import { SaaSHero } from "@/components/home/SaaSHero";
import { LatestLETURES } from "@/components/home/LatestLETURES";
import dynamic from "next/dynamic";

const Features = dynamic(() =>
  import("@/components/home/Features").then((mod) => mod.Features),
);
const CTA = dynamic(() =>
  import("@/components/home/CTA").then((mod) => mod.CTA),
);
const Media = dynamic(() =>
  import("@/components/home/Media").then((mod) => mod.Media),
);
const Testimonials = dynamic(() =>
  import("@/components/home/testimonials").then((mod) => mod.Testimonials),
);
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
        badgeText="New Feature Release ->"
        headlinePre="Supercharge Your"
        headlineHighlight="Intellectual Workflow"
        headlinePost="with AI Socratic Mapping"
        subheadline="Join thousands of professionals organizing their thoughts and accelerating their learning with our advanced AI tools."
        primaryCtaText="Get Started"
        primaryCtaHref="/signup"
        secondaryCtaText="Watch Demo"
        secondaryCtaHref="#demo"
      />
      <div className="h-1 w-full bg-tinfoil" />

      <Features
        title="Powerful Features"
        body="Discover the tools that will transform the way you work and learn."
        mediaUrl=""
        mediaAlt="App Features Interface"
      />

      <Media
        title="See It In Action"
        body="Watch how our platform effortlessly handles complex workflows."
        mediaUrl=""
        mediaAlt="Product Demo Video or Image"
      />

      <Testimonials
        title="What Our Users Say"
        body="Join our growing community of satisfied learners."
        ctaLabel="Read More Stories"
        ctaHref="/testimonials"
      />

      <CTA
        title="Ready to Elevate Your Knowledge?"
        body="Start your free trial today and experience the difference."
        ctaLabel="Sign Up Now"
        ctaHref="/signup"
      />

      <CoursesPricing />
      <LatestLETURES />

      <LatestBlogPosts />
    </main>
  );
}

