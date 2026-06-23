"use client";

import React, { useState } from "react";
import { ArrowRight, Brain } from "lucide-react";

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

export function SaaSHero({
  badgeText = "New Feature Release",
  headlinePre = "Supercharge Your",
  headlineHighlight = "Intellectual Workflow",
  headlinePost = "with AI Socratic Mapping",
  subheadline = "Phaglp is the interactive canvas for structuring logic, mapping philosophical arguments, and mastering complex critical thinking with a real-time AI tutor.",
  primaryCtaText = "Start Mapping Free",
  primaryCtaHref = "/register",
}: SaaSHeroProps) {
  const [emailInput, setEmailInput] = useState("");

  const handleCtaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput) {
      window.location.href = `${primaryCtaHref}?email=${encodeURIComponent(
        emailInput
      )}`;
    }
  };

  return (
    <section className="relative min-h-screen bg-slate-950 text-frost flex flex-col justify-center items-center py-20 px-4 overflow-hidden select-none">
      {/* 1. LAYERED BACKGROUND RADIAL GRADIENTS */}
      <div className="absolute inset-0 z-0">
        {/* Subtle developer grid */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(var(--tw-colors-tinfoil, #a3a9b1) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* High-contrast ambient glows using custom config colors */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-perfectsky/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[20%] left-[15%] w-[500px] h-[500px] bg-tartorange/15 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[5%] right-[10%] w-[600px] h-[600px] bg-laser/15 blur-[120px] rounded-full pointer-events-none" />

        {/* Linear overlay to ground the background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/80 to-slate-950" />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10 flex flex-col items-center text-center">
        {/* 2. TOP PILL BADGE */}
        <div className="mb-8">
          <a
            href="/blog"
            className="group inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-slate-900/50 border border-perfectsky/40 hover:border-perfectsky text-platinum backdrop-blur-md transition-all duration-300 hover:shadow-[0_0_20px_rgba(31,123,198,0.3)]"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-perfectsky opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-perfectsky"></span>
            </span>
            <span className="tracking-wider uppercase">{badgeText}</span>
            <ArrowRight
              size={12}
              className="text-perfectsky group-hover:translate-x-0.5 transition-transform"
            />
          </a>
        </div>

        {/* 3. HEADLINE SECTION */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-frost leading-[1.1] max-w-5xl mb-6 text-balance">
          {headlinePre}{" "}
          {/* Striking multi-stop gradient using custom config tones */}
          <span className="bg-gradient-to-r from-perfectsky via-tartorange to-celebration bg-clip-text text-transparent drop-shadow-md">
            {headlineHighlight}
          </span>{" "}
          {headlinePost}
        </h1>

        {/* 4. SUBHEADLINE SECTION */}
        <p className="text-lg md:text-xl text-platinum max-w-3xl leading-relaxed mb-10 text-pretty font-medium">
          {subheadline}
        </p>

        {/* 5. CTAS - FORM WITH INPUT & BUTTON */}
        <div className="w-full max-w-md flex flex-col gap-3 px-4">
          <form
            onSubmit={handleCtaSubmit}
            className="flex flex-col sm:flex-row gap-2.5 p-1.5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 shadow-2xl focus-within:ring-2 focus-within:ring-perfectsky focus-within:border-transparent transition-all duration-300"
          >
            <div className="flex items-center gap-3 flex-grow px-4 py-3 sm:py-0">
              <span className="text-perfectsky">
                <Brain size={18} />
              </span>
              <input
                type="email"
                name="email"
                required
                placeholder="Enter email to build your mind..."
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full bg-transparent border-0 p-0 text-base focus:ring-0 placeholder:text-platinum/50 focus:outline-none text-frost font-medium"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-bold h-12 rounded-xl px-6 bg-perfectsky hover:bg-perfectsky/90 text-white shadow-lg shadow-perfectsky/25 transition-all duration-300 cursor-pointer"
            >
              {primaryCtaText}
              <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
