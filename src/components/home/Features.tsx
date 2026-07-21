"use client";

import React from "react";
import { motion } from "framer-motion";
import { Cpu, Microscope, ShieldAlert, Award } from "lucide-react";
import Image from "next/image";

interface FeaturesProps {
  title?: string | null;
  body?: string | null;
  mediaUrl?: string | null;
  mediaAlt?: string | null;
}

const defaultFeatures = [
  {
    icon: <Cpu className="w-6 h-6 text-blue-500" />,
    title: "Education & Wisdom",
    description: "Deep dive into historical and modern philosophical systems",
  },
  {
    icon: <Microscope className="w-6 h-6 text-orange-500" />,
    title: "Applied Science",
    description:
      "Bridging the gap between theoretical wisdom and practical scientific application.",
  },
  {
    icon: <ShieldAlert className="w-6 h-6 text-green-500" />,
    title: "Fallacy Detection Engine",
    description:
      "Instantly check outlines, essays, and debate nodes for logical errors, cognitive biases, and inconsistencies.",
  },
  {
    icon: <Award className="w-6 h-6 text-purple-500" />,
    title: "Global Community",
    description:
      "Connect with researchers, students, and thinkers from around the world",
  },
];

export function Features({
  title = "Prepare for an Intellectual Revolution",
  body = "Discover advanced methodologies to analyze philosophy, master logic, and develop rigorous critical thinking standards.",
  mediaUrl,
  mediaAlt = "Academy features preview",
}: FeaturesProps) {
  return (
    <section className="relative py-24 px-6 overflow-hidden bg-surface text-foreground">
      {/* Background glow effects */}
      <div
        className="absolute top-1/4 left-10 w-[700px] h-[700px] bg-[radial-gradient(circle_at_center,rgba(0,86,210,0.06),transparent_60%)] blur-3xl pointer-events-none animate-pulse"
        style={{ animationDuration: "8s" }}
      />
      <div className="absolute bottom-1/4 right-10 w-[700px] h-[700px] bg-[radial-gradient(circle_at_center,rgba(0,86,210,0.04),transparent_60%)] blur-3xl pointer-events-none" />

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-slate-900 via-primary to-slate-600 bg-clip-text text-transparent uppercase"
          >
            {title}
          </motion.h2>
          {body && (
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg text-text-muted font-medium leading-relaxed"
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
                className="group flex flex-col p-6 rounded-2xl bg-card border border-border shadow-[0_0_8px_rgba(0,0,0,0.04)] hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center mb-5 border border-primary/10 group-hover:bg-primary/10 group-hover:scale-105 transition-all">
                  {feat.icon}
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2 tracking-tight group-hover:text-primary transition-colors">
                  {feat.title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed font-medium">
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
              <div className="relative w-full max-w-xl rounded-2xl overflow-hidden border border-border bg-slate-50 p-2.5 shadow-xl">
                {/* Browser bar decoration */}
                <div className="flex gap-1.5 px-3 py-2 border-b border-border bg-slate-100 rounded-t-xl">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="relative aspect-video rounded-b-xl overflow-hidden bg-slate-100">
                  {mediaUrl ? (
                    <Image
                      src={mediaUrl}
                      alt={mediaAlt || "Feature preview"}
                      fill
                      sizes="(max-width: 1024px) 100vw, 1024px"
                      className="object-cover select-none pointer-events-none transition-transform duration-700 hover:scale-103"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-secondary text-secondary-foreground">
                      No Media
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
