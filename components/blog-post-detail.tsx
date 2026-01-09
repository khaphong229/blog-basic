"use client"

import type { BlogPost } from "@/context/blog-context"
import { useLanguage } from "@/context/language-context"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, Calendar } from "lucide-react"
import UrlShortener from "./url-shortener"

interface BlogPostDetailProps {
  post: BlogPost
}

export default function BlogPostDetail({ post }: BlogPostDetailProps) {
  const { language, t } = useLanguage()

  // Calculate reading time (rough estimate: 200 words per minute)
  const wordCount = post.content.replace(/<[^>]*>/g, '').split(/\s+/).length
  const readingTime = Math.max(1, Math.ceil(wordCount / 200))

  const formattedDate = post.createdAt.toLocaleDateString(
    language === "en" ? "en-US" : "vi-VN",
    { year: "numeric", month: "long", day: "numeric" }
  )

  return (
    <article className="max-w-3xl mx-auto">
      {/* Back navigation - subtle, not competing with content */}
      <nav className="mb-8">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          {language === "en" ? "Back to articles" : "Quay lại danh sách"}
        </Link>
      </nav>

      {/* Header section with clear hierarchy */}
      <header className="mb-10">
        {/* Title - largest visual element */}
        <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-bold font-serif tracking-tight text-balance leading-[1.15] mb-6">
          {post.title}
        </h1>

        {/* Author/Meta bar - horizontal layout with visual separation */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          {/* Author with avatar placeholder */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center text-primary font-semibold text-sm">
              {post.author.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-foreground">{post.author}</p>
              <p className="text-xs text-muted-foreground">
                {language === "en" ? "Author" : "Tác giả"}
              </p>
            </div>
          </div>

          {/* Visual separator */}
          <div className="hidden sm:block w-px h-8 bg-border" />

          {/* Published date */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{formattedDate}</span>
          </div>

          {/* Separator dot */}
          <span className="hidden sm:inline text-border">•</span>

          {/* Reading time */}
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>
              {readingTime} {language === "en" ? "min read" : "phút đọc"}
            </span>
          </div>
        </div>

        {/* Updated notice if different from created */}
        {post.updatedAt.getTime() !== post.createdAt.getTime() && (
          <p className="mt-3 text-xs text-muted-foreground/70 italic">
            {language === "en" ? "Last updated" : "Cập nhật lần cuối"}{" "}
            {post.updatedAt.toLocaleDateString(language === "en" ? "en-US" : "vi-VN", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        )}
      </header>

      {/* Article content with optimized reading width */}
      <div className="prose prose-lg dark:prose-invert max-w-[65ch] prose-headings:font-serif prose-headings:tracking-tight prose-p:leading-relaxed prose-p:text-foreground/90 prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>

      {/* Footer actions - clear visual separation */}
      <footer className="mt-16 pt-8 border-t border-border space-y-8">
        {/* URL Shortener */}
        <UrlShortener post={post} />

        {/* Share section */}
        <div className="space-y-4">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            {language === "en" ? "Share this article" : "Chia sẻ bài viết"}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2] hover:border-[#1DA1F2]/30 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              Twitter
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 hover:bg-[#1877F2]/10 hover:text-[#1877F2] hover:border-[#1877F2]/30 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 hover:bg-[#0A66C2]/10 hover:text-[#0A66C2] hover:border-[#0A66C2]/30 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </Button>
          </div>
        </div>
      </footer>
    </article>
  )
}
