"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Brain } from "lucide-react";

interface SaaSHeroProps {
  badgeText?: string | undefined;
  headlinePre?: string | undefined;
  headlineHighlight?: string | undefined;
  headlinePost?: string | undefined;
  subheadline?: string | undefined;
  primaryCtaText?: string | undefined;
  primaryCtaHref?: string | undefined;
  secondaryCtaText?: string | undefined;
  secondaryCtaHref?: string | undefined;
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
      window.location.href = `${primaryCtaHref}?email=${encodeURIComponent(emailInput)}`;
    }
  };

  return (
    <section className="relative min-h-screen bg-[#030712] text-slate-100 flex flex-col justify-center items-center py-20 px-4 overflow-hidden select-none">
      {/* 1. LAYERED BACKGROUND RADIAL GRADIENTS & GRID PATTERNS */}
      <div className="absolute inset-0 z-0">
        {/* Subtle developer grid */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Large soft radial backgrounds (colors matching theme context: blue, orange, green) */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(31,123,198,0.15),transparent_65%)] blur-3xl pointer-events-none" />
        <div
          className="absolute bottom-[20%] left-[20%] w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(230,92,35,0.06),transparent_60%)] blur-3xl pointer-events-none animate-pulse"
          style={{ animationDuration: "8s" }}
        />
        <div className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(124,182,37,0.08),transparent_60%)] blur-3xl pointer-events-none" />

        {/* Linear overlay to ground the gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030712]/50 to-[#030712]" />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10 flex flex-col items-center text-center">
        {/* 2. TOP PILbadge WITH HOVER EFFECT AND PULSE */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8"
        >
          <a
            href="/blog"
            className="group inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-slate-300 transition-all duration-300 hover:scale-102 hover:shadow-[0_0_15px_rgba(31,123,198,0.2)]"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1f7bc6] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1f7bc6]"></span>
            </span>
            <span className="tracking-wide">{badgeText}</span>
            <ArrowRight
              size={12}
              className="text-slate-500 group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all"
            />
          </a>
        </motion.div>

        {/* 3. HEADLINE SECTION */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1] max-w-5xl mb-6 text-balance"
        >
          {headlinePre}{" "}
          <span className="bg-gradient-to-r from-[#1f7bc6] via-purple-400 to-[#e65c23] bg-clip-text text-transparent drop-shadow-sm">
            {headlineHighlight}
          </span>{" "}
          {headlinePost}
        </motion.h1>

        {/* 4. SUBHEADLINE SECTION */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-xl text-slate-400 max-w-3xl leading-relaxed mb-10 text-pretty font-medium"
        >
          {subheadline}
        </motion.p>

        {/* 5. CTAS - FORM WITH INPUT & BUTTON */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          className="w-full max-w-md flex flex-col gap-3 px-4"
        >
          <form
            onSubmit={handleCtaSubmit}
            className="flex flex-col sm:flex-row gap-2.5 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-[0_10px_35px_rgba(0,0,0,0.4)] focus-within:ring-2 focus-within:ring-[#1f7bc6] focus-within:border-transparent transition-all duration-300"
          >
            <div className="flex items-center gap-2 flex-grow px-3 py-2 sm:py-0">
              <span className="text-slate-500">
                <Brain size={16} />
              </span>
              <input
                type="email"
                name="email"
                required
                placeholder="Enter email to build your mind..."
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full bg-transparent border-0 p-0 text-sm focus:ring-0 placeholder:text-slate-500 focus:outline-none text-slate-100"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold h-11 rounded-xl px-5 bg-gradient-to-r from-[#1f7bc6] to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/10 hover:scale-[1.03] active:scale-[0.97] transition-all duration-200 cursor-pointer"
            >
              {primaryCtaText}
              <ArrowRight size={14} />
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
