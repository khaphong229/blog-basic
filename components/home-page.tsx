"use client"

import { useLanguage } from "@/context/language-context"
import { useBlog } from "@/context/blog-context"
import { useState, useMemo, useEffect, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { ArrowRight, Mail, FileText, Eye, Tag as TagIcon } from "lucide-react"
import Link from "next/link"

import BlogListing from "./blog-listing"
import Navigation from "./navigation"
import Footer from "./footer"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"

function AnimatedCounter({ target, duration = 2000, suffix = "" }: { target: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  useEffect(() => {
    if (!isInView) return
    let start = 0
    const increment = target / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [isInView, target, duration])

  return <span ref={ref}>{count}{suffix}</span>
}

export default function HomePage() {
  const { language } = useLanguage()
  const { searchPosts, getAllTags, posts } = useBlog()
  const [searchQuery, setSearchQuery] = useState("")
  const [email, setEmail] = useState("")

  const featuredPost = useMemo(() => {
    const pagePosts = searchPosts("", language)
    return pagePosts.length > 0 ? pagePosts[0] : null
  }, [language, searchPosts])

  const getReadingTime = (content: string): number => {
    const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length
    return Math.max(1, Math.ceil(words / 200))
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    setEmail("")
  }

  const totalPosts = posts.filter(p => p.status === "published").length
  const totalTags = getAllTags(language).length

  const stats = [
    { label: language === "en" ? "Published Posts" : "Bài đã đăng", value: totalPosts, icon: FileText, suffix: "" },
    { label: language === "en" ? "Topics" : "Chủ đề", value: totalTags, icon: TagIcon, suffix: "" },
    { label: language === "en" ? "Online" : "Trực tuyến", value: 1, icon: Eye, suffix: "K+" },
  ]

  return (
    <div className="bg-background text-foreground relative min-h-screen">
      <Navigation />

      <main>
        {/* ═══════════════════════════════════════════════════════
            HERO SECTION
           ═══════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden">
          {/* Subtle gradient background */}
          <div className="absolute inset-0 bg-linear-to-br from-primary/3 via-background to-accent/3" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

          <div className="container mx-auto px-4 pt-24 pb-12 relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

              {/* Left Column — Blog Title + Newsletter */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                  </span>
                  <span className="text-xs font-medium text-primary">
                    {language === "en" ? "Safe APK Downloads" : "Tải APK An Toàn"}
                  </span>
                </motion.div>

                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6 leading-[1.1]">
                  APKute
                </h1>

                <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-md">
                  {language === "en"
                    ? "Discover & download the best Android apps. Safe APK links, honest reviews."
                    : "Khám phá & tải ứng dụng Android hay nhất. Link APK an toàn, review chân thực."}
                </p>

                {/* Newsletter Subscribe Form */}
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md mb-3">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder={language === "en" ? "Enter your email address" : "Nhập email của bạn"}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-11 rounded-lg border-border bg-background"
                      required
                    />
                  </div>
                  <Button type="submit" className="h-11 px-6 rounded-lg font-semibold shadow-sm">
                    {language === "en" ? "Subscribe" : "Đăng ký"}
                  </Button>
                </form>
                <p className="text-xs text-muted-foreground/70">
                  {language === "en"
                    ? "We use your email to send you new blog posts and product updates."
                    : "Email chỉ dùng để gửi bài viết mới và cập nhật sản phẩm."}
                </p>
              </motion.div>

              {/* Right Column — Featured Post Card */}
              {featuredPost && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                  whileHover={{ scale: 1.01 }}
                >
                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="group block bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300"
                  >
                    {featuredPost.featuredImage ? (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={featuredPost.featuredImage}
                          alt={featuredPost.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-linear-to-br from-primary/10 via-primary/5 to-accent flex items-center justify-center">
                        <span className="font-serif text-4xl text-primary/30 font-bold">A</span>
                      </div>
                    )}

                    <div className="p-6">
                      <h3 className="text-xl font-bold leading-snug tracking-tight text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {featuredPost.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4">
                        {featuredPost.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {featuredPost.tags?.[0] && (
                            <Badge variant="secondary" className="rounded-full text-xs px-3 font-normal">
                              {featuredPost.tags[0]}
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {getReadingTime(featuredPost.content)} {language === "en" ? "min read" : "phút đọc"}
                          </span>
                        </div>
                        <div className="flex items-center text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                          {language === "en" ? "Read" : "Đọc"}
                          <ArrowRight className="ml-1 h-3.5 w-3.5" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )}
            </div>

            {/* Stats Bar — animated counters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-12 grid grid-cols-3 gap-4 sm:gap-6"
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.4 }}
                  className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 sm:p-5 text-center hover:bg-card/80 hover:border-border transition-all duration-300"
                >
                  <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                  <div className="text-2xl sm:text-3xl font-bold text-foreground font-mono tabular-nums">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            BLOG LISTING SECTION — Category bar + Grid
           ═══════════════════════════════════════════════════════ */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="bg-muted/30"
        >
          <div className="container mx-auto px-4 py-16">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-2xl font-bold whitespace-nowrap">
                {language === "en" ? "Latest Posts" : "Bài viết mới nhất"}
              </h2>
              <div className="flex-1 h-px bg-border" />
            </div>

            <BlogListing searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  )
}
