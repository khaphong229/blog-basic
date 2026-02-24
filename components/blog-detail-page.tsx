"use client"

import { useLanguage } from "@/context/language-context"
import { useBlog } from "@/context/blog-context"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { AlertTriangle } from "lucide-react"
import Link from "next/link"

import Navigation from "./navigation"
import BlogPostDetail from "./blog-post-detail"
import CommentsSection from "./comments-section"
import Footer from "./footer"
import ReadingProgress from "./reading-progress"
import { Button } from "@/components/ui/button"

/**
 * Blog detail page layout — wraps article content with navigation and footer.
 */
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
      <div className="bg-background text-foreground relative min-h-screen">
        <Navigation />
        <main className="container mx-auto px-4 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-lg"
          >
            {/* Clean error card */}
            <div className="border border-border bg-card rounded-2xl overflow-hidden shadow-sm">
              <div className="p-10 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                  <AlertTriangle className="text-destructive h-8 w-8" />
                </div>

                <h1 className="text-xl font-bold text-foreground mb-2">
                  {language === "en" ? "Post Not Found" : "Không tìm thấy bài viết"}
                </h1>

                <p className="text-muted-foreground text-sm mb-6">
                  {language === "en"
                    ? "The article you're looking for doesn't exist or has been moved."
                    : "Bài viết bạn tìm kiếm không tồn tại hoặc đã bị di chuyển."}
                </p>

                <Link href="/">
                  <Button>
                    {language === "en" ? "← Back to Blog" : "← Về trang chủ"}
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="bg-background text-foreground relative min-h-screen">
      <ReadingProgress />
      <Navigation />

      <main className="container mx-auto px-4 pt-24 pb-16">
        <BlogPostDetail post={post} />

        {/* Comments section */}
        <div className="mx-auto mt-12 max-w-3xl">
          <CommentsSection post={post} />
        </div>
      </main>

      <Footer />
    </div>
  )
}
