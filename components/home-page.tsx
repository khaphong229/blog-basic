"use client"

import { useLanguage } from "@/context/language-context"
import { useState } from "react"
import LanguageSelector from "./language-selector"
import BlogListing from "./blog-listing"
import Navigation from "./navigation"
import { motion } from "framer-motion"

export default function HomePage() {
  const { language } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <div className="absolute inset-0 bg-dot-pattern opacity-30 pointer-events-none" />

      <Navigation />
      <LanguageSelector />

      <main className="container mx-auto px-4 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-16 text-center"
        >
          <h1 className="text-6xl font-extrabold mb-6 text-pretty tracking-tight">
            {language === "en" ? "Welcome to Our Blog" : "Chào mừng đến Blog của chúng tôi"}
          </h1>
          <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
            {language === "en"
              ? "Discover insightful articles and stories from our expert writers."
              : "Khám phá các bài viết và câu chuyện sâu sắc từ các chuyên gia của chúng tôi."}
          </p>
        </motion.div>

        <BlogListing searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </main>
    </div>
  )
}
