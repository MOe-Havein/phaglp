import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Star, Quote, ArrowRight } from "lucide-react";
import Image from "next/image";
import { getCloudinaryFetchUrl } from "@/utils/cloudinary-fetch";

const testimonials = [
  {
    name: "Ahmad Al-Mansoor",
    role: "GP Course Student (14 yrs)",
    content:
      "The daily applied lectures challenged my mind in ways school never could. I've found my true intellectual peers here in the academy.",
    rating: 5,
    avatar: getCloudinaryFetchUrl(
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop",
    ),
  },
  {
    name: "Dr. Layla Vance",
    role: "GP Groups Scholar (28 yrs)",
    content:
      "The philosophical dialogue in the GP Groups is incredibly rigorous. It has completely refined my research methodology and reasoning structures.",
    rating: 5,
    avatar: getCloudinaryFetchUrl(
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop",
    ),
  },
  {
    name: "Sophia Rossi",
    role: "GP Subjects Learner (21 yrs)",
    content:
      "GP Subjects allowed me to dive deep into mathematical logic and epistemology. The modules are advanced, specialized, and completely exclusive!",
    rating: 5,
    avatar: getCloudinaryFetchUrl(
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop",
    ),
  },
  {
    name: "Mariam Al-Harbi",
    role: "Comprehensive Care Parent",
    content:
      "The comprehensive care and support for my gifted son has been a blessing. The academy nurtures both his high intellect and noble character.",
    rating: 5,
    avatar: getCloudinaryFetchUrl(
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100&auto=format&fit=crop",
    ),
  },
  {
    name: "Prof. David Miller",
    role: "Scientific Association Member",
    content:
      "Being part of the annual scientific conference and research programs has opened new horizons for my work in cognitive science and logic.",
    rating: 5,
    avatar: getCloudinaryFetchUrl(
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop",
    ),
  },
  {
    name: "Tariq Mahmood",
    role: "E-Commerce Project Innovator",
    content:
      "The knowledge-based e-commerce platform provided me the perfect environment to apply my genius ideas into a successful digital business.",
    rating: 5,
    avatar: getCloudinaryFetchUrl(
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=100&auto=format&fit=crop",
    ),
  },
  {
    name: "Sarah & Ahmed",
    role: "Appropriate Marriage Success",
    content:
      "Alhamdulillah, the values-based matching process helped us find deep compatibility grounded in virtue. Truly a legendary project for families!",
    rating: 5,
    avatar: getCloudinaryFetchUrl(
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=100&auto=format&fit=crop",
    ),
  },
];

interface TestimonialsProps {
  title?: string | null;
  body?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
}

export function Testimonials({
  title = "WHAT OUR TALENTED, GIFTED, AND GENIUSES SAY?!",
  body = "Join the legendary network of scholars and leaders who have unlocked their potential through PHAGLP.",
  ctaLabel,
  ctaHref,
}: TestimonialsProps) {
  return (
    <section className="py-24 px-4 bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-primary dark:text-blue-400 tracking-tight text-balance uppercase">
            {title}
          </h2>
          {body && (
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium">
              {body}
            </p>
          )}
        </div>

        {/* Dynamic 7-section Grid Layout */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <Card
              key={index}
              className={`border-none shadow-md hover:shadow-xl transition-all duration-300 bg-background relative overflow-hidden group rounded-2xl ${
                index === 6
                  ? "md:col-span-2 lg:col-span-3 max-w-2xl mx-auto w-full"
                  : ""
              }`}
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="pb-4">
                <div className="flex gap-1 mb-2">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Quote className="absolute -top-4 -left-2 w-8 h-8 text-slate-100 dark:text-slate-800 -z-10" />
                  <p className="text-slate-700 dark:text-slate-300 italic mb-8 relative z-10 leading-relaxed font-medium">
                    &quot;{t.content.replace(/'/g, "&apos;")}&quot;
                  </p>
                </div>

                <div className="flex items-center gap-4 border-t pt-6 border-slate-100 dark:border-slate-800">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-slate-100 shrink-0">
                    <Image
                      src={t.avatar}
                      alt={t.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-slate-100 leading-tight">
                      {t.name}
                    </div>
                    <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mt-1">
                      {t.role}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {ctaLabel && ctaHref && (
          <div className="flex justify-center mt-12">
            <a
              href={ctaHref}
              className="inline-flex items-center gap-2 rounded-2xl bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground shadow-md transition-all duration-200 ease-in-out hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              {ctaLabel}
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
