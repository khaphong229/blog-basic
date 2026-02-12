"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export default function AnimatedGradientBackdrop() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-background">
      <div className="absolute inset-0 bg-dot-pattern opacity-[0.4]" />

      {/* Abstract Gradient Blobs */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-[20%] -left-[10%] h-[600px] w-[600px] rounded-full bg-primary/20 blur-[120px]"
      />

      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.4, 0.3],
          x: [0, -30, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute top-[20%] -right-[10%] h-[500px] w-[500px] rounded-full bg-blue-500/20 blur-[100px]"
      />

      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
          x: [0, 40, 0],
          y: [0, -40, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5,
        }}
        className="absolute bottom-[0%] left-[20%] h-[400px] w-[400px] rounded-full bg-violet-500/20 blur-[100px]"
      />
    </div>
  )
}
