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
    month: "short",
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
    <motion.article initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-4xl">
      {/* Back navigation */}
      <nav className="mb-6">
        <Link
          href="/"
          className="text-muted-foreground hover:text-primary group inline-flex items-center gap-2 font-mono text-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span className="text-primary">$</span> cd ..
        </Link>
      </nav>

      {/* Terminal window wrapper */}
      <div className="border-border bg-card/80 border backdrop-blur-sm">
        {/* Terminal header */}
        <div className="border-border bg-muted/30 flex items-center gap-2 border-b px-4 py-3">
          <div className="flex items-center gap-1.5">
            <div className="bg-destructive/80 h-3 w-3 rounded-full" />
            <div className="bg-accent/80 h-3 w-3 rounded-full" />
            <div className="bg-primary/80 h-3 w-3 rounded-full" />
          </div>
          <div className="flex flex-1 items-center justify-center gap-2">
            <FileCode className="text-muted-foreground h-3.5 w-3.5" />
            <span className="text-muted-foreground font-mono text-xs">
              {post.slug}.md — {wordCount} words
            </span>
          </div>
          <button
            onClick={copyToClipboard}
            className="text-muted-foreground hover:text-primary p-1.5 transition-colors"
            title={language === "en" ? "Copy link" : "Sao chép liên kết"}
          >
            {copied ? <Check className="text-primary h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>

        {/* Article content */}
        <div className="p-6 md:p-8">
          {/* Meta info bar */}
          <div className="text-muted-foreground border-border mb-6 flex flex-wrap items-center gap-4 border-b pb-4 font-mono text-xs">
            <div className="flex items-center gap-2">
              <User className="text-secondary h-3.5 w-3.5" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="text-primary h-3.5 w-3.5" />
              <time dateTime={post.createdAt.toISOString()}>{formattedDate}</time>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="text-accent h-3.5 w-3.5" />
              <span>
                {readingTime} {language === "en" ? "min read" : "phút đọc"}
              </span>
            </div>
            {post.updatedAt.getTime() !== post.createdAt.getTime() && (
              <div className="text-muted-foreground/60">
                <span className="text-secondary/70">//</span>{" "}
                {language === "en" ? "updated" : "cập nhật"}{" "}
                {post.updatedAt.toLocaleDateString(language === "en" ? "en-US" : "vi-VN", {
                  month: "short",
                  day: "numeric",
                })}
              </div>
            )}
          </div>

          {/* Title */}
          <header className="mb-8">
            <h1 className="text-foreground mb-4 font-mono text-2xl leading-tight font-bold md:text-3xl lg:text-4xl">
              <span className="text-primary">&gt;</span> {post.title}
            </h1>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
          </header>

          {/* Article body */}
          <div className="prose prose-invert prose-headings:font-mono prose-headings:font-semibold prose-headings:text-foreground prose-h2:text-xl prose-h2:border-b prose-h2:border-border prose-h2:pb-2 prose-h2:mt-8 prose-h3:text-lg prose-h3:text-primary/90 prose-p:font-mono prose-p:text-sm prose-p:leading-relaxed prose-p:text-foreground/80 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:text-primary prose-code:text-xs prose-code:before:content-none prose-code:after:content-none prose-pre:bg-muted/50 prose-pre:border prose-pre:border-border prose-pre:text-xs prose-blockquote:border-l-primary prose-blockquote:bg-muted/30 prose-blockquote:py-1 prose-blockquote:text-muted-foreground prose-blockquote:font-mono prose-blockquote:text-sm prose-ul:font-mono prose-ul:text-sm prose-ol:font-mono prose-ol:text-sm prose-li:marker:text-primary prose-strong:text-foreground prose-strong:font-semibold prose-img:border prose-img:border-border max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        </div>

        {/* Footer */}
        <footer className="border-border bg-muted/20 space-y-8 border-t p-6 md:p-8">
          {/* URL Shortener */}
          <UrlShortener post={post} />

          {/* Share section */}
          <div className="space-y-4">
            <div className="text-muted-foreground flex items-center gap-2 font-mono text-xs">
              <Share2 className="text-primary h-3.5 w-3.5" />
              <span>{language === "en" ? "share --post" : "chia-sẻ --bài-viết"}</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 font-mono text-xs"
                onClick={() =>
                  window.open(
                    `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`,
                    "_blank"
                  )
                }
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Twitter
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 font-mono text-xs"
                onClick={() =>
                  window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
                    "_blank"
                  )
                }
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 font-mono text-xs"
                onClick={() =>
                  window.open(
                    `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(post.title)}`,
                    "_blank"
                  )
                }
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
              </Button>
            </div>
          </div>

          {/* Command line footer */}
          <div className="border-border border-t pt-4">
            <div className="text-muted-foreground flex items-center gap-2 font-mono text-xs">
              <Terminal className="h-3.5 w-3.5" />
              <span className="text-primary">$</span>
              <span className="animate-pulse">_</span>
            </div>
          </div>
        </footer>
      </div>
    </motion.article>
  )
}
