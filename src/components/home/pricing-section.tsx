import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Check, Sparkles, Zap, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

const pricingPlans = [
  {
    name: "Basic",
    price: "0",
    description: "Essential wisdom for those starting their philosophical journey.",
    features: [
      "Access to all public lectures",
      "Community forum access",
      "Basic philosophical assessment",
      "Monthly newsletter",
      "Mobile-friendly interface",
    ],
    cta: "Get Started",
    href: "/register",
    popular: false,
    icon: Zap,
  },
  {
    name: "Pro",
    price: "29",
    description: "Advanced learning tools and deeper insights for serious students.",
    features: [
      "Everything in Basic",
      "Access to all Premium courses",
      "Interactive curriculum management",
      "Priority community support",
      "AI-powered content generator",
      "Certificate of completion",
    ],
    cta: "Try Pro Now",
    href: "/register?plan=pro",
    popular: true,
    icon: Sparkles,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Tailored solutions for institutions, research groups, and large teams.",
    features: [
      "Everything in Pro",
      "Unlimited students & researchers",
      "Custom philosophical curriculum",
      "Dedicated account manager",
      "API access & integrations",
      "Advanced platform analytics",
      "White-glove onboarding",
    ],
    cta: "Contact Sales",
    href: "/contact",
    popular: false,
    icon: ShieldCheck,
  },
]

export function PricingSection() {
  return (
    <section className="py-24 px-4 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/15 border-primary/20">
            Investment in Wisdom
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground text-balance">
            Simple, Transparent Pricing Plans
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Choose the path that best fits your goals for growth, learning, and philosophical
            discovery.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-start">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative flex flex-col h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                plan.popular
                  ? "border-[#2563EB] shadow-lg shadow-blue-500/10 scale-105 z-10 bg-gradient-to-b from-white to-blue-50/20 dark:from-slate-900 dark:to-blue-900/10"
                  : "border-border bg-background"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Badge className="bg-[#2563EB] text-white hover:bg-[#2563EB] px-4 py-1.5 shadow-md border-none">
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      plan.popular ? "bg-[#2563EB] text-white" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <plan.icon className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                </div>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-4xl font-bold tracking-tight">
                    {plan.price !== "Custom" && "$"}
                    {plan.price}
                  </span>
                  {plan.price !== "Custom" && (
                    <span className="text-muted-foreground font-medium">/month</span>
                  )}
                </div>
                <CardDescription className="pt-4 text-base min-h-[60px]">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-grow">
                <div className="space-y-4">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3 group">
                      <div
                        className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                          plan.popular
                            ? "bg-blue-100 dark:bg-blue-900/30 text-[#2563EB]"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-slate-600 dark:text-slate-400 group-hover:text-foreground transition-colors">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="pt-8">
                <Button
                  asChild
                  className={`w-full h-12 text-lg font-semibold transition-all duration-300 ${
                    plan.popular
                      ? "bg-[#2563EB] text-white hover:bg-primary shadow-lg shadow-blue-500/20"
                      : "bg-foreground text-background hover:bg-foreground/90"
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground">
            All plans include a 14-day money-back guarantee. Have questions?{" "}
            <Link
              href="/contact"
              className="text-primary font-semibold hover:underline underline-offset-4"
            >
              Talk to our support team
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
