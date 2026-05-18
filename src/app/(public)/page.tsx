import React from "react"
import { Metadata } from "next"
import prisma from "@/lib/db/prisma"
import { HomepageSection } from "@/types/homepage"

export const dynamic = "force-dynamic"


// Component implementations
function HeroSection({ data }: { data: HomepageSection }) {
  return (
    <section className="relative py-20 px-4">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-100/40 via-background to-transparent dark:from-blue-950/20"></div>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-orange-100/20 via-transparent to-transparent dark:from-orange-950/10"></div>
      
      <div className="container mx-auto text-center max-w-4xl relative">
        {/* Badge */}
        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 mb-4 bg-[#1E3A8A]/10 text-[#1E3A8A] hover:bg-[#1E3A8A]/15 border-[#1E3A8A]/20 transition-all duration-300 hover:scale-105">
          Phaglp - Philosophical Platform
        </div>

        {/* Heading */}
        {data.title && (
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance bg-gradient-to-r from-[#1E3A8A] via-[#2563EB] to-[#1E3A8A] bg-clip-text text-transparent uppercase">
            {data.title}
          </h1>
        )}

        {/* Subtitle */}
        {data.body && (
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed text-pretty max-w-2xl mx-auto">
            {data.body}
          </p>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {data.ctaLabel && data.ctaHref && (
            <a
              href={data.ctaHref}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-11 rounded-md px-8 bg-[#F97316] text-white hover:bg-[#EA580C] shadow-lg shadow-orange-500/20 transition-all hover:scale-105 active:scale-95"
            >
              {data.ctaLabel}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right ml-2 w-4 h-4">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </a>
          )}
          <a
            href="/lectures"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border hover:text-accent-foreground h-11 rounded-md px-8 border-[#1E3A8A]/30 text-[#1E3A8A] hover:bg-[#1E3A8A]/5 bg-transparent transition-all hover:scale-105 active:scale-95"
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
