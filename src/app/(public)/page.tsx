import React from "react"
import { Metadata } from "next"
import prisma from "@/lib/db/prisma"
import { HomepageSection } from "@/types/homepage"

export const dynamic = "force-dynamic"


// Component implementations
function HeroSection({ data }: { data: HomepageSection }) {
  return (
    <section className="relative py-20 lg:py-28 px-4 overflow-hidden border-b border-slate-200/40 dark:border-slate-800/40">
      {/* Decorative Brand Color Blobs & Glows */}
      <div className="absolute top-0 left-1/4 -z-10 w-96 h-96 bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-[#1f7bc6]/10 via-[#1f7bc6]/5 to-transparent dark:from-[#1f7bc6]/15 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 -z-10 w-96 h-96 bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-[#e65c23]/5 via-[#e65c23]/2.5 to-transparent dark:from-[#e65c23]/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto max-w-7xl relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Core Info & CTA */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-left items-start">
            
            {/* Premium Brand Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-semibold bg-[#edf2f4] dark:bg-slate-900 border border-[#1f7bc6]/10 dark:border-slate-800 text-[#1f7bc6] dark:text-[#1f7bc6] transition-all duration-300 hover:scale-102 hover:bg-[#edf2f4]/80 shadow-[0_2px_10px_rgba(31,123,198,0.05)] select-none">
              <span className="flex h-2 w-2 rounded-full bg-[#e65c23] animate-pulse"></span>
              Phaglp • Interactive Philosophy Platform
            </div>

            {/* Massive Premium Heading */}
            {data.title && (
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] text-balance">
                {data.title.split(' ').map((word, index) => {
                  // Make certain parts of the title use our vibrant warm accent color
                  const isAccent = index % 3 === 2;
                  return (
                    <span 
                      key={index} 
                      className={isAccent ? "bg-gradient-to-r from-[#e65c23] to-[#c83313] bg-clip-text text-transparent" : ""}
                    >
                      {word}{' '}
                    </span>
                  )
                })}
              </h1>
            )}

            {/* Subtitle / Descriptive Copy */}
            {data.body && (
              <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 leading-relaxed text-pretty max-w-xl">
                {data.body}
              </p>
            )}

            {/* SaaS Lead Conversion & CTAs */}
            <div className="w-full max-w-lg flex flex-col gap-3">
              <form 
                action={data.ctaHref || "/register"} 
                method="GET"
                className="w-full flex flex-col sm:flex-row gap-2.5 p-2 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] focus-within:ring-2 focus-within:ring-[#1f7bc6] focus-within:border-transparent transition-all duration-200"
              >
                <div className="flex items-center gap-2 flex-grow px-3 py-2 sm:py-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                  </svg>
                  <input 
                    type="email" 
                    name="email"
                    required
                    placeholder="Enter your email to get started..." 
                    className="w-full bg-transparent border-0 p-0 text-sm focus:ring-0 placeholder:text-slate-400 focus:outline-none text-slate-800 dark:text-slate-200"
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold h-11 rounded-xl px-6 bg-[#1f7bc6] hover:bg-[#1f7bc6]/90 text-white shadow-lg shadow-blue-500/10 transition-all hover:scale-[1.02] active:scale-[0.98] duration-200"
                >
                  {data.ctaLabel || "Get Started"}
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </button>
              </form>

              {/* Secondary CTA options & Social proof */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 px-1">
                <a 
                  href="/lectures"
                  className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-[#1f7bc6] hover:text-[#1f7bc6]/80 transition-colors group"
                >
                  Browse our philosophy syllabus
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </a>
                <span className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden sm:inline"></span>
                <span className="text-xs text-slate-400 dark:text-slate-500 select-none">
                  No credit card required
                </span>
              </div>
            </div>

            {/* Social Proof Badging */}
            <div className="flex items-center gap-4 border-t border-slate-100 dark:border-slate-900/60 pt-6 w-full max-w-md mt-2">
              <div className="flex -space-x-2.5">
                <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-950 bg-gradient-to-br from-[#1f7bc6] to-blue-600 flex items-center justify-center text-[10px] font-bold text-white shadow-sm shadow-black/10 select-none">JD</div>
                <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-950 bg-gradient-to-br from-[#e65c23] to-orange-600 flex items-center justify-center text-[10px] font-bold text-white shadow-sm shadow-black/10 select-none">ML</div>
                <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-950 bg-gradient-to-br from-[#7cb625] to-green-600 flex items-center justify-center text-[10px] font-bold text-white shadow-sm shadow-black/10 select-none">SK</div>
                <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-950 bg-slate-800 flex items-center justify-center text-[9px] font-bold text-slate-200 shadow-sm shadow-black/10 select-none">+4k</div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-3.5 h-3.5 text-[#f1d48c] fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 ml-1">4.9/5</span>
                </div>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Join an active group of global thinkers</span>
              </div>
            </div>

          </div>

          {/* Right Column: Premium Visual Glassmorphism Preview */}
          <div className="lg:col-span-5 relative w-full flex items-center justify-center py-6 lg:py-0">
            
            {/* Huge Blurred Ambient Core Backglow */}
            <div className="absolute w-[120%] h-[120%] bg-gradient-to-tr from-[#1f7bc6]/10 via-[#e65c23]/10 to-[#7cb625]/10 rounded-full blur-3xl opacity-70 -z-10 animate-pulse duration-[12s]"></div>
            
            {/* Base Concept Dashboard Card */}
            <div className="w-full max-w-[400px] bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col gap-5 relative z-10 transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_25px_60px_rgba(0,0,0,0.08)]">
              
              {/* Header inside widget */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-900 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#edf2f4] dark:bg-slate-900 flex items-center justify-center text-[#1f7bc6] border border-[#1f7bc6]/10 dark:border-slate-800">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                      <path d="m9 12 2 2 4-4"></path>
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-tight">Intellectual Plan</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Curriculum overview</span>
                  </div>
                </div>
                
                <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold bg-[#7cb625]/10 text-[#7cb625] border border-[#7cb625]/20 animate-pulse">
                  Active
                </span>
              </div>

              {/* Study path items */}
              <div className="flex flex-col gap-3">
                
                {/* Item 1 (Done) */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-white/50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-900 transition-all hover:bg-white dark:hover:bg-slate-900">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-md bg-[#7cb625]/10 flex items-center justify-center border border-[#7cb625]/20">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7cb625" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 tracking-tight">Introduction to Logic</span>
                      <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium">Module completed • 5 lectures</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#7cb625]">100%</span>
                </div>

                {/* Item 2 (In progress) */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-white/80 dark:bg-slate-950/60 border border-[#1f7bc6]/20 dark:border-[#1f7bc6]/30 shadow-sm transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-md bg-[#1f7bc6]/10 flex items-center justify-center border border-[#1f7bc6]/20">
                      <svg className="animate-spin text-[#1f7bc6] w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                      </svg>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 tracking-tight">Ethics & Social Justice</span>
                      <span className="text-[9px] text-[#1f7bc6] font-semibold animate-pulse">Now studying • Lecture 3</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#1f7bc6]">60%</span>
                </div>

                {/* Item 3 (Locked) */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/40 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-900/60 opacity-60">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-900 flex items-center justify-center border border-slate-200 dark:border-slate-800">
                      <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 tracking-tight">Metaphysics & Space</span>
                      <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium">Locked • Requires Module 2</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">0%</span>
                </div>

              </div>

              {/* Progress bar footer */}
              <div className="flex flex-col gap-2 pt-1">
                <div className="flex items-center justify-between text-[10px] font-bold">
                  <span className="text-slate-500 dark:text-slate-400">Overall Progress</span>
                  <span className="text-slate-800 dark:text-slate-200">53% Completed</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#1f7bc6] to-[#7cb625] rounded-full" style={{ width: '53%' }}></div>
                </div>
              </div>

            </div>

            {/* Overlapping Glassmorphism Progress Circular Widget (Top Right) */}
            <div className="absolute -top-4 -right-4 md:-right-6 bg-white/80 dark:bg-slate-950/85 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-4 shadow-[0_10px_30px_rgba(0,0,0,0.05)] dark:shadow-none flex items-center gap-3.5 z-20 transition-all duration-300 hover:-translate-y-0.5 select-none">
              <div className="relative flex items-center justify-center">
                {/* SVG circular progress indicator */}
                <svg className="w-11 h-11 transform -rotate-90">
                  <circle cx="22" cy="22" r="18" stroke="currentColor" strokeWidth="3" className="text-slate-100 dark:text-slate-900" fill="transparent" />
                  <circle cx="22" cy="22" r="18" stroke="#7cb625" strokeWidth="3" className="transition-all" fill="transparent" strokeDasharray="113" strokeDashoffset="20" strokeLinecap="round" />
                </svg>
                {/* Custom Brain Icon inside circles */}
                <div className="absolute text-[#7cb625]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1 0-3.12 3 3 0 0 1 0-4.88 2.5 2.5 0 0 1 0-3.12A2.5 2.5 0 0 1 9.5 2Z"/>
                    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 0-3.12 3 3 0 0 0 0-4.88 2.5 2.5 0 0 0 0-3.12A2.5 2.5 0 0 0 14.5 2Z"/>
                  </svg>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold tracking-tight uppercase">Progression</span>
                <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">82% Mastery</span>
              </div>
            </div>

            {/* Overlapping Vibrant Accent Streak Badge (Bottom Left) */}
            <div className="absolute -bottom-3 -left-4 bg-[#e65c23] hover:bg-[#c83313] text-white rounded-2xl px-4 py-3 shadow-[0_10px_25px_rgba(230,92,35,0.25)] flex items-center gap-2.5 z-20 transition-all duration-300 hover:translate-y-0.5 select-none">
              <span className="text-xl">🔥</span>
              <div className="flex flex-col leading-tight">
                <span className="text-[10px] text-orange-200 font-bold uppercase tracking-tight">Daily Streak</span>
                <span className="text-xs font-extrabold">15 Days Active</span>
              </div>
            </div>

          </div>

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
    <section className="py-24 px-6 bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center border-t border-slate-200/60 dark:border-slate-800/60">
      <div className="w-full max-w-4xl flex flex-col gap-10 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-8 md:p-14 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
        
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-primary shadow-sm border border-slate-200/50 dark:border-slate-700/50 transition-colors duration-200 hover:bg-slate-200 dark:hover:bg-slate-700">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square-quote w-6 h-6">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              <path d="M8 12a2 2 0 0 0 2-2V8H8"></path>
              <path d="M14 12a2 2 0 0 0 2-2V8h-2"></path>
            </svg>
          </div>
          <h2 className="text-2xl md:text-3xl tracking-tight font-semibold text-foreground flex items-center justify-center gap-2">
            {data.title}
          </h2>
        </div>

        <div className="flex flex-col items-center gap-8">
          <blockquote className="text-xl md:text-2xl font-medium tracking-tight leading-relaxed text-center text-slate-500 dark:text-slate-400 relative px-4 md:px-8">
            <span className="text-slate-200 dark:text-slate-800 absolute -top-4 left-0 text-6xl select-none leading-none font-serif">"</span>
            <span className="relative z-10">{data.body}</span>
            <span className="text-slate-200 dark:text-slate-800 absolute -bottom-8 right-0 text-6xl select-none leading-none font-serif">"</span>
          </blockquote>
          
          {data.ctaLabel && data.ctaHref && (
             <a href={data.ctaHref} className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all duration-200 ease-in-out hover:bg-primary/90 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                {data.ctaLabel}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right w-4 h-4">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
             </a>
          )}
        </div>
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

      {/* Render the newest blog posts dynamically */}
      <LatestLectures />
    </main>
  )
}

async function LatestLectures() {
  let lectures: any[] = []
  
  try {
    lectures = await prisma.lecture.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 9,
      include: { author: true }
    })
  } catch (error) {
    console.error("Failed to fetch latest lectures", error)
    return null
  }

  if (lectures.length === 0) return null

  // Group by category, or just split into 3 groups if there aren't enough categories
  const categoriesMap: Record<string, typeof lectures> = {}
  lectures.forEach(l => {
    const cat = l.category || "General"
    if (!categoriesMap[cat]) categoriesMap[cat] = []
    categoriesMap[cat].push(l)
  })

  let columns: { title: string, items: typeof lectures }[] = []
  const topCategories = Object.keys(categoriesMap).slice(0, 3)
  
  if (topCategories.length >= 3) {
    columns = topCategories.map(cat => ({ title: `${cat} Lectures`, items: categoriesMap[cat].slice(0, 3) }))
  } else {
    // Fallback static columns if categories are scarce
    columns = [
      { title: "Philosophy & Ethics", items: lectures.slice(0, 3) },
      { title: "Science & Logic", items: lectures.slice(3, 6) },
      { title: "Life Planning", items: lectures.slice(6, 9) }
    ]
  }

  return (
    <section className="relative py-24 px-6 overflow-hidden bg-slate-50 dark:bg-slate-950 border-t border-border">
      {/* Glassmorphism background glow */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-white to-transparent dark:from-slate-950 pointer-events-none"></div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-4">
              Prepare for an in-demand career
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Master the concepts of philosophy, science, and life planning to elevate your analytical skills and build a robust foundation for any role.
            </p>
          </div>
          <a href="/lectures" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-10 px-5 py-2 bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0">
            Explore All Programs
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right w-4 h-4">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </a>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {columns.map((col, colIdx) => (
            <div key={colIdx} className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-slate-200/60 dark:border-slate-800/60 flex flex-col transition-all duration-300 hover:shadow-md hover:bg-white/80 dark:hover:bg-slate-900/60">
              <a href="/lectures" className="flex items-center text-lg font-bold tracking-tight text-foreground mb-6 hover:text-primary group w-fit transition-colors">
                {col.title}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right ml-1 w-5 h-5 transition-transform duration-200 ease-in-out group-hover:translate-x-1 text-muted-foreground group-hover:text-primary">
                  <path d="m9 18 6-6-6-6"></path>
                </svg>
              </a>
              
              <div className="flex flex-col gap-3 flex-grow">
                {col.items.map((lecture) => (
                  <a key={lecture.id} href={`/lectures/${lecture.slug}`} className="group/card bg-background rounded-xl p-3 flex gap-4 border border-border shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30 dark:hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    <div className="w-16 h-16 shrink-0 rounded-lg bg-muted overflow-hidden relative border border-border shadow-inner">
                      {lecture.coverImage ? (
                        <img src={lecture.coverImage} alt={lecture.title} className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 transition-transform duration-500 group-hover/card:scale-105"></div>
                      )}
                    </div>
                    
                    <div className="flex flex-col justify-center flex-grow min-w-0 py-0.5">
                      <div className="flex items-center gap-2 mb-1.5 text-xs font-medium text-muted-foreground">
                        {lecture.author?.photoUrl ? (
                          <img src={lecture.author.photoUrl} className="w-5 h-5 rounded-full object-cover border border-border shadow-sm" alt={lecture.author.name || "Author"} />
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold border border-primary/20 shadow-sm" style={{ fontSize: '10px' }}>
                            {(lecture.author?.name || "P")[0]}
                          </div>
                        )}
                        <span className="truncate tracking-tight">{lecture.author?.name || "Phaglp Academy"}</span>
                      </div>
                      
                      <h3 className="font-semibold text-foreground text-sm line-clamp-2 leading-tight tracking-tight mb-2 transition-colors group-hover/card:text-primary">
                        {lecture.title}
                      </h3>
                      
                      <div className="flex items-center text-[11px] text-muted-foreground gap-2 mt-auto font-medium">
                        <span>Professional Lecture</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                        <span className="flex items-center text-foreground font-semibold">
                          <svg className="w-3.5 h-3.5 text-amber-500 mr-1" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                          4.8
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
                
                {/* Pad out to 3 items if necessary to keep layout height consistent */}
                {col.items.length < 3 && Array.from({ length: 3 - col.items.length }).map((_, i) => (
                  <div key={`empty-${i}`} className="bg-transparent rounded-xl p-3 flex gap-4 opacity-0 pointer-events-none">
                    <div className="w-16 h-16 shrink-0"></div>
                    <div className="flex flex-col flex-grow"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
