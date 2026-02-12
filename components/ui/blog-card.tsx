"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Calendar, User, Clock } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { BlogPost } from "@/context/blog-context"

interface BlogCardProps {
  post: BlogPost
  language: "en" | "vi"
  index?: number
}

export function BlogCard({ post, language, index = 0 }: BlogCardProps) {
  // Random gradient for posts without image
  const gradients = [
    "from-indigo-500/10 via-purple-500/10 to-pink-500/10",
    "from-blue-500/10 via-cyan-500/10 to-teal-500/10",
    "from-orange-500/10 via-amber-500/10 to-yellow-500/10",
    "from-emerald-500/10 via-green-500/10 to-lime-500/10",
  ]
  const randomGradient = gradients[index % gradients.length]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="h-full"
    >
      <Link href={`/blog/${post.slug}`} className="group flex h-full flex-col bg-card rounded-2xl border border-border overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">

        {/* Featured Image or Gradient Placeholder */}
        <div className={cn("relative aspect-video w-full overflow-hidden bg-linear-to-br", post.featuredImage ? "" : randomGradient)}>
          {post.featuredImage ? (
            <img
              src={post.featuredImage}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center pt-8 px-6">
              <div className="w-full h-full opacity-30 bg-grid-pattern transform rotate-12 scale-150"></div>
            </div>
          )}

          <div className="absolute top-4 right-4">
            <Badge variant="secondary" className="backdrop-blur-md bg-background/80 hover:bg-background border-transparent">
              {post.tags[0] || "Blog"}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-6">
          {/* Meta info */}
          <div className="mb-3 flex items-center gap-3 text-xs text-muted-foreground font-medium">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <time dateTime={post.createdAt.toISOString()}>
                {post.createdAt.toLocaleDateString(language === "en" ? "en-US" : "vi-VN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </time>
            </div>
            <div className="h-1 w-1 rounded-full bg-border" />
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>5 min read</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="mb-3 text-xl font-bold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary line-clamp-2">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="mb-6 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
            {post.excerpt}
          </p>

          {/* Footer */}
          <div className="mt-auto flex items-center justify-between border-t border-border/50 pt-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                {post.author.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-medium text-foreground">{post.author}</span>
            </div>

            <div className="flex items-center text-xs font-semibold text-primary opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
              {language === "en" ? "Read Article" : "Đọc tiếp"}
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
