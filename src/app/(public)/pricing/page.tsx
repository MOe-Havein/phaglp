import { auth } from "@/auth"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { SubscriptionTier } from "@prisma/client"
import { CheckCircle2, Star, Sparkles, Building2 } from "lucide-react"
import Link from "next/link"
import { getFoxyCartUrl } from "@/lib/foxy"

const tiers = [
  {
    name: "Basic",
    id: SubscriptionTier.BASIC,
    price: "Free",
    description: "Perfect for casual learners exploring philosophy.",
    icon: Star,
    features: [
      "Access to all public lectures",
      "Community forum access",
      "Basic philosophical assessment",
      "Monthly newsletter",
      "Mobile-friendly interface",
    ],
    buttonText: "Current Plan",
    buttonVariant: "outline" as const,
  },
  {
    name: "Pro",
    id: SubscriptionTier.PRO,
    price: "$29",
    period: "/month",
    description: "Advanced learning tools and deeper insights for serious students.",
    icon: Sparkles,
    features: [
      "Everything in Basic",
      "Access to all Premium courses",
      "Interactive curriculum management",
      "Priority community support",
      "AI-powered content generator",
      "Certificate of completion",
    ],
    buttonText: "Upgrade to Pro",
    buttonVariant: "default" as const,
    popular: true,
  },
  {
    name: "Enterprise",
    id: SubscriptionTier.ENTERPRISE,
    price: "Custom",
    description: "Tailored solutions for institutions, research groups, and large teams.",
    icon: Building2,
    features: [
      "Everything in Pro",
      "Unlimited students & researchers",
      "Custom philosophical curriculum",
      "Dedicated account manager",
      "API access & integrations",
      "Advanced platform analytics",
      "White-glove onboarding",
    ],
    buttonText: "Contact Sales",
    buttonVariant: "outline" as const,
  },
]

export default async function PricingPage() {
  const session = await auth()
  const userTier = session?.user?.tier || SubscriptionTier.BASIC

  return (
    <div className="min-h-screen bg-secondary/30 py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-foreground">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Unlock ancient wisdom with modern tools. Choose the plan that best fits your pursuit of
            knowledge.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-start">
          {tiers.map((tier) => {
            const isCurrentPlan = userTier === tier.id
            const Icon = tier.icon

            return (
              <Card
                key={tier.id}
                className={`relative flex flex-col h-full bg-background transition-all duration-300 hover:shadow-lg ${
                  tier.popular ? "border-primary shadow-md scale-105 z-10" : "border-border"
                }`}
              >
                {tier.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      Most Popular
                    </span>
                  </div>
                )}

                <CardHeader className="text-center pt-8">
                  <div className="mx-auto bg-secondary/50 p-3 rounded-full w-fit mb-4 text-primary dark:text-blue-400">
                    <Icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-2xl font-bold">{tier.name}</CardTitle>
                  <CardDescription className="h-10 mt-2">{tier.description}</CardDescription>
                  <div className="my-6">
                    <span className="text-5xl font-extrabold text-foreground">{tier.price}</span>
                    {tier.period && (
                      <span className="text-muted-foreground font-medium">{tier.period}</span>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="flex-grow">
                  <ul className="space-y-4">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="mt-8">
                  {isCurrentPlan ? (
                    <Button
                      className="w-full bg-secondary text-secondary-foreground hover:bg-secondary cursor-default"
                      variant="secondary"
                      size="lg"
                    >
                      Current Plan
                    </Button>
                  ) : !session ? (
                    <Button asChild className="w-full" variant={tier.buttonVariant} size="lg">
                      <Link href="/login">Sign in to Upgrade</Link>
                    </Button>
                  ) : tier.id === SubscriptionTier.ENTERPRISE ? (
                    <Button asChild className="w-full" variant={tier.buttonVariant} size="lg">
                      <Link href="/contact">Contact Sales</Link>
                    </Button>
                  ) : (
                    <Button asChild className="w-full" variant={tier.buttonVariant} size="lg">
                      <a
                        href={getFoxyCartUrl({
                          code: "PRO_TIER",
                          name: "Pro Subscription",
                          price: 29.0,
                          userId: session.user.id || undefined,
                          userEmail: session.user.email || undefined,
                          customParams: {
                            sub_frequency: "1m",
                          },
                        })}
                      >
                        {tier.buttonText}
                      </a>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
