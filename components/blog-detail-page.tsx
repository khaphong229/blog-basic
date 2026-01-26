"use client"

import { useLanguage } from "@/context/language-context"
import { useBlog } from "@/context/blog-context"
import { useState, useEffect } from "react"
import Navigation from "./navigation"
import BlogPostDetail from "./blog-post-detail"
import CommentsSection from "./comments-section"
import AnimatedGradientBackdrop from "./animated-gradient-backdrop"
import { FileQuestion } from "lucide-react"
import Link from "next/link"
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
        <AnimatedGradientBackdrop />
        <Navigation />
        <main className="relative z-10 container mx-auto px-4 py-24">
          <div className="mx-auto max-w-md text-center">
            <div className="bg-muted/50 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full">
              <FileQuestion className="text-muted-foreground/40 h-10 w-10" />
            </div>
            <h1 className="mb-4 text-3xl font-bold">
              {language === "en" ? "Post Not Found" : "Không tìm thấy bài viết"}
            </h1>
            <p className="text-muted-foreground mb-8">
              {language === "en"
                ? "The blog post you're looking for doesn't exist or has been removed."
                : "Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa."}
            </p>
            <Link href="/">
              <Button className="rounded-xl px-6">
                {language === "en" ? "Back to Home" : "Về trang chủ"}
              </Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="bg-background text-foreground relative min-h-screen overflow-hidden">
      {/* Subtle background effect */}
      <AnimatedGradientBackdrop />

      <Navigation />

      {/* Main content */}
      <main className="relative z-10 pt-8 pb-24 md:pt-12 md:pb-32">
        <BlogPostDetail post={post} />
        <CommentsSection post={post} />
      </main>
    </div>
  )
}
