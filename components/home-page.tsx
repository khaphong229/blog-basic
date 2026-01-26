"use client"

import { useLanguage } from "@/context/language-context"
import { useState } from "react"
import BlogListing from "./blog-listing"
import Navigation from "./navigation"
import AnimatedGradientBackdrop from "./animated-gradient-backdrop"
import HeroLottieDecoration from "./hero-lottie-decoration"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"

export default function HomePage() {
  const { language } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="bg-background text-foreground selection:bg-primary/20 relative min-h-screen overflow-hidden font-sans">
      {/* Layer 1: Animated gradient blobs (z-0) */}
      <AnimatedGradientBackdrop />

      {/* Layer 2: Dot pattern overlay (z-0) handled in global css but we can reinforce or modify here if needed */}

      <Navigation />

      <main className="relative z-10 container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="relative mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mx-auto max-w-4xl text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-primary/10 text-primary border-primary/20 mb-8 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium backdrop-blur-sm"
            >
              <Sparkles className="h-4 w-4" />
              <span>
                {language === "en" ? "Interactive Learning Platform" : "Nền tảng Học tập Tương tác"}
              </span>
            </motion.div>

            <h1 className="from-foreground to-foreground/70 mb-8 bg-gradient-to-b bg-clip-text pb-2 text-5xl font-extrabold tracking-tight text-balance text-transparent drop-shadow-sm md:text-7xl">
              {language === "en"
                ? "Unlock Your Potential with Expert Knowledge"
                : "Mở khóa Tiềm năng với Kiến thức Chuyên gia"}
            </h1>

            <p className="text-muted-foreground mx-auto max-w-2xl text-xl leading-relaxed text-pretty md:text-2xl">
              {language === "en"
                ? "Discover insightful articles, tutorials, and stories designed to help you grow and succeed."
                : "Khám phá các bài viết, hướng dẫn và câu chuyện sâu sắc được thiết kế để giúp bạn phát triển và thành công."}
            </p>
          </motion.div>

          {/* Decorative Elements - subtle floating shapes could go here if not using Lottie */}
          {/* <HeroLottieDecoration /> can be kept or refactored for a more minimal look. keeping it for now but maybe adjusting position if needed */}
        </div>

        <BlogListing searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </main>
    </div>
  )
}
