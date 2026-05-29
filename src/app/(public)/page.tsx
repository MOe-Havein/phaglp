import React from "react"
import { Metadata } from "next"
import prisma from "@/lib/db/prisma"
import { HomepageSection } from "@/types/homepage"


import { SaaSHero } from "@/components/home/SaaSHero"
import { Features } from "@/components/home/Features"
import { CTA } from "@/components/home/CTA"
import { Media } from "@/components/home/Media"
import { Testimonials } from "@/components/home/testimonials"
import { LatestBlogPosts } from "@/components/home/LatestBlogPosts"
import { LatestLETURES } from "@/components/home/LatestLETURES"
import { CoursesPricing } from "@/components/home/CoursesPricing"

// Component implementations
function HeroSection({ data }: { data: HomepageSection }) {
  // Dynamically segment the database-configured title into pre, highlight, and post headings for the premium styling
  let headlinePre = "Supercharge Your"
  let headlineHighlight = "Intellectual Workflow"
  let headlinePost = "with AI Socratic Mapping"

  if (data.title) {
    const words = data.title.split(' ')
    if (words.length >= 3) {
      const segmentSize = Math.ceil(words.length / 3)
      headlinePre = words.slice(0, segmentSize).join(' ')
      headlineHighlight = words.slice(segmentSize, segmentSize * 2).join(' ')
      headlinePost = words.slice(segmentSize * 2).join(' ')
    } else if (words.length === 2) {
      headlinePre = words[0]
      headlineHighlight = words[1]
      headlinePost = ""
    } else {
      headlinePre = ""
      headlineHighlight = words[0]
      headlinePost = ""
    }
  }

  return (
    <SaaSHero
      badgeText="New Feature Release ->"
      headlinePre={headlinePre}
      headlineHighlight={headlineHighlight}
      headlinePost={headlinePost}
      subheadline={data.body || undefined}
      primaryCtaText={data.ctaLabel || undefined}
      primaryCtaHref={data.ctaHref || undefined}
      secondaryCtaText="Watch Demo"
      secondaryCtaHref="#demo"
    />
  )
}

const ComponentMap: Record<string, React.FC<{ data: HomepageSection }>> = {
  hero: HeroSection,
  features: ({ data }) => <Features title={data.title} body={data.body} mediaUrl={data.mediaUrl} mediaAlt={data.mediaAlt} />,
  cta: ({ data }) => <CTA title={data.title} body={data.body} ctaLabel={data.ctaLabel} ctaHref={data.ctaHref} />,
  media: ({ data }) => <Media title={data.title} body={data.body} mediaUrl={data.mediaUrl} mediaAlt={data.mediaAlt} />,
  testimonials: ({ data }) => <Testimonials title={data.title} body={data.body} ctaLabel={data.ctaLabel} ctaHref={data.ctaHref} />,
  lectures: ({ data }) => <LatestLETURES title={data.title || undefined} />,
}

export async function generateMetadata(): Promise<Metadata> {
  let firstSection = null
  let settings = null

  try {
    firstSection = await prisma.homepageSection.findFirst({
      where: { visible: true },
      orderBy: { order: "asc" },
    })
  } catch (error) {
    console.error("Failed to fetch homepage section for SEO metadata", error)
  }

  try {
    settings = await prisma.siteSettings.findFirst()
  } catch (error) {
    console.error("Failed to fetch site settings for SEO metadata", error)
  }

  const title = firstSection?.seoTitle || firstSection?.title || settings?.metaTitle || "Welcome to FreshNextJS"
  const description = firstSection?.seoDescription || firstSection?.body?.slice(0, 150) || settings?.metaDescription || ""

  return {
    title,
    description,
  }
}

export default async function PublicHomepage() {
  let sections: HomepageSection[] = []
  try {
    sections = await prisma.homepageSection.findMany({
      where: { visible: true },
      orderBy: { order: "asc" },
    })
  } catch (error) {
    console.error("Failed to fetch homepage sections:", error)
  }

  if (sections.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-tinfoil text-text-muted">
        <p className="text-xl">Homepage is currently under construction.</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen w-full flex flex-col">
      {sections.map((section) => {
        const Component = ComponentMap[section.type]
        if (!Component) return null
        return (
          <React.Fragment key={section.id}>
            <Component data={section} />
            {section.type === "hero" && (
              <div className="h-1 w-full bg-tinfoil" />
            )}
          </React.Fragment>
        )
      })}

      {/* Render the Courses Pricing Plans dynamically */}
      <CoursesPricing />

      {/* Render the newest blog posts dynamically */}
      <LatestBlogPosts />
    </main>
  )
}
