"use client"

import Lottie from "lottie-react"
import { useReducedMotion } from "framer-motion"
import logoAnimation from "@/public/Logo.json"

/**
 * HeroLottieDecoration
 * 
 * Decorative Lottie animation for the hero section.
 * - Appears on the right side on desktop (lg+)
 * - Smaller on tablet (md)
 * - Hidden on mobile (sm)
 * - Respects prefers-reduced-motion
 */

interface HeroLottieDecorationProps {
  className?: string
}

export default function HeroLottieDecoration({ 
  className = "" 
}: HeroLottieDecorationProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div 
      className={`
        hidden md:block
        absolute right-0 top-1/2 -translate-y-1/2
        pointer-events-none select-none
        opacity-70 dark:opacity-50
        md:w-[200px] md:h-[200px] md:-right-4
        lg:w-[280px] lg:h-[280px] lg:right-0
        xl:w-[320px] xl:h-[320px] xl:right-8
        ${className}
      `}
      aria-hidden="true"
    >
      <Lottie 
        animationData={logoAnimation}
        loop={!prefersReducedMotion}
        autoplay={!prefersReducedMotion}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  )
}
