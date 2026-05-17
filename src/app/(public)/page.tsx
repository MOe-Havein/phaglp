import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Sparkles, Globe, Users } from "lucide-react"
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
    <div className="bg-background overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-100/40 via-background to-transparent dark:from-blue-950/20" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-orange-100/20 via-transparent to-transparent dark:from-orange-950/10" />
        <div className="container mx-auto text-center max-w-4xl relative">
          <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/15 border-primary/20 transition-all duration-300 hover:scale-105">
            {siteConfig.siteName} - Philosophical Platform
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance bg-gradient-to-r from-primary via-blue-600 to-primary bg-clip-text text-transparent">
            THE PHILOSOPHICAL ACADEMY FOR GENIUSES LIFE PLANNING
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed text-pretty max-w-2xl mx-auto">
            {siteConfig.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-accent text-white hover:bg-accent/90 shadow-lg shadow-orange-500/20 transition-all hover:scale-105 active:scale-95"
              asChild
            >
              <Link href="/courses">
                Explore Courses <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-primary/30 text-primary hover:bg-primary/5 bg-transparent transition-all hover:scale-105 active:scale-95"
            >
              <Link href="/lectures">Read Lectures</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 bg-secondary/30 relative">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground text-balance">
              Explore Our Core Pillars
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A comprehensive approach to education, science, and philosophical wisdom
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border border-primary/5 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 bg-background group">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <Sparkles className="w-6 h-6 text-primary group-hover:text-white" />
                </div>
                <CardTitle className="text-foreground group-hover:text-primary transition-colors">
                  Education & Wisdom
                </CardTitle>
                <CardDescription>
                  Deep dive into historical and modern philosophical systems
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border border-primary/5 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 bg-background group">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-600/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <Globe className="w-6 h-6 text-blue-600 group-hover:text-white" />
                </div>
                <CardTitle className="text-foreground group-hover:text-primary transition-colors">
                  Applied Science
                </CardTitle>
                <CardDescription>
                  Bridging the gap between theoretical wisdom and practical scientific application
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border border-primary/5 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 bg-background group">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                  <Users className="w-6 h-6 text-accent group-hover:text-white" />
                </div>
                <CardTitle className="text-foreground group-hover:text-primary transition-colors">
                  Global Community
                </CardTitle>
                <CardDescription>
                  Connect with researchers, students, and thinkers from around the world
                </CardDescription>
              </CardHeader>
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

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-primary via-blue-600 to-primary relative">
        <div className="absolute inset-0 carbon-fibre opacity-10" />
        <div className="container mx-auto text-center relative">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 text-balance">
            Ready to Start Your Journey?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Join the PHAGLP community today and gain access to exclusive courses, research, and
            wisdom.
          </p>
          <Button
            size="lg"
            className="bg-accent text-white hover:bg-accent/90 shadow-xl shadow-orange-950/20 text-lg px-12 py-6 h-auto"
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
