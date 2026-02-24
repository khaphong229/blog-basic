"use client"

import { useLanguage } from "@/context/language-context"
import { useBlog } from "@/context/blog-context"
import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Mail } from "lucide-react"
import Link from "next/link"

import BlogListing from "./blog-listing"
import Navigation from "./navigation"
import Footer from "./footer"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"

/**
 * Home page — Chameleon.io blog inspired layout.
 * Hero: 2-column (blog title + newsletter | featured post)
 * Then: category bar + blog grid + footer
 */
export default function HomePage() {
  const { language } = useLanguage()
  const { searchPosts } = useBlog()
  const [searchQuery, setSearchQuery] = useState("")
  const [email, setEmail] = useState("")

  /** Get the latest post for the featured card */
  const featuredPost = useMemo(() => {
    const posts = searchPosts("", language)
    return posts.length > 0 ? posts[0] : null
  }, [language, searchPosts])

  /** Calculate reading time from post content */
  const getReadingTime = (content: string): number => {
    const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length
    return Math.max(1, Math.ceil(words / 200))
  }

  /** Handle newsletter subscribe (placeholder) */
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Integrate with email service
    setEmail("")
  }

  return (
    <div className="bg-background text-foreground relative min-h-screen">
      <Navigation />

      <main className="pt-20">
        {/* ═══════════════════════════════════════════════════════
            HERO SECTION — Dual column: Title + Newsletter | Featured Post
           ═══════════════════════════════════════════════════════ */}
        <section className="container mx-auto px-4 pt-12 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left Column — Blog Title + Newsletter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6 leading-[1.1]">
                {language === "en" ? "The DevBlog" : "DevBlog"}
              </h1>

              <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-md">
                {language === "en"
                  ? "Your hub for all things tech. Join our newsletter for weekly insights and tutorials."
                  : "Trung tâm chia sẻ kiến thức công nghệ. Đăng ký nhận bản tin hàng tuần."}
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
              >
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="group block bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  {/* Featured Image */}
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
                      <span className="font-serif text-4xl text-primary/30 font-bold">D</span>
                    </div>
                  )}

                  {/* Content */}
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
        </section>

        {/* ═══════════════════════════════════════════════════════
            BLOG LISTING SECTION — Category bar + Grid
           ═══════════════════════════════════════════════════════ */}
        <section className="bg-muted/30">
          <div className="container mx-auto px-4 py-16">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-2xl font-bold whitespace-nowrap">
                {language === "en" ? "Latest Posts" : "Bài viết mới nhất"}
              </h2>
              <div className="flex-1 h-px bg-border" />
            </div>

            <BlogListing searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
