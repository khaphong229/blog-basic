"use client"

import { motion, useReducedMotion } from "framer-motion"

/**
 * AnimatedGradientBackdrop
 * 
 * A reusable background component with animated gradient blur blobs.
 * Creates a modern, calm, premium aesthetic with slow drifting motion.
 * 
 * Features:
 * - Respects prefers-reduced-motion for accessibility
 * - Performant on mobile (uses CSS blur + transforms only)
 * - Subtle gradients that don't affect text readability
 * - Configurable colors via CSS custom properties
 * 
 * Blob Layout:
 * - Blob 1 (Primary): Top-left, largest, slow drift right-down
 * - Blob 2 (Secondary): Top-right, medium, slow drift left-down  
 * - Blob 3 (Accent): Bottom-center, smallest, subtle float up
 */

interface AnimatedGradientBackdropProps {
  className?: string
}

export default function AnimatedGradientBackdrop({ 
  className = "" 
}: AnimatedGradientBackdropProps) {
  // Respect user's motion preferences
  const prefersReducedMotion = useReducedMotion()

  // Animation variants for blobs
  const blobVariants = {
    blob1: {
      animate: prefersReducedMotion 
        ? {} 
        : {
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.05, 1],
          },
      transition: {
        duration: 20,
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
    },
    blob2: {
      animate: prefersReducedMotion 
        ? {} 
        : {
            x: [0, -40, 0],
            y: [0, 50, 0],
            scale: [1, 0.95, 1],
          },
      transition: {
        duration: 25,
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
    },
    blob3: {
      animate: prefersReducedMotion 
        ? {} 
        : {
            x: [0, 30, -20, 0],
            y: [0, -40, 0],
            scale: [1, 1.08, 1],
          },
      transition: {
        duration: 30,
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
    },
  }

  return (
    <div 
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {/* Blob 1 - Primary color, top-left, largest */}
      <motion.div
        className="absolute -top-32 -left-32 w-[500px] h-[500px] md:w-[600px] md:h-[600px] rounded-full opacity-[0.15] dark:opacity-[0.08]"
        style={{
          background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
        animate={blobVariants.blob1.animate}
        transition={blobVariants.blob1.transition}
      />

      {/* Blob 2 - Secondary color, top-right, medium */}
      <motion.div
        className="absolute -top-20 -right-20 w-[400px] h-[400px] md:w-[500px] md:h-[500px] rounded-full opacity-[0.12] dark:opacity-[0.06]"
        style={{
          background: "radial-gradient(circle, var(--secondary) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
        animate={blobVariants.blob2.animate}
        transition={blobVariants.blob2.transition}
      />

      {/* Blob 3 - Accent blend, bottom-center, smallest */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[350px] h-[350px] md:w-[450px] md:h-[450px] rounded-full opacity-[0.10] dark:opacity-[0.05]"
        style={{
          background: "radial-gradient(circle, var(--accent) 0%, var(--primary) 50%, transparent 70%)",
          filter: "blur(100px)",
        }}
        animate={blobVariants.blob3.animate}
        transition={blobVariants.blob3.transition}
      />

      {/* Optional: Subtle noise texture overlay for premium feel */}
      <div 
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  )
}
