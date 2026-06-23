import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button"
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
      <SaaSHero />
      
      <div className="h-1 w-full bg-tinfoil" />

      <Features
        title="Explore Our Core Pillars"
        body="A comprehensive approach to education, science, and philosophical wisdom"
        mediaUrl=""
        mediaAlt="Explore Our Core Pillars"
      />

      <CoursesPricing />
      <LatestLETURES />
      



      <LatestBlogPosts />

<section className="py-24 px-4 pg-platinum relative">


        <div className="container mx-auto text-center relative">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 text-balance">
            GENERAL PROGRAM OF LIFE PLANNING?!
          </h2>
          <p className="text-perfectsky text-lg mb-8 max-w-2xl mx-auto">

Discover the comprehensive pathways engineered to lead minds toward absolute excellence.
          </p>
          <Button
            size="lg"
            className="bg-tartorange text-white hover:bg-tartorange/90 shadow-xl shadow-tartorange-950/20 text-lg px-12 py-6 h-auto"
            asChild
          >
            <Link href="/learning-path">
              Join Learning Path <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>

      </section>
      
    </main>
  );
}
