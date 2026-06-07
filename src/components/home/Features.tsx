"use client";

import React from "react";
import { motion } from "framer-motion";
import { Cpu, GraduationCap, ShieldAlert, Award } from "lucide-react";

interface FeaturesProps {
  title?: string | null;
  body?: string | null;
  mediaUrl?: string | null;
  mediaAlt?: string | null;
}

const defaultFeatures = [
  {
    icon: <Cpu className="w-6 h-6 text-blue-500" />,
    title: "AI Socratic Mapping",
    description:
      "Structure complex arguments and philosophical thoughts with real-time logical critique from our interactive AI assistant.",
  },
  {
    icon: <GraduationCap className="w-6 h-6 text-orange-500" />,
    title: "Gifted Education Paths",
    description:
      "Designed for high cognitive abilities, offering specialized, rigorous curriculums in mathematical logic and epistemological science.",
  },
  {
    icon: <ShieldAlert className="w-6 h-6 text-green-500" />,
    title: "Fallacy Detection Engine",
    description:
      "Instantly check outlines, essays, and debate nodes for logical errors, cognitive biases, and inconsistencies.",
  },
  {
    icon: <Award className="w-6 h-6 text-purple-500" />,
    title: "Intellectual Fellowship",
    description:
      "A values-based, privacy-first ecosystem matching intellectual compatibility and scientific collaboration.",
  },
];

export function Features({
  title = "Prepare for an Intellectual Revolution",
  body = "Discover advanced methodologies to analyze philosophy, master logic, and develop rigorous critical thinking standards.",
  mediaUrl,
  mediaAlt = "Academy features preview",
}: FeaturesProps) {
  return (
    <section
      className="relative py-24 px-6 overflow-hidden text-slate-100"
      style={{
        background:
          "radial-gradient(circle at 20% 20%, rgba(31, 123, 198, 0.18) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(230, 92, 35, 0.15) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.10) 0%, transparent 60%), #030712",
      }}
    >
      {/* Background glow effects */}
      <div
        className="absolute top-1/4 left-10 w-[700px] h-[700px] bg-[radial-gradient(circle_at_center,rgba(31,123,198,0.28),transparent_60%)] blur-3xl pointer-events-none animate-pulse"
        style={{ animationDuration: "8s" }}
      />
      <div className="absolute bottom-1/4 right-10 w-[700px] h-[700px] bg-[radial-gradient(circle_at_center,rgba(230,92,35,0.18),transparent_60%)] blur-3xl pointer-events-none" />

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent uppercase"
          >
            {title}
          </motion.h2>
          {body && (
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg text-slate-400 font-medium leading-relaxed"
            >
              {body}
            </motion.p>
          )}
        </div>

        {/* Dynamic media & features grid layout */}
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Features Cards Grid */}
          <div
            className={`${mediaUrl ? "lg:col-span-6" : "lg:col-span-12"} grid sm:grid-cols-2 gap-6`}
          >
            {defaultFeatures.map((feat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group flex flex-col p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/[0.02]"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-800/50 flex items-center justify-center mb-5 border border-slate-700/50 group-hover:bg-slate-850 group-hover:scale-105 transition-all">
                  {feat.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-200 mb-2 tracking-tight group-hover:text-white transition-colors">
                  {feat.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed font-medium">
                  {feat.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Optional Media Showoff */}
          {mediaUrl && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-6 flex justify-center"
            >
              <div className="relative w-full max-w-xl rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/40 p-2.5 shadow-2xl">
                {/* Browser bar decoration */}
                <div className="flex gap-1.5 px-3 py-2 border-b border-slate-800/80 bg-slate-950/40 rounded-t-xl">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="relative aspect-video rounded-b-xl overflow-hidden bg-slate-950">
                  <img
                    src={mediaUrl}
                    alt={mediaAlt || "Feature preview"}
                    className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-700 hover:scale-103"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
