import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, BookOpen, GraduationCap, Award, Compass, Quote, Target, Star, CheckCircle2, AwardIcon, Landmark, Library, CompassIcon, GraduationCapIcon } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "START THE GENIUS’S WAY (GP) | PHAGLP",
  description: "Explore the General Program of Life Planning for geniuses, gifted, and talented, young and adult, formulated by Ibrahim Alomrani.",
}

export default function LearningPathPage() {
  const educationSteps = [
    { num: "1", title: "General Objectives and Curriculum Content Goals", desc: "Setting rigorous benchmarks and developmental targets for high-capacity intellectual growth." },
    { num: "2", title: "Literature and References for Curriculum Content and Courses", desc: "A curated premium library of profound historical and contemporary academic models." },
    { num: "3", title: "Teaching Methods, Approaches, and Strategies", desc: "Advanced cognitive training, Socratic dialogue, and customized logic frameworks." },
    { num: "4", title: "Educational Activities", desc: "Dynamic interactive exercises, peer debates, and real-world implementation exercises." },
    { num: "5", title: "Instructional Materials", desc: "Premium bespoke syllabi, advanced tools, and multimedia modules prepared exclusively for geniuses." },
    { num: "6", title: "Assessment Methods", desc: "Applied tasks, comprehensive metrics, and measurement tools designed for gifted analysis." },
    { num: "7", title: "Evaluation", desc: "Ongoing feedback loops and scientific reviews of individual cognitive development." },
    { num: "8", title: "Costs", desc: "Transparent structures with socioeconomic class discounts to ensure universal access." },
  ]

  const supportingPrograms = [
    { num: "1", name: "Public Library", icon: Library },
    { num: "2", name: "Scientific Association", icon: Landmark },
    { num: "3", name: "Scientific Visit", icon: Compass },
    { num: "4", name: "Scientific Trip", icon: CompassIcon },
    { num: "5", name: "Scientific Dialogue", icon: Quote },
    { num: "6", name: "Scientific Seminar", icon: BookOpen },
    { num: "7", name: "General Culture", icon: Target },
    { num: "8", name: "General Sports", icon: Star },
    { num: "9", name: "Public Service", icon: CheckCircle2 },
    { num: "10", name: "Annual Scientific Conference", icon: AwardIcon },
    { num: "11", name: "Transitional Scientific Conference", icon: GraduationCapIcon },
  ]

  const timelineStages = [
    { name: "SCIENCE", desc: "Rigorous research & scientific grounding in foundational absolute thought.", color: "from-blue-600 to-cyan-500", shadow: "shadow-blue-500/10" },
    { name: "EXPERIENCE", desc: "Practical trial, cognitive testing, and deep real-world implementation.", color: "from-purple-600 to-pink-500", shadow: "shadow-purple-500/10" },
    { name: "RESEARCH", desc: "Formulating novel hypotheses, writing original theses, and group dialectics.", color: "from-pink-600 to-rose-500", shadow: "shadow-pink-500/10" },
    { name: "COGNITIVE", desc: "Attaining structural mastery over cognitive systems and global logic dynamics.", color: "from-emerald-600 to-teal-500", shadow: "shadow-emerald-500/10" },
    { name: "WISDOM", desc: "The ultimate synthesis of virtuous living, absolute peace, and human guidance.", color: "from-amber-600 to-orange-500", shadow: "shadow-amber-500/10" },
  ]

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/20 py-16 px-4 relative overflow-hidden animate-fade-in">
      {/* Background radial highlights */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto max-w-5xl">
        <Button variant="ghost" asChild className="mb-10 text-muted-foreground hover:text-foreground">
          <Link href="/">
            <ArrowLeft className="mr-2 w-4 h-4" /> Back to Home
          </Link>
        </Button>

        {/* Hero Section */}
        <div className="text-center mb-16 relative">
          <Badge className="bg-gradient-to-r from-accent to-orange-600 text-white border-0 px-4 py-1.5 rounded-full mb-6 font-semibold tracking-wide uppercase transition-all hover:scale-105">
            START THE GENIUS’S WAY (GP)?!
          </Badge>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 tracking-tight bg-gradient-to-r from-slate-900 via-primary to-indigo-600 dark:from-white dark:via-blue-400 dark:to-indigo-500 bg-clip-text text-transparent leading-tight">
            GENERAL PROGRAM OF LIFE PLANNING?!
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium">
            General Program of Life Planning for geniuses, gifted, and talented, young and adult.
            Discover the comprehensive pathways engineered to lead minds toward absolute excellence.
          </p>
        </div>

        {/* Section 1: Appropriate Education Project */}
        <div className="mb-20">
          <div className="flex items-center gap-3 border-b pb-4 mb-10 border-slate-200 dark:border-slate-800">
            <div className="p-2 bg-primary/10 rounded-xl text-primary">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
                The Appropriate Education Project (Daily Applied Lecture)?!
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                A system-driven education project built entirely on 8 robust methodological dimensions:
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {educationSteps.map((step) => (
              <Card key={step.num} className="border border-slate-200/80 dark:border-slate-800/80 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl overflow-hidden relative group">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                      {step.num}
                    </div>
                    <CardTitle className="text-lg font-bold text-foreground leading-tight tracking-tight group-hover:text-primary transition-colors">
                      {step.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed font-medium pl-11">
                    {step.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Section 2: Supporting Programs */}
        <div className="mb-20">
          <div className="flex items-center gap-3 border-b pb-4 mb-10 border-slate-200 dark:border-slate-800">
            <div className="p-2 bg-accent/10 rounded-xl text-accent">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
                SUPPORTING PROGRAMS
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Eleven supporting modules crafted to provide complete scientific and social reinforcement:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {supportingPrograms.map((prog) => {
              const Icon = prog.icon
              return (
                <div key={prog.num} className="flex flex-col items-center justify-between p-6 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all text-center group">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-4 group-hover:bg-accent group-hover:text-white transition-all duration-300">
                    <Icon className="w-5 h-5 shrink-0" />
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground font-mono">0{prog.num}</span>
                    <h3 className="font-bold text-sm text-foreground tracking-tight mt-1 leading-snug">
                      {prog.name}
                    </h3>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Section 3: 10-Year Series Timeline */}
        <div className="mb-20">
          <div className="flex items-center gap-3 border-b pb-4 mb-10 border-slate-200 dark:border-slate-800">
            <div className="p-2 bg-indigo-600/10 rounded-xl text-indigo-600">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
                The 10-Year General Program Series
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                The General Program Series continues to 10 (ten years) through the following progressive developmental stages:
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-5 relative">
            {timelineStages.map((stage, idx) => (
              <div key={stage.name} className="flex flex-col relative group">
                <Card className={`border border-slate-200/80 dark:border-slate-800/80 h-full flex flex-col justify-between bg-white/70 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 ${stage.shadow}`}>
                  <div className={`h-2 bg-gradient-to-r ${stage.color}`} />
                  <CardHeader className="p-6 pb-2">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs text-muted-foreground font-mono font-semibold">STAGE 0{idx + 1}</span>
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 shrink-0" />
                    </div>
                    <CardTitle className="text-xl font-black tracking-wider text-foreground uppercase group-hover:text-primary transition-colors">
                      {stage.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-2">
                    <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                      {stage.desc}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Signed Plaque */}
        <div className="p-8 md:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl max-w-3xl mx-auto mb-16 text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -z-10" />
          <Quote className="absolute top-6 right-6 w-20 h-20 text-slate-100 dark:text-slate-800/50 -z-10" />
          <p className="text-slate-700 dark:text-slate-300 font-semibold italic mb-10 leading-relaxed text-lg md:text-xl max-w-2xl mx-auto">
            &quot;you will come to know, experience, benefit from, and take pride in this legendary program?!&quot;
          </p>
          <div className="flex flex-col items-center pt-6 border-t border-slate-100 dark:border-slate-800 max-w-md mx-auto">
            <span className="text-xs text-muted-foreground font-semibold uppercase tracking-widest">With My Best Regards</span>
            <span className="text-3xl font-black text-foreground tracking-tight mt-2 bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
              IBRAHIM ALOMRANI
            </span>
            <span className="text-xs text-primary font-medium mt-1">Founder & Supervising Academic Director, PHAGLP</span>
          </div>
        </div>
      </div>
    </div>
  )
}
