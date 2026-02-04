"use client"

import { useLanguage } from "@/context/language-context"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronRight, Code2, Rss, Terminal } from "lucide-react"

import BlogListing from "./blog-listing"
import Navigation from "./navigation"
import AnimatedGradientBackdrop from "./animated-gradient-backdrop"
import { Button } from "./ui/button"

// Typing effect hook
function useTypingEffect(text: string, speed: number = 50) {
  const [displayedText, setDisplayedText] = useState("")
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    setDisplayedText("")
    setIsComplete(false)
    let index = 0

    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1))
        index++
      } else {
        setIsComplete(true)
        clearInterval(timer)
      }
    }, speed)

    return () => clearInterval(timer)
  }, [text, speed])

  return { displayedText, isComplete }
}

export default function HomePage() {
  const { language, t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")

  const heroTitle = language === "en" ? "Welcome to the Terminal" : "Chào mừng đến Terminal"

  const { displayedText, isComplete } = useTypingEffect(heroTitle, 80)

  const stats = [
    { label: language === "en" ? "Posts" : "Bài viết", value: "50+", icon: Rss },
    { label: language === "en" ? "Topics" : "Chủ đề", value: "12", icon: Code2 },
    { label: language === "en" ? "Active" : "Hoạt động", value: "24/7", icon: Terminal },
  ]

  return (
    <div className="bg-background text-foreground relative min-h-screen overflow-hidden">
      {/* Terminal backdrop with matrix effect */}
      <AnimatedGradientBackdrop showMatrix={true} showGrid={true} showScanlines={true} />

      <Navigation />

      <main className="relative z-10 container mx-auto px-4 pt-24 pb-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          {/* Terminal window for hero */}
          <div className="mx-auto max-w-4xl">
            {/* Terminal header */}
            <div className="bg-muted/50 border-border flex items-center gap-2 border border-b-0 px-4 py-3">
              <div className="flex items-center gap-1.5">
                <div className="bg-destructive/80 h-3 w-3 rounded-full" />
                <div className="bg-accent/80 h-3 w-3 rounded-full" />
                <div className="bg-primary/80 h-3 w-3 rounded-full" />
              </div>
              <div className="flex-1 text-center">
                <span className="text-muted-foreground font-mono text-xs">
                  ~/blog — bash — 80×24
                </span>
              </div>
            </div>

            {/* Terminal content */}
            <div className="bg-card/80 border-border border p-6 backdrop-blur-sm md:p-8">
              {/* Command prompt */}
              <div className="mb-6 flex items-start gap-2">
                <span className="text-primary font-mono">$</span>
                <span className="text-muted-foreground font-mono">cat welcome.txt</span>
              </div>

              {/* Hero title with typing effect */}
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-foreground mb-4 font-mono text-3xl font-bold md:text-5xl"
              >
                <span className="text-primary">&gt;</span> {displayedText}
                <span
                  className={`bg-primary ml-1 inline-block h-8 w-3 md:h-12 ${
                    isComplete ? "animate-pulse" : ""
                  }`}
                />
              </motion.h1>

              {/* Subtitle */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-8"
              >
                <div className="mb-2 flex items-start gap-2">
                  <span className="text-secondary font-mono text-sm">//</span>
                  <p className="text-muted-foreground font-mono text-sm md:text-base">
                    {language === "en"
                      ? "A developer-focused blog featuring tutorials, insights, and tech stories."
                      : "Blog dành cho developer với các hướng dẫn, insights và câu chuyện công nghệ."}
                  </p>
                </div>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mb-8 grid grid-cols-3 gap-4"
              >
                {stats.map((stat, index) => (
                  <div
                    key={stat.label}
                    className="border-border bg-muted/30 hover:border-primary/50 border p-4 text-center transition-colors"
                  >
                    <stat.icon className="text-primary mx-auto mb-2 h-5 w-5" />
                    <div className="text-foreground font-mono text-2xl font-bold">{stat.value}</div>
                    <div className="text-muted-foreground font-mono text-xs tracking-wider uppercase">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* CTA buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="flex flex-wrap gap-4"
              >
                <Button variant="default" size="lg">
                  <ChevronRight className="h-4 w-4" />
                  {language === "en" ? "Explore Posts" : "Khám phá bài viết"}
                </Button>
                <Button variant="outline" size="lg">
                  {language === "en" ? "About Me" : "Về tôi"}
                </Button>
              </motion.div>

              {/* Command line decoration */}
              <div className="border-border mt-8 border-t pt-4">
                <div className="text-muted-foreground flex items-center gap-2 font-mono text-sm">
                  <span className="text-primary">$</span>
                  <span className="animate-pulse">_</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Section divider */}
        <div className="mx-auto mb-8 flex max-w-4xl items-center gap-4">
          <div className="via-border h-px flex-1 bg-gradient-to-r from-transparent to-transparent" />
          <span className="text-muted-foreground font-mono text-xs tracking-widest uppercase">
            {language === "en" ? "Latest Posts" : "Bài viết mới nhất"}
          </span>
          <div className="via-border h-px flex-1 bg-gradient-to-r from-transparent to-transparent" />
        </div>

        {/* Blog listing */}
        <BlogListing searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </main>

      {/* Footer */}
      <footer className="border-border bg-card/50 relative z-10 border-t py-8 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-muted-foreground font-mono text-sm">
              <span className="text-primary">&gt;</span> Built with Next.js + TypeScript
            </div>
            <div className="text-muted-foreground font-mono text-xs">
              <span className="text-primary">$</span> echo &quot;© 2024 Terminal Blog&quot;
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
