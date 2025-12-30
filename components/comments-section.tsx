"use client"

import type React from "react"

import type { BlogPost } from "@/context/blog-context"
import { useLanguage } from "@/context/language-context"
import { useBlog } from "@/context/blog-context"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CommentsSectionProps {
  post: BlogPost
}

export default function CommentsSection({ post }: CommentsSectionProps) {
  const { language, t } = useLanguage()
  const { addComment } = useBlog()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [comment, setComment] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !email.trim() || !comment.trim()) {
      return
    }

    addComment(post.id, {
      name: name.trim(),
      email: email.trim(),
      content: comment.trim(),
    })

    setName("")
    setEmail("")
    setComment("")
    setSubmitted(true)

    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <section className="max-w-3xl mx-auto space-y-8">
      <div className="border-t border-border pt-8">
        <h2 className="text-3xl font-bold mb-8">
          {t("blog.comments")} ({post.comments.length})
        </h2>

        {/* Comments List */}
        <div className="space-y-4 mb-12">
          {post.comments.length === 0 ? (
            <p className="text-muted-foreground">
              {language === "en"
                ? "No comments yet. Be the first to comment!"
                : "Chưa có bình luận nào. Hãy là người đầu tiên bình luận!"}
            </p>
          ) : (
            post.comments.map((c) => (
              <Card key={c.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{c.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {c.createdAt.toLocaleDateString(language === "en" ? "en-US" : "vi-VN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/80">{c.content}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Comment Form */}
        <div className="bg-card/50 rounded-lg p-8 border border-border">
          <h3 className="text-xl font-bold mb-6">{t("blog.leaveComment")}</h3>

          {submitted && (
            <div className="mb-4 p-4 bg-primary/10 border border-primary rounded-lg">
              <p className="text-primary font-semibold">
                {language === "en" ? "Thank you for your comment!" : "Cảm ơn bạn đã bình luận!"}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder={t("blog.yourName")} value={name} onChange={(e) => setName(e.target.value)} required />
              <Input
                type="email"
                placeholder={t("blog.yourEmail")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <Textarea
              placeholder={t("blog.comment")}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              required
            />

            <Button type="submit" className="w-full sm:w-auto">
              {t("blog.submit")}
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}
