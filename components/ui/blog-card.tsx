"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Clock, ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"
import type { BlogPost } from "@/context/blog-context"

/**
 * Category-to-color mapping for blog post badges.
 * Each category gets a unique color scheme for visual distinction.
 */
const CATEGORY_COLORS: Record<string, string> = {
  // Vietnamese
  "Phát triển Web": "text-blue-700 bg-blue-50 dark:text-blue-300 dark:bg-blue-950/50",
  "JavaScript": "text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-950/50",
  "React": "text-cyan-700 bg-cyan-50 dark:text-cyan-300 dark:bg-cyan-950/50",
  "TypeScript": "text-blue-700 bg-blue-50 dark:text-blue-300 dark:bg-blue-950/50",
  "Next.js": "text-gray-700 bg-gray-100 dark:text-gray-300 dark:bg-gray-800/50",
  "Node.js": "text-green-700 bg-green-50 dark:text-green-300 dark:bg-green-950/50",
  "DevOps": "text-violet-700 bg-violet-50 dark:text-violet-300 dark:bg-violet-950/50",
  "AI": "text-rose-700 bg-rose-50 dark:text-rose-300 dark:bg-rose-950/50",
  "Database": "text-orange-700 bg-orange-50 dark:text-orange-300 dark:bg-orange-950/50",
  "Tutorial": "text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950/50",
  "Tips": "text-pink-700 bg-pink-50 dark:text-pink-300 dark:bg-pink-950/50",
  "Hệ thống": "text-indigo-700 bg-indigo-50 dark:text-indigo-300 dark:bg-indigo-950/50",
  // English
  "Web Development": "text-blue-700 bg-blue-50 dark:text-blue-300 dark:bg-blue-950/50",
  "System Design": "text-indigo-700 bg-indigo-50 dark:text-indigo-300 dark:bg-indigo-950/50",
  "Frontend": "text-cyan-700 bg-cyan-50 dark:text-cyan-300 dark:bg-cyan-950/50",
  "Backend": "text-green-700 bg-green-50 dark:text-green-300 dark:bg-green-950/50",
  "Performance": "text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-950/50",
}

/** Default fallback color for unknown categories */
const DEFAULT_CATEGORY_COLOR = "text-primary bg-primary/10"

interface BlogCardProps {
  post: BlogPost
  language: "en" | "vi"
  index?: number
}

/**
 * Blog post card — Chameleon.io inspired design.
 * Features: featured image, color-coded category badge, real read time, author info.
 */
export function BlogCard({ post, language, index = 0 }: BlogCardProps) {
  /** Calculate reading time from post content (approx 200 words/min) */
  const wordCount = post.content.replace(/<[^>]*>/g, "").split(/\s+/).length
  const readingTime = Math.max(1, Math.ceil(wordCount / 200))

  /** Get color class for a category tag */
  const getCategoryColor = (tag: string): string => {
    return CATEGORY_COLORS[tag] || DEFAULT_CATEGORY_COLOR
  }

  /** Gradient fallback for posts without featured image */
  const gradients = [
    "from-green-500/10 via-emerald-500/5 to-teal-500/10",
    "from-blue-500/10 via-indigo-500/5 to-violet-500/10",
    "from-amber-500/10 via-orange-500/5 to-rose-500/10",
    "from-cyan-500/10 via-sky-500/5 to-blue-500/10",
  ]
  const fallbackGradient = gradients[index % gradients.length]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="h-full"
    >
      <Link
        href={`/blog/${post.slug}`}
        className="group flex h-full flex-col bg-card rounded-2xl border border-border overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      >
        {/* Featured Image or Gradient Placeholder */}
        <div className={cn(
          "relative aspect-16/10 w-full overflow-hidden",
          !post.featuredImage && `bg-linear-to-br ${fallbackGradient}`
        )}>
          {post.featuredImage ? (
            <img
              src={post.featuredImage}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-serif text-5xl text-foreground/10 font-bold select-none">D</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-5">
          {/* Category Badge + Read Time */}
          <div className="mb-3 flex items-center gap-2">
            {post.tags?.[0] && (
              <span className={cn(
                "text-xs font-medium px-2.5 py-0.5 rounded-full",
                getCategoryColor(post.tags[0])
              )}>
                {post.tags[0]}
              </span>
            )}
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {readingTime} {language === "en" ? "min" : "phút"}
            </span>
          </div>

          {/* Title */}
          <h3 className="mb-2 text-lg font-bold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary line-clamp-2">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-2">
            {post.excerpt}
          </p>

          {/* Author + Read More */}
          <div className="mt-auto flex items-center justify-between pt-3 border-t border-border/30">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-primary/15 flex items-center justify-center text-[10px] font-bold text-primary">
                {post.author.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-medium text-muted-foreground">{post.author}</span>
            </div>

            <div className="flex items-center text-xs font-semibold text-primary opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
