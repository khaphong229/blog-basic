"use client"

import type React from "react"
import type { BlogPost } from "@/context/blog-context"
import { useLanguage } from "@/context/language-context"
import { useBlog } from "@/context/blog-context"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MessageCircle, CheckCircle, Loader2, Send, User } from "lucide-react"

interface CommentsSectionProps {
  post: BlogPost
}

export default function CommentsSection({ post }: CommentsSectionProps) {
  const { language, t } = useLanguage()
  const { addComment } = useBlog()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim() || !email.trim() || !comment.trim()) {
      return
    }

    setIsSubmitting(true)

    try {
      await addComment(post.id, {
        name: name.trim(),
        email: email.trim(),
        content: comment.trim(),
      })

      setName("")
      setEmail("")
      setComment("")
      setSubmitted(true)

      setTimeout(() => setSubmitted(false), 3000)
    } catch (err) {
      console.error("Error adding comment:", err)
      setError(
        language === "en"
          ? "Failed to add comment. Please try again."
          : "Không thể thêm bình luận. Vui lòng thử lại."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="mx-auto mt-16 max-w-3xl px-4">
      {/* Section Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
            <MessageCircle className="text-primary h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{t("blog.comments")}</h2>
            <p className="text-muted-foreground text-sm">
              {post.comments.length} {language === "en" ? "responses" : "phản hồi"}
            </p>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="mb-12 space-y-4">
        {post.comments.length === 0 ? (
          <div className="bg-muted/20 border-border/50 rounded-2xl border border-dashed py-16 text-center">
            <div className="bg-muted/50 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <MessageCircle className="text-muted-foreground/40 h-8 w-8" />
            </div>
            <p className="text-muted-foreground font-medium">
              {language === "en" ? "No comments yet" : "Chưa có bình luận nào"}
            </p>
            <p className="text-muted-foreground/70 mt-1 text-sm">
              {language === "en"
                ? "Be the first to share your thoughts!"
                : "Hãy là người đầu tiên chia sẻ!"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {post.comments.map((c) => (
              <article
                key={c.id}
                className="group bg-card/50 hover:bg-card border-border/50 hover:shadow-soft rounded-2xl border p-5 transition-all duration-200"
              >
                <div className="flex gap-4">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="from-secondary/20 to-accent/20 text-secondary flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold">
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    {/* Header */}
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="text-foreground font-semibold">{c.name}</span>
                      <span className="text-muted-foreground bg-muted/50 rounded-full px-2 py-0.5 text-xs">
                        {c.createdAt.toLocaleDateString(language === "en" ? "en-US" : "vi-VN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    {/* Content */}
                    <p className="text-foreground/80 leading-relaxed">{c.content}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Comment Form */}
      <div className="from-muted/30 to-muted/10 border-border/50 rounded-3xl border bg-gradient-to-b p-6 md:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
            <Send className="text-primary h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">{t("blog.leaveComment")}</h3>
            <p className="text-muted-foreground text-sm">
              {language === "en"
                ? "Your email address will not be published."
                : "Email của bạn sẽ không được công khai."}
            </p>
          </div>
        </div>

        {/* Success message */}
        {submitted && (
          <div className="bg-accent/10 border-accent/30 mb-6 flex items-center gap-3 rounded-xl border p-4">
            <div className="bg-accent/20 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full">
              <CheckCircle className="text-accent h-4 w-4" />
            </div>
            <p className="text-accent text-sm font-medium">
              {language === "en" ? "Thank you for your comment!" : "Cảm ơn bạn đã bình luận!"}
            </p>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="bg-destructive/10 border-destructive/30 mb-6 rounded-xl border p-4">
            <p className="text-destructive text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-foreground/80 flex items-center gap-1 text-sm font-medium">
                <User className="h-3.5 w-3.5" />
                {t("blog.yourName")} <span className="text-destructive">*</span>
              </label>
              <Input
                placeholder={language === "en" ? "John Doe" : "Nguyễn Văn A"}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isSubmitting}
                className="bg-background/50 border-border/50 focus-visible:ring-primary/20 focus-visible:border-primary h-11 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-foreground/80 flex items-center gap-1 text-sm font-medium">
                <svg
                  className="h-3.5 w-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                {t("blog.yourEmail")} <span className="text-destructive">*</span>
              </label>
              <Input
                type="email"
                placeholder={language === "en" ? "you@example.com" : "ban@example.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
                className="bg-background/50 border-border/50 focus-visible:ring-primary/20 focus-visible:border-primary h-11 rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-foreground/80 flex items-center gap-1 text-sm font-medium">
              <MessageCircle className="h-3.5 w-3.5" />
              {t("blog.comment")} <span className="text-destructive">*</span>
            </label>
            <Textarea
              placeholder={
                language === "en" ? "Share your thoughts..." : "Chia sẻ suy nghĩ của bạn..."
              }
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              required
              disabled={isSubmitting}
              className="bg-background/50 border-border/50 focus-visible:ring-primary/20 focus-visible:border-primary resize-none rounded-xl"
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="bg-primary hover:bg-primary/90 shadow-primary/20 w-full rounded-xl px-8 shadow-md transition-all sm:w-auto"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {language === "en" ? "Submitting..." : "Đang gửi..."}
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                {t("blog.submit")}
              </>
            )}
          </Button>
        </form>
      </div>
    </section>
  )
}
