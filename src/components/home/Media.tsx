"use client"

import React from "react"
import { motion } from "framer-motion"

interface MediaProps {
  title?: string | null
  body?: string | null
  mediaUrl?: string | null
  mediaAlt?: string | null
}

export function Media({ title, body, mediaUrl, mediaAlt = "Media preview" }: MediaProps) {
  return (
    <section className="relative py-24 px-6 overflow-hidden bg-slate-950 text-slate-100 flex flex-col justify-center items-center">
      {/* Background glow flares */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15),transparent_65%)] blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: "10s" }} />

      <div className="container mx-auto max-w-5xl relative z-10 text-center flex flex-col items-center">
        {title && (
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-6 uppercase"
          >
            {title}
          </motion.h2>
        )}

        {body && (
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-slate-400 text-lg font-medium leading-relaxed max-w-3xl mb-12"
          >
            {body}
          </motion.p>
        )}

        {mediaUrl && (
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-4xl p-2 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md shadow-2xl"
          >
            {/* macOS Window Controls */}
            <div className="flex gap-1.5 px-3 py-2 border-b border-slate-800/80 bg-slate-950/40 rounded-t-xl">
              <div className="w-3.5 h-3.5 rounded-full bg-red-500/80" />
              <div className="w-3.5 h-3.5 rounded-full bg-yellow-500/80" />
              <div className="w-3.5 h-3.5 rounded-full bg-green-500/80" />
            </div>

            {/* Image Wrapper */}
            <div className="overflow-hidden rounded-b-xl aspect-video bg-slate-950">
              <img
                src={mediaUrl}
                alt={mediaAlt || "Interactive Media"}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-102"
              />
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
