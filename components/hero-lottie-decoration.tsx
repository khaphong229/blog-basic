"use client"

import dynamic from "next/dynamic"
import { useState, useEffect } from "react"
import { useReducedMotion } from "framer-motion"

/**
 * Lazy-loaded Lottie component — only downloads when rendered
 * Logo.json (134KB) is code-split away from initial bundle
 */
const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
  loading: () => <div className="w-full h-full animate-pulse bg-muted/20 rounded-full" />,
})

// Lazy import animation data
const loadAnimation = () => import("@/public/Logo.json").then((m) => m.default)

interface HeroLottieDecorationProps {
  className?: string
}

export default function HeroLottieDecoration({
  className = ""
}: HeroLottieDecorationProps) {
  const prefersReducedMotion = useReducedMotion()

  // Load animation data lazily
  const [animationData, setAnimationData] = useState<unknown>(null)

  useEffect(() => {
    loadAnimation().then(setAnimationData)
  }, [])

  if (!animationData) return null

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
        animationData={animationData}
        loop={!prefersReducedMotion}
        autoplay={!prefersReducedMotion}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  )
}
