"use client"

import type { BlogPost } from "@/context/blog-context"
import { useLanguage } from "@/context/language-context"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import UrlShortener from "./url-shortener"

interface BlogPostDetailProps {
  post: BlogPost
}

export default function BlogPostDetail({ post }: BlogPostDetailProps) {
  const { language, t } = useLanguage()

  return (
    <article className="max-w-3xl mx-auto mb-12">
      <div className="mb-6">
        <Link href="/">
          <Button variant="outline" size="sm">
            ← {language === "en" ? "Back" : "Quay lại"}
          </Button>
        </Link>
      </div>

      <header className="mb-8">
        <h1 className="text-5xl font-bold mb-4 text-pretty">{post.title}</h1>

        <div className="flex flex-col gap-2 text-muted-foreground">
          <p>
            <span className="font-semibold text-foreground">{post.author}</span> {t("blog.by")} •{" "}
            {post.createdAt.toLocaleDateString(language === "en" ? "en-US" : "vi-VN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          {post.updatedAt.getTime() !== post.createdAt.getTime() && (
            <p className="text-sm">
              {language === "en" ? "Updated" : "Cập nhật"}{" "}
              {post.updatedAt.toLocaleDateString(language === "en" ? "en-US" : "vi-VN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}
        </div>
      </header>

      <div className="prose prose-invert max-w-none">
        <p className="text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap">{post.content}</p>
      </div>

      <div className="mt-8 pt-8 border-t border-border">
        <UrlShortener post={post} />
      </div>

      <div className="mt-6">
        <p className="text-sm text-muted-foreground">
          {language === "en" ? "Share this article" : "Chia sẻ bài viết này"}
        </p>
        <div className="flex gap-4 mt-4">
          <Button variant="outline" size="sm">
            Twitter
          </Button>
          <Button variant="outline" size="sm">
            Facebook
          </Button>
          <Button variant="outline" size="sm">
            LinkedIn
          </Button>
        </div>
      </div>
    </article>
  )
}
