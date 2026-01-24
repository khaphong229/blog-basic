"use client"

import type React from "react"
import type { BlogPost } from "@/context/blog-context"
import { useLanguage } from "@/context/language-context"
import { useBlog } from "@/context/blog-context"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MessageCircle, CheckCircle, Loader2 } from "lucide-react"

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
    <section className="mt-20">
      {/* Visual separator - decorative break */}
      <div className="mb-12 flex items-center justify-center gap-4">
        <div className="via-border h-px flex-1 bg-gradient-to-r from-transparent to-transparent" />
        <MessageCircle className="text-muted-foreground/50 h-6 w-6" />
        <div className="via-border h-px flex-1 bg-gradient-to-l from-transparent to-transparent" />
      </div>

      {/* Comments container with distinct background */}
      <div className="mx-auto max-w-3xl">
        {/* Section header */}
        <div className="mb-8 flex items-baseline justify-between">
          <h2 className="font-serif text-2xl font-bold md:text-3xl">{t("blog.comments")}</h2>
          <span className="text-muted-foreground bg-muted/50 rounded-full px-3 py-1 text-sm">
            {post.comments.length} {language === "en" ? "responses" : "phản hồi"}
          </span>
        </div>

        {/* Comments List */}
        <div className="mb-12 space-y-6">
          {post.comments.length === 0 ? (
            <div className="bg-muted/30 border-border/50 rounded-xl border py-12 text-center">
              <MessageCircle className="text-muted-foreground/40 mx-auto mb-4 h-10 w-10" />
              <p className="text-muted-foreground">
                {language === "en"
                  ? "No comments yet. Be the first to comment!"
                  : "Chưa có bình luận nào. Hãy là người đầu tiên!"}
              </p>
            </div>
          ) : (
            post.comments.map((c) => (
              <article
                key={c.id}
                className="group before:from-primary/30 relative pl-6 before:absolute before:top-0 before:bottom-0 before:left-0 before:w-[2px] before:rounded-full before:bg-gradient-to-b before:to-transparent"
              >
                {/* Comment header */}
                <div className="mb-3 flex items-start gap-3">
                  {/* Avatar */}
                  <div className="from-secondary/20 to-secondary/40 text-secondary flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-medium">
                    {c.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      <span className="text-foreground font-semibold">{c.name}</span>
                      <span className="text-muted-foreground text-xs">
                        {c.createdAt.toLocaleDateString(language === "en" ? "en-US" : "vi-VN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    {/* Comment content */}
                    <p className="text-foreground/85 mt-2 leading-relaxed">{c.content}</p>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>

        {/* Comment Form - distinct container */}
        <div className="from-muted/50 to-muted/20 border-border/50 rounded-2xl border bg-gradient-to-b p-6 md:p-8">
          <h3 className="mb-2 text-xl font-semibold">{t("blog.leaveComment")}</h3>
          <p className="text-muted-foreground mb-6 text-sm">
            {language === "en"
              ? "Your email address will not be published."
              : "Email của bạn sẽ không được công khai."}
          </p>

          {/* Success message */}
          {submitted && (
            <div className="bg-primary/10 border-primary/30 mb-6 flex items-center gap-3 rounded-xl border p-4">
              <CheckCircle className="text-primary h-5 w-5 flex-shrink-0" />
              <p className="text-primary font-medium">
                {language === "en" ? "Thank you for your comment!" : "Cảm ơn bạn đã bình luận!"}
              </p>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="bg-destructive/10 border-destructive/30 mb-6 flex items-center gap-3 rounded-xl border p-4">
              <p className="text-destructive font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-foreground/80 text-sm font-medium">
                  {t("blog.yourName")} <span className="text-destructive">*</span>
                </label>
                <Input
                  placeholder={language === "en" ? "John Doe" : "Nguyễn Văn A"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-foreground/80 text-sm font-medium">
                  {t("blog.yourEmail")} <span className="text-destructive">*</span>
                </label>
                <Input
                  type="email"
                  placeholder={language === "en" ? "you@example.com" : "ban@example.com"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="bg-background/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-foreground/80 text-sm font-medium">
                {t("blog.comment")} <span className="text-destructive">*</span>
              </label>
              <Textarea
                placeholder={
                  language === "en" ? "Write your thoughts..." : "Viết suy nghĩ của bạn..."
                }
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                required
                disabled={isSubmitting}
                className="bg-background/50 resize-none"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full cursor-pointer sm:w-auto"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {language === "en" ? "Submitting..." : "Đang gửi..."}
                </>
              ) : (
                t("blog.submit")
              )}
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}
