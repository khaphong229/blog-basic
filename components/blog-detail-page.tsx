"use client"

import { useLanguage } from "@/context/language-context"
import { useBlog } from "@/context/blog-context"
import { useState, useEffect } from "react"
import Navigation from "./navigation"
import BlogPostDetail from "./blog-post-detail"
import CommentsSection from "./comments-section"
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
      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        <main className="container mx-auto px-4 py-24">
          <div className="max-w-md mx-auto text-center">
            <FileQuestion className="w-16 h-16 mx-auto mb-6 text-muted-foreground/40" />
            <h1 className="text-3xl font-bold mb-4 font-serif">
              {language === "en" ? "Post Not Found" : "Không tìm thấy bài viết"}
            </h1>
            <p className="text-muted-foreground mb-8">
              {language === "en" 
                ? "The blog post you're looking for doesn't exist or has been removed."
                : "Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa."}
            </p>
            <Link href="/">
              <Button className="cursor-pointer">{language === "en" ? "Back to Home" : "Về trang chủ"}</Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      {/* Main content with consistent vertical rhythm */}
      <main className="container mx-auto px-4 pt-8 pb-24 md:pt-12 md:pb-32">
        <BlogPostDetail post={post} />
        <CommentsSection post={post} />
      </main>
    </div>
  )
}
