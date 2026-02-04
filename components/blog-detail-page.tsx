"use client"

import { useLanguage } from "@/context/language-context"
import { useBlog } from "@/context/blog-context"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Terminal, AlertTriangle } from "lucide-react"
import Link from "next/link"

import Navigation from "./navigation"
import BlogPostDetail from "./blog-post-detail"
import CommentsSection from "./comments-section"
import AnimatedGradientBackdrop from "./animated-gradient-backdrop"
import { Button } from "@/components/ui/button"

interface BlogDetailPageProps {
  slug: string
}

export default function BlogDetailPage({ slug }: BlogDetailPageProps) {
  const { language } = useLanguage()
  const { getPostBySlug } = useBlog()
  const [post, setPost] = useState(getPostBySlug(slug))

  useEffect(() => {
    setPost(getPostBySlug(slug))
  }, [slug, getPostBySlug])

  if (!post) {
    return (
      <div className="bg-background text-foreground relative min-h-screen overflow-hidden">
        <AnimatedGradientBackdrop showMatrix={false} showGrid={true} showScanlines={true} />
        <Navigation />
        <main className="relative z-10 container mx-auto px-4 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-lg"
          >
            {/* Terminal error window */}
            <div className="border-destructive/50 bg-card/80 border backdrop-blur-sm">
              {/* Header */}
              <div className="border-destructive/30 bg-destructive/10 flex items-center gap-2 border-b px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <div className="bg-destructive h-3 w-3 rounded-full" />
                  <div className="bg-accent/60 h-3 w-3 rounded-full" />
                  <div className="bg-primary/60 h-3 w-3 rounded-full" />
                </div>
                <div className="flex-1 text-center">
                  <span className="text-destructive font-mono text-xs">error — 404</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 text-center">
                <AlertTriangle className="text-destructive/60 mx-auto mb-4 h-12 w-12" />

                <div className="text-muted-foreground mb-2 font-mono text-sm">
                  <span className="text-destructive">[ERROR]</span> File not found
                </div>

                <h1 className="text-foreground mb-4 font-mono text-xl font-bold">
                  {language === "en" ? "Post Not Found" : "Không tìm thấy bài viết"}
                </h1>

                <p className="text-muted-foreground mb-6 font-mono text-sm">
                  <span className="text-primary">$</span> cat {slug}.md
                  <br />
                  <span className="text-destructive">cat: {slug}.md: No such file</span>
                </p>

                <Link href="/">
                  <Button variant="terminal">{language === "en" ? "cd ~" : "về trang chủ"}</Button>
                </Link>
              </div>

              {/* Footer */}
              <div className="border-border bg-muted/20 border-t px-4 py-3">
                <div className="text-muted-foreground flex items-center gap-2 font-mono text-xs">
                  <Terminal className="h-3.5 w-3.5" />
                  <span className="text-primary">$</span>
                  <span className="animate-pulse">_</span>
                </div>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    )
  }

  return (
    <div className="bg-background text-foreground relative min-h-screen overflow-hidden">
      <AnimatedGradientBackdrop showMatrix={false} showGrid={true} showScanlines={true} />
      <Navigation />

      {/* Main content */}
      <main className="relative z-10 container mx-auto px-4 pt-24 pb-16">
        <BlogPostDetail post={post} />

        {/* Comments section wrapper */}
        <div className="mx-auto mt-12 max-w-4xl">
          <CommentsSection post={post} />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-border bg-card/50 relative z-10 border-t py-6 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-muted-foreground flex items-center justify-center gap-2 font-mono text-xs">
            <Terminal className="h-3.5 w-3.5" />
            <span className="text-primary">$</span>
            <span>echo &quot;© 2024 Terminal Blog&quot;</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
