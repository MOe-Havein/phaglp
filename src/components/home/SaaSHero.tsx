"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// 1. Restore the props interface so the Homepage can pass data in
interface SaaSHeroProps {
  badgeText?: string;
  headlinePre?: string;
  headlineHighlight?: string;
  headlinePost?: string;
  subheadline?: string;
  primaryCtaText?: string;
  primaryCtaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
}

// 2. Destructure the props with default fallbacks
export function SaaSHero({
  badgeText = "Phaglp - Philosophical Platform",
  headlinePre = "THE PHILOSOPHICAL ACADEMY",
  headlineHighlight = "FOR GENIUSES LIFE PLANNING",
  headlinePost = "",
  subheadline = "A modern application for philosophical education.",
  primaryCtaText = "Explore Courses",
  primaryCtaHref = "/courses",
  secondaryCtaText = "Read Lectures",
  secondaryCtaHref = "/lectures",
}: SaaSHeroProps) {
  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center py-20 px-4 overflow-hidden select-none bg-slate-950">
      {/* Background Radial Glow */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-tartorange/20 via-transparent to-transparent dark:from-tartorange/10" />
      
      {/* Foreground Content */}
      <div className="container mx-auto text-center max-w-4xl relative">
        {/* 3. Inject the dynamic badgeText */}
        {badgeText && (
          <Badge className="mb-4 bg-perfectsky/10 text-perfectsky hover:bg-perfectsky/15 border-perfectsky/20 transition-all duration-300 hover:scale-105">
            {badgeText}
          </Badge>
        )}
        
        {/* 4. Inject the dynamic headline pieces */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance bg-gradient-to-r from-perfectsky via-tartorange to-celebration bg-clip-text text-transparent drop-shadow-sm flex flex-col gap-2">
          <span>{headlinePre}</span>
          <span>{headlineHighlight}</span>
          {headlinePost && <span>{headlinePost}</span>}
        </h1>
        
        {/* 5. Inject the dynamic subheadline */}
        {subheadline && (
          <p className="text-xl text-platinum mb-8 leading-relaxed text-pretty max-w-2xl mx-auto">
            {subheadline}
          </p>
        )}
        
        {/* 6. Inject the dynamic Call-to-Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-perfectsky text-frost hover:bg-perfectsky/90 shadow-lg shadow-perfectsky/25 transition-all hover:scale-105 active:scale-95"
            asChild
          >
            <Link href={primaryCtaHref}>
              {primaryCtaText} <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            asChild
            className="border-platinum/30 text-platinum hover:bg-platinum/10 bg-transparent transition-all hover:scale-105 active:scale-95"
          >
            <Link href={secondaryCtaHref}>{secondaryCtaText}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
