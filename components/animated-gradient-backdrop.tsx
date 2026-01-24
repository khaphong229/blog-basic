"use client"

import { useEffect, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"

/**
 * AnimatedTerminalBackdrop
 *
 * Terminal-style animated background with matrix rain effect and grid pattern.
 * Creates a hacker/developer aesthetic with subtle animations.
 *
 * Features:
 * - Matrix-style falling characters
 * - Grid pattern overlay
 * - Scanlines effect
 * - Respects prefers-reduced-motion
 * - Subtle glow effects
 */

interface AnimatedTerminalBackdropProps {
  className?: string
  showMatrix?: boolean
  showGrid?: boolean
  showScanlines?: boolean
}

// Matrix rain characters
const MATRIX_CHARS =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF<>/{}[]"

function MatrixColumn({ delay, duration }: { delay: number; duration: number }) {
  const [chars, setChars] = useState<string[]>([])

  useEffect(() => {
    const generateChars = () => {
      const length = Math.floor(Math.random() * 15) + 5
      return Array.from(
        { length },
        () => MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]
      )
    }
    setChars(generateChars())

    const interval = setInterval(() => {
      setChars(generateChars())
    }, duration * 1000)

    return () => clearInterval(interval)
  }, [duration])

  return (
    <motion.div
      className="text-primary/20 absolute top-0 font-mono text-xs leading-tight select-none"
      initial={{ y: "-100%", opacity: 0 }}
      animate={{ y: "100vh", opacity: [0, 1, 1, 0] }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      {chars.map((char, i) => (
        <div key={i} className={i === 0 ? "text-primary/60 text-glow-green" : ""}>
          {char}
        </div>
      ))}
    </motion.div>
  )
}

export default function AnimatedTerminalBackdrop({
  className = "",
  showMatrix = true,
  showGrid = true,
  showScanlines = true,
}: AnimatedTerminalBackdropProps) {
  const prefersReducedMotion = useReducedMotion()
  const [columns, setColumns] = useState<
    Array<{ id: number; left: number; delay: number; duration: number }>
  >([])

  useEffect(() => {
    if (prefersReducedMotion || !showMatrix) return

    // Generate matrix columns
    const numColumns = Math.floor(window.innerWidth / 30)
    const newColumns = Array.from({ length: numColumns }, (_, i) => ({
      id: i,
      left: (i / numColumns) * 100,
      delay: Math.random() * 10,
      duration: Math.random() * 10 + 8,
    }))
    setColumns(newColumns)
  }, [prefersReducedMotion, showMatrix])

  return (
    <div
      className={`pointer-events-none fixed inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(0,255,136,0.03) 0%, transparent 50%)",
        }}
      />

      {/* Grid pattern */}
      {showGrid && <div className="bg-grid-pattern absolute inset-0 opacity-50" />}

      {/* Matrix rain effect */}
      {showMatrix && !prefersReducedMotion && (
        <div className="absolute inset-0 overflow-hidden">
          {columns.map((col) => (
            <div key={col.id} className="absolute top-0" style={{ left: `${col.left}%` }}>
              <MatrixColumn delay={col.delay} duration={col.duration} />
            </div>
          ))}
        </div>
      )}

      {/* Scanlines overlay */}
      {showScanlines && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
          }}
        />
      )}

      {/* Corner accents */}
      <div className="border-primary/10 absolute top-0 left-0 h-32 w-32 border-t-2 border-l-2" />
      <div className="border-primary/10 absolute top-0 right-0 h-32 w-32 border-t-2 border-r-2" />
      <div className="border-primary/10 absolute bottom-0 left-0 h-32 w-32 border-b-2 border-l-2" />
      <div className="border-primary/10 absolute right-0 bottom-0 h-32 w-32 border-r-2 border-b-2" />

      {/* Subtle vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.3) 100%)",
        }}
      />
    </div>
  )
}

// Export the old name for backward compatibility
export { AnimatedTerminalBackdrop as AnimatedGradientBackdrop }
