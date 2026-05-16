import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"
import Image from "next/image"

const testimonials = [
  {
    name: "Omar Al-Faruq",
    role: "Philosophy Student",
    content:
      "The lectures on logic and cognitive science transformed how I approach my daily problem-solving. Truly a unique academic environment.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop",
  },
  {
    name: "Sarah Johnson",
    role: "Researcher",
    content:
      "The intentional marriage matching system is built on values I couldn't find anywhere else. It's respectful, private, and actually works.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop",
  },
  {
    name: "Dr. Ahmed Hassan",
    role: "Clinical Psychologist",
    content:
      "Bridging ancient wisdom with modern scientific findings is what makes PHAGLP stand out. The courses are rigorous yet accessible.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop",
  },
]

export function Testimonials() {
  return (
    <section className="py-24 px-4 bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-primary dark:text-blue-400">
            What Our Students Say
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join thousands of thinkers who are expanding their horizons through our platform.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <Card
              key={index}
              className="border-none shadow-md hover:shadow-xl transition-all duration-300 bg-background relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="pb-4">
                <div className="flex gap-1 mb-2">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Quote className="absolute -top-4 -left-2 w-8 h-8 text-slate-100 dark:text-slate-800 -z-10" />
                  <p className="text-slate-700 dark:text-slate-300 italic mb-8 relative z-10 leading-relaxed">
                    &quot;{t.content.replace(/'/g, "&apos;")}&quot;
                  </p>
                </div>

                <div className="flex items-center gap-4 border-t pt-6">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-slate-100">
                    <Image src={t.avatar} alt={t.name} fill className="object-cover" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-slate-100">{t.name}</div>
                    <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                      {t.role}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
