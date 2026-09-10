import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Sparkles, Search, Filter, Eye, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function TemplatesPage() {
  const templates = [
    {
      id: 1,
      name: "SaaS Pro",
      description: "Perfect for software companies and startups",
      category: "SaaS",
      image: "/placeholder.svg?height=200&width=300",
      features: [
        "Hero Section",
        "Pricing Table",
        "Feature Grid",
        "Testimonials",
      ],
      popular: true,
    },
    {
      id: 2,
      name: "E-commerce Elite",
      description: "Stunning online store template",
      category: "E-commerce",
      image: "/placeholder.svg?height=200&width=300",
      features: [
        "Product Showcase",
        "Shopping Cart",
        "User Reviews",
        "Payment Integration",
      ],
    },
    {
      id: 3,
      name: "Agency Pro",
      description: "Creative agency and portfolio showcase",
      category: "Agency",
      image: "/placeholder.svg?height=200&width=300",
      features: [
        "Portfolio Grid",
        "Team Section",
        "Case Studies",
        "Contact Form",
      ],
    },
    {
      id: 4,
      name: "Restaurant Deluxe",
      description: "Beautiful restaurant and food business",
      category: "Restaurant",
      image: "/placeholder.svg?height=200&width=300",
      features: [
        "Menu Display",
        "Reservation System",
        "Gallery",
        "Location Map",
      ],
    },
    {
      id: 5,
      name: "Fitness Pro",
      description: "Gym and fitness center template",
      category: "Fitness",
      image: "/placeholder.svg?height=200&width=300",
      features: [
        "Class Schedule",
        "Trainer Profiles",
        "Membership Plans",
        "Progress Tracking",
      ],
    },
    {
      id: 6,
      name: "Consulting Expert",
      description: "Professional consulting services",
      category: "Consulting",
      image: "/placeholder.svg?height=200&width=300",
      features: [
        "Service Pages",
        "Expert Profiles",
        "Case Studies",
        "Booking System",
      ],
    },
  ];

  const categories = [
    "All",
    "SaaS",
    "E-commerce",
    "Agency",
    "Restaurant",
    "Fitness",
    "Consulting",
  ];

  return (
    <div className="min-h-screen bg-secondary">
      {/* Header */}
      <header className="bg-background border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-primary">
              AI Builder Pro
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button asChild className="bg-accent text-white hover:bg-accent/90">
              <Link href="/builder">Start Building</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-foreground text-balance">
            Professional Website Templates
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Choose from our collection of professionally designed, AI-optimized
            templates. Each template is fully responsive and conversion-focused.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input placeholder="Search templates..." className="pl-10" />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={category === "All" ? "default" : "secondary"}
                  className={`cursor-pointer ${category === "All" ? "bg-primary text-white hover:bg-primary/90" : "hover:bg-primary/10"}`}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template) => (
            <Card
              key={template.id}
              className="overflow-hidden hover:shadow-xl transition-shadow group bg-background"
            >
              <div className="relative">
                <Image
                  src={template.image || "/placeholder.svg"}
                  alt={template.name}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {template.popular && (
                  <Badge className="absolute top-3 left-3 bg-accent text-white hover:bg-accent/90">
                    <Zap className="w-3 h-3 mr-1" />
                    Popular
                  </Badge>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Button
                    size="sm"
                    className="bg-background text-foreground hover:bg-secondary"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      {template.name}
                      <Badge variant="outline">{template.category}</Badge>
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {template.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2 text-foreground">
                      Includes:
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {template.features.map((feature) => (
                        <Badge
                          key={feature}
                          variant="secondary"
                          className="text-xs"
                        >
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-accent text-white hover:bg-accent/90"
                      asChild
                    >
                      <Link href={`/builder?template=${template.id}`}>
                        Use Template
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 py-12 bg-gradient-to-r from-primary to-blue-600 rounded-2xl text-white">
          <h2 className="text-3xl font-bold mb-4 text-white text-balance">
            {"Don't See What You Need?"}
          </h2>
          <p className="text-lg mb-6 text-blue-100">
            Use our AI-powered builder to create a custom website from scratch
          </p>
          <Button
            size="lg"
            className="bg-accent text-white hover:bg-accent/90"
            asChild
          >
            <Link href="/builder">
              <Sparkles className="w-4 h-4 mr-2" />
              Create with AI
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
