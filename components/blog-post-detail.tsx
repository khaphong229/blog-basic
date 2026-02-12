"use client"

import type { BlogPost } from "@/context/blog-context"
import { useLanguage } from "@/context/language-context"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Clock,
  Calendar,
  User,
  Terminal,
  FileCode,
  Share2,
  Copy,
  Check,
} from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import UrlShortener from "./url-shortener"

interface BlogPostDetailProps {
  post: BlogPost
}

export default function BlogPostDetail({ post }: BlogPostDetailProps) {
  const { language, t } = useLanguage()
  const [copied, setCopied] = useState(false)

  // Calculate reading time (rough estimate: 200 words per minute)
  const wordCount = post.content.replace(/<[^>]*>/g, "").split(/\s+/).length
  const readingTime = Math.max(1, Math.ceil(wordCount / 200))

  const formattedDate = post.createdAt.toLocaleDateString(language === "en" ? "en-US" : "vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-3xl px-4 py-8"
    >
      {/* Back navigation */}
      <nav className="mb-8">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {language === "en" ? "Back to blog" : "Trở lại danh sách"}
        </Link>
      </nav>

      {/* Header */}
      <header className="mb-10 text-center">
        {post.tags && post.tags.length > 0 && (
          <div className="flex justify-center flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="rounded-full px-3 py-1 font-normal text-sm hover:bg-secondary/80">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-6 leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center justify-center gap-4 text-muted-foreground text-sm flex-wrap">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xs">
              {post.author.charAt(0).toUpperCase()}
            </div>
            <span className="font-medium text-foreground">{post.author}</span>
          </div>
          <div className="h-1 w-1 rounded-full bg-border" />
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <time dateTime={post.createdAt.toISOString()}>{formattedDate}</time>
          </div>
          <div className="h-1 w-1 rounded-full bg-border" />
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span>{readingTime} {language === "en" ? "min read" : "phút đọc"}</span>
          </div>
        </div>
      </header>

      {/* Featured Image (if available) - Optional if we want to display it in detail */}
      {post.featuredImage && (
        <div className="mb-10 rounded-2xl overflow-hidden shadow-md">
          <img src={post.featuredImage} alt={post.title} className="w-full h-auto object-cover" />
        </div>
      )}

      {/* Article content */}
      <div className="prose prose-lg dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-sm max-w-none">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>

      {/* Footer / Share */}
      <footer className="mt-16 pt-8 border-t border-border">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground font-medium">
            {language === "en" ? "Share this article" : "Chia sẻ bài viết này"}
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full gap-2"
              onClick={copyToClipboard}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? (language === "en" ? "Copied" : "Đã sao chép") : (language === "en" ? "Copy Link" : "Sao chép Link")}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`, "_blank")}
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, "_blank")}
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
            </Button>
          </div>
        </div>
      </footer>
    </motion.article>
  )
}
