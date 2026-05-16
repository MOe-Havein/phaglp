"use client"

import { motion, HTMLMotionProps } from "framer-motion"
import { ReactNode } from "react"

interface AnimatedCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode
  delay?: number
}

export function AnimatedCard({ children, delay = 0, ...props }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay,
        ease: [0.25, 0.1, 0.25, 1.0],
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
