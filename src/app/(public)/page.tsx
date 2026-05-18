import React from "react"
import { Metadata } from "next"
import prisma from "@/lib/db/prisma"
import { HomepageSection } from "@/types/homepage"

export const dynamic = "force-dynamic"


// Component implementations
function HeroSection({ data }: { data: HomepageSection }) {
  return (
    <section className="relative flex flex-col items-center justify-center text-center py-24 md:py-32 px-6 bg-white dark:bg-gray-950 overflow-hidden">
      <div className="max-w-5xl mx-auto flex flex-col items-center">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 px-4 py-1.5 text-sm font-medium text-blue-700 dark:text-blue-300">
          Phaglp - Philosophical Platform
        </div>

        {/* Heading */}
        {data.title && (
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-[#2563EB] dark:text-blue-500 uppercase leading-[1.1] mb-8 text-balance">
            {data.title}
          </h1>
        )}

        {/* Subtitle */}
        {data.body && (
          <p className="text-lg md:text-xl text-[#475569] dark:text-gray-400 mb-10 max-w-2xl text-balance">
            {data.body}
          </p>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          {data.ctaLabel && data.ctaHref && (
            <a
              href={data.ctaHref}
              className="inline-flex items-center justify-center bg-[#F97316] hover:bg-[#EA580C] text-white font-medium px-8 py-3.5 rounded-md transition-colors shadow-sm"
            >
              {data.ctaLabel}
              <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          )}
          <a
            href="/lectures"
            className="inline-flex items-center justify-center bg-white dark:bg-transparent text-[#2563EB] dark:text-blue-400 border border-[#CBD5E1] dark:border-blue-800 font-medium px-8 py-3.5 rounded-md hover:bg-slate-50 dark:hover:bg-blue-900/30 transition-colors shadow-sm"
          >
            Read Lectures
          </a>
        </div>
      </div>
    </section>
  )
}

function FeaturesSection({ data }: { data: HomepageSection }) {
  return (
    <section className="py-24 px-6 bg-background">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-text-primary mb-12">{data.title}</h2>
        {data.body && (
          <div className="text-text-muted leading-relaxed max-w-3xl mx-auto mb-12">{data.body}</div>
        )}
        {data.mediaUrl && (
          <img
            src={data.mediaUrl}
            alt={data.mediaAlt || "Feature Preview"}
            className="rounded-xl shadow-lg border border-border mx-auto max-w-full"
          />
        )}
      </div>
    </section>
  )
}

function CTASection({ data }: { data: HomepageSection }) {
  return (
    <section className="py-16 px-6 bg-primary text-white text-center">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">{data.title}</h2>
        {data.body && <p className="text-lg mb-8 opacity-90">{data.body}</p>}
        {data.ctaLabel && data.ctaHref && (
          <a
            href={data.ctaHref}
            className="inline-block bg-white text-primary font-bold px-8 py-4 rounded-full hover:bg-gray-100 transition-all shadow-md hover:shadow-lg"
          >
            {data.ctaLabel}
          </a>
        )}
      </div>
    </section>
  )
}

function MediaSection({ data }: { data: HomepageSection }) {
  return (
    <section className="py-20 px-6 bg-surface">
      <div className="max-w-5xl mx-auto">
        {data.title && (
          <h2 className="text-3xl font-bold text-center text-text-primary mb-8">{data.title}</h2>
        )}
        {data.mediaUrl && (
          <div className="rounded-2xl overflow-hidden shadow-xl border border-border">
            <img src={data.mediaUrl} alt={data.mediaAlt || "Media"} className="w-full h-auto" />
          </div>
        )}
      </div>
    </section>
  )
}

function TestimonialsSection({ data }: { data: HomepageSection }) {
  return (
    <section className="py-24 px-6 bg-background">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-text-primary mb-12">{data.title}</h2>
        <blockquote className="text-2xl italic text-text-muted mb-8">"{data.body}"</blockquote>
      </div>
    </section>
  )
}

const ComponentMap: Record<string, React.FC<{ data: HomepageSection }>> = {
  hero: HeroSection,
  features: FeaturesSection,
  cta: CTASection,
  media: MediaSection,
  testimonials: TestimonialsSection,
}

export async function generateMetadata(): Promise<Metadata> {
  const firstSection = await prisma.homepageSection.findFirst({
    where: { visible: true },
    orderBy: { order: "asc" },
  })

  if (!firstSection) {
    return { title: "Welcome to FreshNextJS" }
  }

  return {
    title: firstSection.seoTitle || firstSection.title || "Welcome to FreshNextJS",
    description: firstSection.seoDescription || firstSection.body?.slice(0, 150) || "",
  }
}

export default async function PublicHomepage() {
  const sections = await prisma.homepageSection.findMany({
    where: { visible: true },
    orderBy: { order: "asc" },
  })

  if (sections.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-text-muted">
        <p className="text-xl">Homepage is currently under construction.</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen w-full flex flex-col">
      {sections.map((section) => {
        const Component = ComponentMap[section.type]
        if (!Component) return null
        return <Component key={section.id} data={section} />
      })}
    </main>
  )
}
