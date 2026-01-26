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
  className = "",
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
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Blob 1 - Primary (Blue), top-left, largest - Knowledge & Trust */}
      <motion.div
        className="absolute -top-[10%] -left-[10%] h-[70vw] max-h-[800px] w-[70vw] max-w-[800px] rounded-full opacity-[0.12] mix-blend-multiply dark:opacity-[0.06] dark:mix-blend-screen"
        style={{
          background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
        animate={blobVariants.blob1.animate}
        transition={blobVariants.blob1.transition}
      />

      {/* Blob 2 - Secondary (Orange), top-right - Creativity & Energy */}
      <motion.div
        className="absolute top-[5%] -right-[10%] h-[60vw] max-h-[600px] w-[60vw] max-w-[600px] rounded-full opacity-[0.10] mix-blend-multiply dark:opacity-[0.05] dark:mix-blend-screen"
        style={{
          background: "radial-gradient(circle, var(--secondary) 0%, transparent 70%)",
          filter: "blur(90px)",
        }}
        animate={blobVariants.blob2.animate}
        transition={blobVariants.blob2.transition}
      />

      {/* Blob 3 - Accent (Teal), bottom-left - Balance & Clarity */}
      <motion.div
        className="absolute -bottom-[10%] -left-[5%] h-[65vw] max-h-[700px] w-[65vw] max-w-[700px] rounded-full opacity-[0.10] mix-blend-multiply dark:opacity-[0.05] dark:mix-blend-screen"
        style={{
          background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
          filter: "blur(110px)",
        }}
        animate={blobVariants.blob3.animate}
        transition={blobVariants.blob3.transition}
      />

      {/* Modern Grid Pattern Overlay - Educational feel */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
        }}
      />
    </div>
  )
}
