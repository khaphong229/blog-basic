"use client"

import type { BlogPost } from "@/context/blog-context"
import { useLanguage } from "@/context/language-context"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, Calendar, User, Share2 } from "lucide-react"
import UrlShortener from "./url-shortener"
import { Badge } from "@/components/ui/badge"

interface BlogPostDetailProps {
  post: BlogPost
}

export default function BlogPostDetail({ post }: BlogPostDetailProps) {
  const { language, t } = useLanguage()

  // Calculate reading time (rough estimate: 200 words per minute)
  const wordCount = post.content.replace(/<[^>]*>/g, "").split(/\s+/).length
  const readingTime = Math.max(1, Math.ceil(wordCount / 200))

  const formattedDate = post.createdAt.toLocaleDateString(language === "en" ? "en-US" : "vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <article className="mx-auto max-w-4xl px-4 py-8">
      {/* Back navigation */}
      <nav className="mb-12">
        <Link
          href="/"
          className="text-muted-foreground hover:text-primary group hover:bg-muted/50 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          {language === "en" ? "Back to articles" : "Quay lại danh sách"}
        </Link>
      </nav>

      {/* Header section */}
      <header className="mx-auto mb-12 max-w-3xl text-center">
        {/* Tags */}
        <div className="mb-6 flex flex-wrap justify-center gap-2">
          {post.tags.slice(0, 3).map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              #{tag}
            </Badge>
          ))}
        </div>

        {/* Title */}
        <h1 className="from-foreground to-foreground/70 mb-8 bg-gradient-to-br bg-clip-text text-4xl leading-tight font-bold tracking-tight text-balance text-transparent md:text-5xl lg:text-6xl">
          {post.title}
        </h1>

        {/* Meta info */}
        <div className="text-muted-foreground border-border/50 flex flex-wrap items-center justify-center gap-6 border-y py-6 text-sm">
          <div className="flex items-center gap-3">
            <div className="from-primary/20 to-secondary/20 text-primary flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold shadow-sm">
              {post.author.charAt(0).toUpperCase()}
            </div>
            <div className="text-left">
              <p className="text-foreground font-semibold">{post.author}</p>
              <p className="text-xs">{language === "en" ? "Author" : "Tác giả"}</p>
            </div>
          </div>

          <div className="bg-border/50 hidden h-8 w-px sm:block" />

          <div className="flex items-center gap-2">
            <Calendar className="text-primary/70 h-4 w-4" />
            <span>{formattedDate}</span>
          </div>

          <div className="bg-border/50 hidden h-8 w-px sm:block" />

          <div className="flex items-center gap-2">
            <Clock className="text-primary/70 h-4 w-4" />
            <span>
              {readingTime} {language === "en" ? "min read" : "phút đọc"}
            </span>
          </div>
        </div>
      </header>

      {/* Article content */}
      <div className="prose prose-lg dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground prose-p:leading-relaxed prose-p:text-muted-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl prose-img:shadow-lg prose-blockquote:border-l-primary prose-blockquote:bg-muted/30 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-code:bg-muted/50 prose-code:text-primary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none mx-auto max-w-3xl">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>

      {/* Footer actions */}
      <footer className="border-border/50 mx-auto mt-20 max-w-3xl border-t pt-10">
        <div className="bg-muted/20 border-border/50 rounded-2xl border p-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold">
                <Share2 className="text-primary h-4 w-4" />
                {language === "en" ? "Share this article" : "Chia sẻ bài viết"}
              </h3>
              <p className="text-muted-foreground text-sm">
                {language === "en"
                  ? "Spread the knowledge with your friends"
                  : "Lan tỏa kiến thức đến bạn bè của bạn"}
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full hover:border-[#1DA1F2]/20 hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2]"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full hover:border-[#1877F2]/20 hover:bg-[#1877F2]/10 hover:text-[#1877F2]"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full hover:border-[#0A66C2]/20 hover:bg-[#0A66C2]/10 hover:text-[#0A66C2]"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </Button>
            </div>
          </div>

          <div className="border-border/50 mt-8 border-t pt-6">
            <UrlShortener post={post} />
          </div>
        </div>
      </footer>
    </article>
  )
}
