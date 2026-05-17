import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Sparkles, Globe, Users, Quote } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"
import LatestLecturesCTA from "@/components/home/LatestLecturesCTA"
import { LatestLecturesSkeleton } from "@/components/home/LatestLecturesSkeleton"
import { siteConfig } from "@/config/site"
import { Testimonials } from "@/components/home/testimonials"
import { PricingSection } from "@/components/home/pricing-section"

export const revalidate = 3600

export default function HomePage() {
  return (
    <div className="bg-background overflow-hidden animate-fade-in">
      {/* Hero Section */}
      <section className="relative py-24 px-4 border-b border-slate-100 dark:border-slate-900">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-100/40 via-background to-transparent dark:from-blue-950/20" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-orange-100/20 via-transparent to-transparent dark:from-orange-950/10" />
        <div className="container mx-auto text-center max-w-5xl relative">
          <Badge className="mb-6 bg-gradient-to-r from-primary to-indigo-600 text-white hover:opacity-90 px-4 py-1.5 shadow-md border-none text-xs font-semibold tracking-widest uppercase transition-transform hover:scale-105">
            DISCOVER THE STRATEGIC PHILOSOPHICAL PROJECTS?!
          </Badge>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 text-balance bg-gradient-to-r from-slate-900 via-primary to-indigo-600 dark:from-white dark:via-blue-400 dark:to-indigo-500 bg-clip-text text-transparent leading-[1.1] tracking-tight">
            THE PHILOSOPHICAL ACADEMY FOR GENIUSES LIFE PLANNING
          </h1>
          <p className="text-xl text-muted-foreground mb-10 leading-relaxed text-pretty max-w-3xl mx-auto font-medium">
            {siteConfig.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-primary text-white hover:bg-primary/90 shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 px-8 rounded-xl font-bold h-12"
              asChild
            >
              <Link href="/courses">
                Explore Elite Courses <ArrowRight className="ml-2 w-4 h-4 animate-pulse" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-slate-300 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-900 bg-transparent transition-all hover:scale-105 active:scale-95 px-8 rounded-xl font-semibold h-12"
            >
              <Link href="/lectures">Read Magical Lectures</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Mission & General Program Section */}
      <section className="py-24 px-4 bg-background relative border-b border-slate-100 dark:border-slate-900">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-12 gap-12 items-stretch">
            {/* Mission Card */}
            <div className="lg:col-span-5 flex flex-col justify-between p-8 md:p-10 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl shadow-blue-500/15 hover:shadow-2xl transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -z-10" />
              <div>
                <Badge className="bg-white/20 text-white hover:bg-white/25 border-none mb-6">
                  OUR TARGETED MISSION?!
                </Badge>
                <h2 className="text-4xl md:text-5xl font-extrabold mb-8 tracking-tight">
                  MISSION?!
                </h2>
                <ul className="space-y-6 text-lg text-blue-100 font-medium">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center text-xs text-white shrink-0 mt-1">✓</div>
                    <span>Education, Instruction, and Culture</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center text-xs text-white shrink-0 mt-1">✓</div>
                    <span>And Planning to the First Life and Last Life</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center text-xs text-white shrink-0 mt-1">✓</div>
                    <span>By the Rightness, Goodness, and the Beautiful</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center text-xs text-white shrink-0 mt-1">✓</div>
                    <span>For Talented, Gifted, and Geniuses Young and Adult?!</span>
                  </li>
                </ul>
              </div>
              <div className="mt-10 pt-6 border-t border-white/10 text-xs text-blue-200 italic">
                Pioneering elite intellectual care and guidance globally.
              </div>
            </div>

            {/* General Program of Life Planning Card */}
            <div className="lg:col-span-7 flex flex-col justify-between p-8 md:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
              <div>
                <Badge className="mb-6 bg-primary/10 text-primary border-none">
                  INTEGRATED METHODOLOGY
                </Badge>
                <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-foreground tracking-tight">
                  GENERAL PROGRAM OF LIFE PLANNING?!
                </h2>
                <p className="text-muted-foreground text-base mb-8 leading-relaxed">
                  General Program of Life Planning for geniuses, gifted, and talented, young and adult. It consists of:
                </p>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Main Projects */}
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary" />
                      (1) Main Projects:
                    </h3>
                    <ul className="space-y-3.5">
                      <li className="text-sm text-slate-700 dark:text-slate-300">
                        <strong className="text-primary font-bold">1.</strong> Appropriate Education (Daily Applied Lecture)
                      </li>
                      <li className="text-sm text-slate-700 dark:text-slate-300">
                        <strong className="text-primary font-bold">2.</strong> Appropriate Work (Knowledge-Based E-Commerce Platform)
                      </li>
                      <li className="text-sm text-slate-700 dark:text-slate-300">
                        <strong className="text-primary font-bold">3.</strong> Appropriate Marriage (Marriage Platform)
                      </li>
                    </ul>
                  </div>

                  {/* Supporting Projects */}
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-accent" />
                      (2) Supporting Projects:
                    </h3>
                    <ul className="space-y-3">
                      <li className="text-sm text-slate-600 dark:text-slate-400">
                        <strong className="text-accent font-bold">4.</strong> Consultations.
                      </li>
                      <li className="text-sm text-slate-600 dark:text-slate-400">
                        <strong className="text-accent font-bold">5.</strong> Research.
                      </li>
                      <li className="text-sm text-slate-600 dark:text-slate-400">
                        <strong className="text-accent font-bold">6.</strong> Comprehensive Care.
                      </li>
                      <li className="text-sm text-slate-600 dark:text-slate-400">
                        <strong className="text-accent font-bold">7.</strong> General Culture.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Formulated and supervised by academic boards.</span>
                <Button size="sm" asChild variant="outline" className="border-primary/20 hover:bg-primary/5 rounded-xl">
                  <Link href="/learning-path">View Full Path</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Select Legendary PHAGLP Education Section */}
      <section className="py-24 px-4 bg-slate-50 dark:bg-slate-900/30 relative border-b border-slate-100 dark:border-slate-900">
        <div className="container mx-auto max-w-6xl text-center">
          <Badge className="mb-4 bg-accent/10 text-accent hover:bg-accent/15 border-accent/20 transition-all duration-300">
            THE PLATFORM OF GENIUSES
          </Badge>
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6 text-foreground tracking-tight">
            WHY SELECT LEGENDARY PHAGLP EDUCATION?!
          </h2>
          <p className="text-muted-foreground text-lg mb-16 max-w-2xl mx-auto font-medium">
            Discover why our program remains the premier choice globally for intellectual care, scientific elevation, and structured wisdom.
          </p>

          <div className="p-8 md:p-12 rounded-3xl bg-background border border-slate-200 dark:border-slate-800 shadow-xl text-left relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-2 h-full bg-accent" />
            <h3 className="text-2xl md:text-3xl font-extrabold mb-8 text-foreground tracking-tight border-b pb-4 flex items-center gap-3">
              <Sparkles className="text-accent w-6 h-6 shrink-0" />
              VISION?!
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-xl bg-accent/10 text-accent flex items-center justify-center font-bold text-sm shrink-0">1</div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Provide the general program of life planning as a source of guidance and inspiration for geniuses, gifted, and talented.
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-xl bg-accent/10 text-accent flex items-center justify-center font-bold text-sm shrink-0">2</div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Establish a large philosophical consortium that unites, sponsors, and supports these individuals and their families.
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-xl bg-accent/10 text-accent flex items-center justify-center font-bold text-sm shrink-0">3</div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Activate a culture of gifted care and empowerment.
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-xl bg-accent/10 text-accent flex items-center justify-center font-bold text-sm shrink-0">4</div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Offer appropriate solutions to the shortcomings and challenges of similar scientific projects and programs.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-xl bg-accent/10 text-accent flex items-center justify-center font-bold text-sm shrink-0">5</div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Promote reassurance and human peace.
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-xl bg-accent/10 text-accent flex items-center justify-center font-bold text-sm shrink-0">6</div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Present the nation in a prestigious philosophical manner and support public and private sector institutions.
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-xl bg-accent/10 text-accent flex items-center justify-center font-bold text-sm shrink-0">7</div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Contribute added scientific value to human life, grounded in the philosophy of the virtuous life?!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Elite Courses Section (replaces Explore Our Core Pillars) */}
      <section className="py-24 px-4 bg-secondary/30 relative border-b border-slate-100 dark:border-slate-900">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              OUR ELITE COURSES?!
            </Badge>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 text-foreground tracking-tight">
              ELITE COURSES?!
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed font-medium">
              Elite Courses, these are the scientific modules of The General Program of Life Planning for geniuses, gifted, and talented, young and adult. They are presented here as advanced, specialized academic courses, characterized by their luxury, uniqueness, and exclusivity—unavailable anywhere else.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* GP COURSE */}
            <Card className="border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 bg-background/80 backdrop-blur-md group relative overflow-hidden flex flex-col justify-between rounded-2xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600" />
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <Sparkles className="w-6 h-6 text-primary group-hover:text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                  GP COURSE
                </CardTitle>
                <CardDescription className="text-sm mt-2 leading-relaxed font-medium">
                  The primary comprehensive pathway of life planning. Advanced long-term integrated structures for peak cognitive capability.
                </CardDescription>
              </CardHeader>
              <CardFooter className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button variant="link" asChild className="p-0 h-auto text-primary font-semibold group-hover:underline">
                  <Link href="/courses" className="flex items-center">
                    Learn More <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            {/* GP GROUPS COURSES */}
            <Card className="border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 bg-background/80 backdrop-blur-md group relative overflow-hidden flex flex-col justify-between rounded-2xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-pink-600" />
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-purple-600/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                  <Users className="w-6 h-6 text-purple-600 group-hover:text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                  GP GROUPS COURSES
                </CardTitle>
                <CardDescription className="text-sm mt-2 leading-relaxed font-medium">
                  Collaborative cohort frameworks. Engage in peer dialogue groups, supervised discourse, and shared intellectual challenge.
                </CardDescription>
              </CardHeader>
              <CardFooter className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button variant="link" asChild className="p-0 h-auto text-primary font-semibold group-hover:underline">
                  <Link href="/courses" className="flex items-center">
                    Learn More <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            {/* GP SUBJECTS COURSES */}
            <Card className="border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 bg-background/80 backdrop-blur-md group relative overflow-hidden flex flex-col justify-between rounded-2xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-600 to-teal-600" />
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-emerald-600/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                  <Globe className="w-6 h-6 text-emerald-600 group-hover:text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                  GP SUBJECTS COURSES
                </CardTitle>
                <CardDescription className="text-sm mt-2 leading-relaxed font-medium">
                  Accelerated modules focusing on deep theoretical models, logic structures, and highly specialized individual branches.
                </CardDescription>
              </CardHeader>
              <CardFooter className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button variant="link" asChild className="p-0 h-auto text-primary font-semibold group-hover:underline">
                  <Link href="/courses" className="flex items-center">
                    Learn More <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Latest Lectures CTA Section */}
      <Suspense fallback={<LatestLecturesSkeleton />}>
        <LatestLecturesCTA />
      </Suspense>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Pricing Section */}
      <PricingSection />

      {/* START THE GENIUS'S WAY (GP) SECTION */}
      <section className="py-24 px-4 bg-slate-50 dark:bg-slate-900/30 relative border-t border-slate-100 dark:border-slate-900">
        <div className="container mx-auto max-w-5xl text-center">
          <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/15 border-primary/20">
            THE GENIUS'S PATHWAY
          </Badge>
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6 text-foreground tracking-tight">
            START THE GENIUS’S WAY (GP)?!
          </h2>
          <p className="text-muted-foreground text-lg mb-12 max-w-2xl mx-auto font-medium">
            The General Program of Life Planning continues to 10 (ten years) through progressive stages of mental, scientific, and spiritual growth.
          </p>

          {/* Timeline Stages Preview */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-16 max-w-4xl mx-auto">
            {[
              { stage: "1", title: "SCIENCE", bg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200/50" },
              { stage: "2", title: "EXPERIENCE", bg: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200/50" },
              { stage: "3", title: "RESEARCH", bg: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-200/50" },
              { stage: "4", title: "COGNITIVE", bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200/50" },
              { stage: "5", title: "WISDOM", bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200/50" },
            ].map((s, idx) => (
              <div key={idx} className="flex flex-col items-center p-6 rounded-2xl bg-background border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
                <div className={`w-10 h-10 rounded-full ${s.bg} flex items-center justify-center font-bold text-sm mb-3 border`}>
                  {s.stage}
                </div>
                <span className="font-bold text-sm tracking-wider uppercase text-foreground">{s.title}</span>
              </div>
            ))}
          </div>

          <div className="p-8 md:p-10 rounded-3xl bg-background border border-slate-200 dark:border-slate-800 shadow-xl max-w-2xl mx-auto mb-12 text-left relative">
            <Quote className="absolute top-6 right-6 w-16 h-16 text-slate-100 dark:text-slate-800 -z-10" />
            <p className="text-slate-700 dark:text-slate-300 font-semibold italic mb-8 leading-relaxed text-base md:text-lg">
              &quot;you will come to know, experience, benefit from, and take pride in this legendary program?!&quot;
            </p>
            <div className="flex flex-col items-end pt-4 border-t border-slate-100 dark:border-slate-800/80">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-widest">With My Best Regards</span>
              <span className="text-xl font-extrabold text-foreground tracking-tight mt-1">IBRAHIM ALOMRANI</span>
              <span className="text-xs text-primary font-medium mt-0.5">Founder, Philosophical Academy for Geniuses Life Planning</span>
            </div>
          </div>

          <Button size="lg" className="bg-accent text-white hover:bg-accent/90 shadow-lg px-8 py-6 h-auto text-base rounded-xl font-bold transition-all hover:scale-105" asChild>
            <Link href="/learning-path">
              Discover General Program Details <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-primary via-blue-600 to-indigo-700 relative">
        <div className="absolute inset-0 carbon-fibre opacity-10" />
        <div className="container mx-auto text-center relative">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 text-balance tracking-tight">
            Ready to Start Your Journey?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto font-medium">
            Join the PHAGLP community today and gain access to exclusive courses, research, and
            wisdom.
          </p>
          <Button
            size="lg"
            className="bg-accent text-white hover:bg-accent/90 shadow-xl shadow-orange-950/20 text-lg px-12 py-6 h-auto rounded-xl font-bold transition-all hover:scale-105 active:scale-95"
            asChild
          >
            <Link href="/dashboard">
              Join Now <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
