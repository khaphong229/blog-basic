"use client"

import { useLanguage } from "@/context/language-context"
import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, BookOpen, Layers, Zap } from "lucide-react"

import BlogListing from "./blog-listing"
import Navigation from "./navigation"
import AnimatedGradientBackdrop from "./animated-gradient-backdrop"
import { Button } from "./ui/button"

export default function HomePage() {
  const { language } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")

  const stats = [
    {
      label: language === "en" ? "Articles" : "Bài viết",
      value: "50+",
      icon: BookOpen,
      desc: language === "en" ? "Technical tutorials" : "Hướng dẫn kỹ thuật"
    },
    {
      label: language === "en" ? "Topics" : "Chủ đề",
      value: "12",
      icon: Layers,
      desc: language === "en" ? "From frontend to system" : "Từ giao diện đến hệ thống"
    },
    {
      label: language === "en" ? "Updates" : "Cập nhật",
      value: "Daily",
      icon: Zap,
      desc: language === "en" ? "Latest tech news" : "Tin tức công nghệ mới"
    },
  ]

  return (
    <div className="bg-background text-foreground relative min-h-screen">
      <AnimatedGradientBackdrop />
      <Navigation />

      <main className="container mx-auto px-4 pt-32 pb-16">
        {/* Hero Section */}
        <section className="mx-auto max-w-3xl text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              {language === "en" ? "Now reading: System Design v2.0" : "Đang đọc: Thiết kế hệ thống v2.0"}
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70">
              {language === "en" ? "Thoughts, Stories & Ideas." : "Suy nghĩ, Câu chuyện & Ý tưởng."}
            </h1>

            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
              {language === "en"
                ? "A curated collection of thoughts on software engineering, design patterns, and the future of technology."
                : "Bộ sưu tập các bài viết về kỹ thuật phần mềm, design patterns và tương lai của công nghệ."}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="rounded-full px-8 h-12 text-base shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                {language === "en" ? "Start Reading" : "Bắt đầu đọc"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" className="rounded-full px-8 h-12 text-base border-border bg-background/50 backdrop-blur-sm hover:bg-background/80">
                {language === "en" ? "Portfolio" : "Hồ sơ năng lực"}
              </Button>
            </div>
          </motion.div>
        </section>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24 mx-auto max-w-5xl"
        >
          {stats.map((stat, index) => (
            <div key={index} className="group relative p-6 bg-card hover:bg-card/80 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-4 mb-3">
                <div className="p-3 bg-primary/10 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground/80 pl-16">
                {stat.desc}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Blog Listing Section */}
        <section className="relative">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-bold">{language === "en" ? "Latest Posts" : "Bài viết mới nhất"}</h2>
            <div className="flex-1 h-px bg-border"></div>
          </div>

          <BlogListing searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </section>
      </main>

      {/* Modern Footer */}
      <footer className="border-t border-border bg-muted/30 mt-auto">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="font-bold text-lg mb-2">DevBlog</h3>
              <p className="text-sm text-muted-foreground">© 2024 Built with Next.js & Tailwind</p>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">GitHub</a>
              <a href="#" className="hover:text-primary transition-colors">Twitter</a>
              <a href="#" className="hover:text-primary transition-colors">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
