"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Check, ArrowRight, Menu, X } from "lucide-react";
import { useState } from "react";

interface WebsitePreviewProps {
  data: {
    title: string;
    subtitle: string;
    description: string;
    ctaText: string;
    features: string[];
  };
}

export function WebsitePreview({ data }: WebsitePreviewProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="h-full bg-background overflow-y-auto">
      {/* Preview Header */}
      <div className="bg-secondary border-b px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          </div>
          <div className="text-sm text-muted-foreground bg-background px-3 py-1 rounded">
            yourwebsite.com
          </div>
        </div>
        <Badge variant="secondary">Live Preview</Badge>
      </div>

      {/* Website Content */}
      <div className="min-h-full">
        {/* Navigation */}
        <nav className="bg-background border-b sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-blue-600 rounded-lg"></div>
                <span className="text-xl font-bold text-primary">
                  YourBrand
                </span>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-8">
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Home
                </a>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Services
                </a>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Contact
                </a>
                <Button
                  size="sm"
                  className="bg-accent text-white hover:bg-accent/90"
                >
                  Get Started
                </Button>
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </div>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
              <div className="md:hidden border-t py-4 space-y-4">
                <a
                  href="#"
                  className="block text-muted-foreground hover:text-foreground"
                >
                  Home
                </a>
                <a
                  href="#"
                  className="block text-muted-foreground hover:text-foreground"
                >
                  Services
                </a>
                <a
                  href="#"
                  className="block text-muted-foreground hover:text-foreground"
                >
                  Contact
                </a>
                <Button
                  size="sm"
                  className="w-full bg-accent text-white hover:bg-accent/90"
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </nav>

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 via-background to-blue-600/5 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                Welcome to the Future
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-blue-600 to-primary bg-clip-text text-transparent text-balance">
                {data.title}
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                {data.subtitle}
              </p>
              <p className="text-lg text-muted-foreground/80 mb-10 max-w-2xl mx-auto">
                {data.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-accent text-white hover:bg-accent/90"
                >
                  {data.ctaText} <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary/30 text-primary hover:bg-primary/5 bg-transparent"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground text-balance">
                Why Choose Us?
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Everything you need to succeed, all in one powerful platform
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.features.map((feature, index) => (
                <Card
                  key={index}
                  className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-secondary"
                >
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary/10 to-blue-600/10 rounded-lg flex items-center justify-center mb-4">
                      <Check className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-foreground">
                      {feature}
                    </h3>
                    <p className="text-muted-foreground">
                      Powerful feature that helps you achieve your goals faster
                      and more efficiently.
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-secondary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground text-balance">
                What Our Customers Say
              </h2>
              <p className="text-muted-foreground text-lg">
                Join thousands of satisfied customers worldwide
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="bg-background">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className="w-4 h-4 fill-accent text-accent"
                        />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4">
                      {
                        '"This platform has completely transformed how we do business. The results speak for themselves!"'
                      }
                    </p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-primary to-blue-600 rounded-full mr-3"></div>
                      <div>
                        <div className="font-semibold text-foreground">
                          Sarah Johnson
                        </div>
                        <div className="text-sm text-muted-foreground">
                          CEO, TechCorp
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary to-blue-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 text-balance">
              Ready to Get Started?
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of businesses who trust us to help them grow and
              succeed.
            </p>
            <Button
              size="lg"
              className="bg-accent text-white hover:bg-accent/90"
            >
              {data.ctaText} <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#0F1D45] text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-blue-600 rounded-lg"></div>
                  <span className="text-xl font-bold text-white">
                    YourBrand
                  </span>
                </div>
                <p className="text-blue-200/60">
                  Building the future, one innovation at a time.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-4 text-white">Product</h3>
                <ul className="flex flex-col gap-2 text-blue-200/60">
                  <li>
                    <a href="#" className="hover:text-white">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Security
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4 text-white">Company</h3>
                <ul className="flex flex-col gap-2 text-blue-200/60">
                  <li>
                    <a href="#" className="hover:text-white">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Careers
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4 text-white">Support</h3>
                <ul className="flex flex-col gap-2 text-blue-200/60">
                  <li>
                    <a href="#" className="hover:text-white">
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Contact
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Status
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-blue-900/50 mt-8 pt-8 text-center text-blue-200/60">
              <p>{"© 2024 YourBrand. All rights reserved."}</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
