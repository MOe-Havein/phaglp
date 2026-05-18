import React from "react"
import { Metadata } from "next"
import prisma from "@/lib/db/prisma"
import { HomepageSection } from "@/types/homepage"

export const dynamic = "force-dynamic"


// Component implementations
function HeroSection({ data }: { data: HomepageSection }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white dark:from-gray-950 dark:to-gray-900 py-20 md:py-32 px-6 border-b border-border/40">
      {/* Ambient background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 dark:bg-primary/20 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[250px] h-[250px] bg-accent/5 dark:bg-accent/15 rounded-full blur-[80px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Side: Copywriting Content */}
        <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
          {/* Glossy Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 dark:bg-primary/15 border border-primary/20 dark:border-primary/30 text-xs font-semibold text-primary dark:text-blue-400 tracking-wide backdrop-blur-md shadow-sm">
            <span className="w-2 h-2 rounded-full bg-primary dark:bg-blue-400 animate-pulse" />
            <span>✨ Life Planning & Higher Intellect Development</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight leading-[1.1] text-balance">
            {data.title.split(" ").map((word, index, arr) => {
              // Highlight the last 2-3 words with a gorgeous gradient
              const highlightStart = Math.max(0, arr.length - 2)
              if (index >= highlightStart) {
                return (
                  <span key={index} className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-600 to-indigo-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">
                    {word}{" "}
                  </span>
                )
              }
              return word + " "
            })}
          </h1>

          {/* Body Description */}
          {data.body && (
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
              {data.body}
            </p>
          )}

          {/* Call to Action Actions */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-2">
            {data.ctaLabel && data.ctaHref && (
              <a
                href={data.ctaHref}
                className="inline-flex items-center justify-center bg-primary dark:bg-blue-600 text-white dark:text-white font-bold px-8 py-4 rounded-xl hover:bg-primary/95 dark:hover:bg-blue-500 transition-all duration-300 shadow-[0_4px_20px_rgba(30,58,138,0.25)] hover:shadow-[0_6px_25px_rgba(30,58,138,0.35)] hover:-translate-y-0.5 text-center"
              >
                {data.ctaLabel}
              </a>
            )}
            <a
              href="/courses"
              className="inline-flex items-center justify-center bg-secondary dark:bg-gray-800 text-foreground border border-border/60 hover:border-border font-semibold px-8 py-4 rounded-xl hover:bg-slate-100 dark:hover:bg-gray-700 transition-all duration-300 text-center"
            >
              Explore Programs
            </a>
          </div>

          {/* Social Proof / Stats */}
          <div className="pt-6 border-t border-border/60 w-full flex flex-wrap gap-x-8 gap-y-4 text-sm text-muted-foreground">
            <div>
              <span className="font-bold text-foreground text-lg block">10K+</span>
              Geniuses Trained
            </div>
            <div>
              <span className="font-bold text-foreground text-lg block">4.9/5 ★</span>
              Student Rating
            </div>
            <div>
              <span className="font-bold text-foreground text-lg block">24-Month</span>
              Guided Development
            </div>
          </div>
        </div>

        {/* Right Side: Immersive Figma Mockup & Image Presentation */}
        <div className="lg:col-span-5 relative w-full flex justify-center lg:justify-end">
          {data.mediaUrl && (
            <div className="relative group w-full max-w-[450px]">
              {/* Background ambient color cast behind the image frame */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-primary to-accent rounded-2xl blur opacity-30 group-hover:opacity-40 transition duration-1000 group-hover:duration-300" />
              
              {/* The Actual Image Frame */}
              <div className="relative rounded-2xl overflow-hidden border border-border bg-white dark:bg-gray-900 p-2 shadow-2xl transform transition-transform duration-500 hover:rotate-1 hover:scale-[1.02]">
                <img
                  src={data.mediaUrl}
                  alt={data.mediaAlt || data.title || "Hero Media"}
                  className="w-full h-auto object-cover rounded-xl"
                />
                
                {/* Floating Glassmorphic Overlay Card */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg border border-white/20 dark:border-white/10 p-4 rounded-xl shadow-lg flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Accredited Program</h4>
                    <p className="text-xs text-muted-foreground">Certified Integration Studies</p>
                  </div>
                </div>
              </div>

              {/* Decorative side accent dot grids common in Figma designs */}
              <div className="absolute -top-6 -left-6 w-12 h-12 text-slate-300 dark:text-slate-700 opacity-40 pointer-events-none">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="2" cy="2" r="2"/><circle cx="12" cy="2" r="2"/><circle cx="22" cy="2" r="2"/>
                  <circle cx="2" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="22" cy="12" r="2"/>
                  <circle cx="2" cy="22" r="2"/><circle cx="12" cy="22" r="2"/><circle cx="22" cy="22" r="2"/>
                </svg>
              </div>
            </div>
          )}
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
