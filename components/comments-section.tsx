"use client"

import type React from "react"
import type { BlogPost } from "@/context/blog-context"
import { useLanguage } from "@/context/language-context"
import { useBlog } from "@/context/blog-context"
import { useState } from "react"
import { motion } from "framer-motion"
import {
  MessageCircle,
  CheckCircle,
  Loader2,
  User,
  Mail,
  MessageSquare,
  Send,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

/**
 * Comments section — clean, modern design.
 * Features: comment list, reply form, success/error states.
 */
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

  /** Handle form submission */
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
    <section className="mt-12">
      {/* Section header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
            <MessageCircle className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">
              {t("blog.comments")}
            </h2>
            <p className="text-xs text-muted-foreground">
              {post.comments.length} {language === "en" ? "responses" : "phản hồi"}
            </p>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="mb-8 space-y-4">
        {post.comments.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-border p-10 text-center">
            <MessageCircle className="text-muted-foreground/40 mx-auto mb-3 h-10 w-10" />
            <p className="text-muted-foreground text-sm">
              {language === "en"
                ? "No comments yet. Be the first to share your thoughts!"
                : "Chưa có bình luận. Hãy là người đầu tiên chia sẻ suy nghĩ!"}
            </p>
          </div>
        ) : (
          post.comments.map((c, index) => (
            <motion.article
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-sm"
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {c.name.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="font-semibold text-foreground">{c.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {c.createdAt.toLocaleDateString(language === "en" ? "en-US" : "vi-VN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  {/* Comment content */}
                  <p className="mt-2 text-sm leading-relaxed text-foreground/80">
                    {c.content}
                  </p>
                </div>
              </div>
            </motion.article>
          ))
        )}
      </div>

      {/* Comment Form */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="mb-5">
          <h3 className="text-base font-semibold text-foreground mb-1">
            {t("blog.leaveComment")}
          </h3>
          <p className="text-xs text-muted-foreground">
            {language === "en"
              ? "Your email will not be published"
              : "Email của bạn sẽ không được công khai"}
          </p>
        </div>

        {/* Success message */}
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 flex items-center gap-3 rounded-lg bg-primary/10 border border-primary/20 p-4"
          >
            <CheckCircle className="text-primary h-5 w-5 shrink-0" />
            <p className="text-sm text-primary font-medium">
              {language === "en" ? "Comment added successfully!" : "Bình luận đã được thêm!"}
            </p>
          </motion.div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 p-4">
            <p className="text-sm text-destructive">
              {error}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                {t("blog.yourName")} <span className="text-destructive">*</span>
              </label>
              <Input
                placeholder={language === "en" ? "John Doe" : "Nguyễn Văn A"}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                {t("blog.yourEmail")} <span className="text-destructive">*</span>
              </label>
              <Input
                type="email"
                placeholder={language === "en" ? "you@example.com" : "ban@example.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
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
            />
          </div>

          <Button type="submit" size="lg" className="w-full sm:w-auto rounded-lg" disabled={isSubmitting}>
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
