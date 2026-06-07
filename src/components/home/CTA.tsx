"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

interface CTAProps {
  title?: string | null;
  body?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
}

export function CTA({
  title = "Unlock Your Intellectual Potential",
  body = "Enroll in specialized philosophical courses, join interactive scientific fellowships, and structure your life path today.",
  ctaLabel = "Get Started Now",
  ctaHref = "/register",
}: CTAProps) {
  return (
    <section className="relative py-24 px-6 overflow-hidden bg-slate-950 text-slate-100 flex items-center justify-center">
      {/* Background neon flares */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.16),transparent_60%)] blur-3xl pointer-events-none animate-pulse"
        style={{ animationDuration: "12s" }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.10),transparent_60%)] blur-3xl pointer-events-none" />

      <div className="container mx-auto max-w-5xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl p-10 md:p-16 overflow-hidden border border-slate-800 bg-slate-900/40 backdrop-blur-md shadow-2xl text-center flex flex-col items-center"
        >
          {/* Top spark indicator */}
          <div className="mb-6 w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-blue-400 border border-slate-700 shadow-sm">
            <Sparkles size={16} />
          </div>

          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-6 leading-tight max-w-3xl text-balance uppercase">
            {title}
          </h2>

          {body && (
            <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mb-10 text-pretty">
              {body}
            </p>
          )}

          {ctaLabel && ctaHref && (
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <a
                href={ctaHref}
                className="inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-8 py-4.5 text-base font-bold text-white shadow-xl shadow-blue-500/10 transition-all duration-300"
              >
                {ctaLabel}
                <ArrowRight size={18} />
              </a>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
