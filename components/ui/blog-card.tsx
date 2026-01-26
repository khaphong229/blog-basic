"use client"

import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Calendar, User, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import type { BlogPost } from "@/context/blog-context"

interface BlogCardProps {
  post: BlogPost
  language: "en" | "vi"
}

export function BlogCard({ post, language }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <Card className="hover:shadow-soft border-border/50 bg-card/50 hover:border-primary/30 group-hover:bg-card relative flex h-full flex-col overflow-hidden rounded-2xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-1">
        {/* Modern gradient glow effect on hover */}
        <div className="from-primary/5 to-secondary/5 pointer-events-none absolute inset-0 bg-gradient-to-br via-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <CardHeader className="relative z-10 space-y-4 pb-3">
          <div className="flex items-center justify-between">
            <Badge
              variant="outline"
              className="bg-primary/5 text-primary border-primary/20 hover:bg-primary/10 flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors"
            >
              <BookOpen className="h-3 w-3" />
              <span>{language === "en" ? "Article" : "Bài viết"}</span>
            </Badge>

            <div className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
              <Calendar className="h-3.5 w-3.5" />
              <time dateTime={post.createdAt.toISOString()}>
                {post.createdAt.toLocaleDateString(language === "en" ? "en-US" : "vi-VN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </time>
            </div>
          </div>

          <h3 className="group-hover:text-primary font-display line-clamp-2 text-xl leading-tight font-bold tracking-tight text-balance transition-colors md:text-2xl">
            {post.title}
          </h3>
        </CardHeader>

        <CardContent className="relative z-10 grow pb-4">
          <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed md:text-base">
            {post.excerpt}
          </p>
        </CardContent>

        <CardFooter className="relative z-10 mt-auto flex flex-col items-start gap-5 pt-0">
          <div className="flex w-full flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-muted-foreground bg-muted/50 border-border/50 rounded-md border px-2 py-1 text-xs font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="border-border/60 flex w-full items-center justify-between border-t border-dashed pt-4">
            <div className="text-muted-foreground/80 flex items-center gap-2 text-xs font-medium">
              <div className="from-primary/20 to-secondary/20 text-primary flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br text-[10px] font-bold">
                {post.author.charAt(0)}
              </div>
              <span>{post.author}</span>
            </div>
            <span className="text-primary bg-primary/5 group-hover:bg-primary group-hover:text-primary-foreground flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold transition-all duration-300">
              {language === "en" ? "Read more" : "Xem thêm"}
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
