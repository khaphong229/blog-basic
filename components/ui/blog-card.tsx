"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Calendar, User, Terminal, FileCode } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { BlogPost } from "@/context/blog-context"

interface BlogCardProps {
  post: BlogPost
  language: "en" | "vi"
  index?: number
}

export function BlogCard({ post, language, index = 0 }: BlogCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link href={`/blog/${post.slug}`} className="group block h-full">
        <article className="border-border bg-card/80 hover:border-primary/50 flex h-full flex-col border backdrop-blur-sm transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,136,0.1)]">
          {/* Terminal window header */}
          <div className="border-border bg-muted/30 flex items-center gap-2 border-b px-4 py-2">
            <div className="flex items-center gap-1.5">
              <div className="bg-destructive/60 group-hover:bg-destructive h-2.5 w-2.5 rounded-full transition-colors" />
              <div className="bg-accent/60 group-hover:bg-accent h-2.5 w-2.5 rounded-full transition-colors" />
              <div className="bg-primary/60 group-hover:bg-primary h-2.5 w-2.5 rounded-full transition-colors" />
            </div>
            <div className="flex flex-1 items-center justify-center gap-2">
              <FileCode className="text-muted-foreground h-3 w-3" />
              <span className="text-muted-foreground max-w-[200px] truncate font-mono text-xs">
                {post.slug}.md
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col p-4">
            {/* Meta info */}
            <div className="text-muted-foreground mb-3 flex items-center gap-4 font-mono text-xs">
              <div className="flex items-center gap-1.5">
                <Calendar className="text-primary/70 h-3 w-3" />
                <time dateTime={post.createdAt.toISOString()}>
                  {post.createdAt.toLocaleDateString(language === "en" ? "en-US" : "vi-VN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </time>
              </div>
              <div className="flex items-center gap-1.5">
                <User className="text-secondary/70 h-3 w-3" />
                <span>{post.author}</span>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-foreground group-hover:text-primary mb-3 line-clamp-2 font-mono text-lg font-semibold transition-colors">
              <span className="text-primary/70 mr-1">&gt;</span>
              {post.title}
            </h3>

            {/* Excerpt */}
            <p className="text-muted-foreground mb-4 line-clamp-3 flex-1 font-mono text-sm leading-relaxed">
              <span className="text-muted-foreground/50">// </span>
              {post.excerpt}
            </p>

            {/* Tags */}
            <div className="mb-4 flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-[10px]">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="border-border bg-muted/20 border-t px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground flex items-center gap-2 font-mono text-xs">
                <Terminal className="h-3 w-3" />
                <span>
                  {language === "en" ? "cat" : "đọc"} {post.slug}
                </span>
              </div>
              <span className="text-primary flex items-center gap-1 font-mono text-xs transition-all group-hover:gap-2">
                <span className="hidden sm:inline">{language === "en" ? "read" : "xem"}</span>
                <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  )
}
