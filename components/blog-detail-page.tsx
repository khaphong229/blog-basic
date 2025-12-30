"use client"

import { useLanguage } from "@/context/language-context"
import { useBlog } from "@/context/blog-context"
import { useState, useEffect } from "react"
import Navigation from "./navigation"
import BlogPostDetail from "./blog-post-detail"
import CommentsSection from "./comments-section"

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
        <main className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
            <p className="text-muted-foreground">The blog post you're looking for doesn't exist.</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      <main className="container mx-auto px-4 py-12">
        <BlogPostDetail post={post} />
        <CommentsSection post={post} />
      </main>
    </div>
  )
}
