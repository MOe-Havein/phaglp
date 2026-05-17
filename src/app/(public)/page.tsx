import React from "react"
import { Metadata } from "next"
import prisma from "@/lib/db/prisma"
import { HomepageSection } from "@/types/homepage"

export const dynamic = "force-dynamic"


// Component implementations
function HeroSection({ data }: { data: HomepageSection }) {
  return (
    <section className="py-20 px-6 bg-surface text-center">
      <h1 className="text-5xl font-extrabold text-text-primary mb-6">{data.title}</h1>
      {data.body && <p className="text-xl text-text-muted max-w-2xl mx-auto mb-8">{data.body}</p>}
      {data.ctaLabel && data.ctaHref && (
        <a
          href={data.ctaHref}
          className="inline-block bg-primary text-white font-semibold px-8 py-4 rounded-full hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl"
        >
          {data.ctaLabel}
        </a>
      )}
      {data.mediaUrl && (
        <div className="mt-12 max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-border">
          <img
            src={data.mediaUrl}
            alt={data.mediaAlt || data.title || "Hero Media"}
            className="w-full h-auto object-cover"
          />
        </div>
      )}
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
