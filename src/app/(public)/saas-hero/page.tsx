import React from "react"
import { Metadata } from "next"
import { SaaSHero } from "@/components/home/SaaSHero"

export const metadata: Metadata = {
  title: "SaaS Hero Showcase - FreshNextJS",
  description:
    "A sleek, modern dark mode SaaS hero section preview with a floating glowing browser mockup.",
}

export default function SaasHeroShowcase() {
  return (
    <main className="bg-[#030712] min-h-screen w-full flex flex-col justify-start">
      <SaaSHero
        badgeText="New Feature Release ->"
        headlinePre="Structure Your Thoughts,"
        headlineHighlight="Elevate Critical Thinking"
        headlinePost="with AI Socratic Mapping"
        subheadline="An interactive canvas designed to map philosophical debates, analyze logical syllogisms, and collaborate on structured reasoning alongside an AI-guided tutor."
        primaryCtaText="Get Started For Free"
        primaryCtaHref="/register"
        secondaryCtaText="Watch Preview"
        secondaryCtaHref="#video-preview"
      />
      <div className="h-1 w-full bg-tinfoil" />
    </main>
  )
}
