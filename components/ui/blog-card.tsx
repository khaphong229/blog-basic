"use client"

import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Calendar, User } from "lucide-react"
import { cn } from "@/lib/utils"
import type { BlogPost } from "@/context/blog-context"

interface BlogCardProps {
  post: BlogPost
  language: "en" | "vi"
}

export function BlogCard({ post, language }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="group h-full block">
      <Card className="h-full flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border-border/60 bg-card hover:border-primary/50 overflow-hidden relative">
        {/* Decorative top accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-primary/40 to-secondary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <CardHeader className="space-y-4 pb-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              <time dateTime={post.createdAt.toISOString()}>
                {post.createdAt.toLocaleDateString(language === "en" ? "en-US" : "vi-VN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
            {/* <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5" />
              <span>{post.author}</span>
            </div> */}
          </div>

          <h3 className="text-2xl font-serif font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2 text-balance">
            {post.title}
          </h3>
        </CardHeader>

        <CardContent className="grow pb-4">
          <p className="text-muted-foreground leading-relaxed line-clamp-3 text-base">
            {post.excerpt}
          </p>
        </CardContent>

        <CardFooter className="pt-0 flex flex-col items-start gap-4">
          <div className="flex flex-wrap gap-2 w-full">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="bg-secondary/10 text-secondary-foreground hover:bg-secondary/20 transition-colors font-normal"
              >
                #{tag}
              </Badge>
            ))}
          </div>
          
          <div className="w-full flex items-center justify-between border-t border-border/40 pt-4 mt-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
               <User className="w-3.5 h-3.5" />
               <span className="font-medium">{post.author}</span>
            </div>
            <span className="text-sm font-semibold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
              {language === "en" ? "Read Article" : "Đọc bài viết"}
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
